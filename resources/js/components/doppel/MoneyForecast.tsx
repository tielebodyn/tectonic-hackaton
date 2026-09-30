import { CalendarDays, ChevronDown, HelpCircle, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import Doppel from '@/components/doppel/Doppel';
import type { Cost, Point } from '@/components/doppel/forecast';
import {
    addDays,
    daysBetween,
    joinEn,
    monthName,
    monthShort,
    monthStarts,
    noWhatIf,
    pickableMonths,
    project,
    valueAt,
} from '@/components/doppel/forecast';
import type {
    Card,
    FaceMood,
    Horizon,
    MascotVariant,
    Monthly,
    SeasonalMoment,
    WhatIf,
} from '@/components/doppel/types';
import { euro, shortDate } from '@/components/doppel/types';
import { cn } from '@/lib/utils';

type Props = {
    horizon: Horizon;
    today: string;
    end: string;
    balanceCents: number;
    monthly: Monthly;
    cards: Card[];
    seasonal: SeasonalMoment[];
    mood: FaceMood;
    variant?: MascotVariant;
    onWhy: (card: Card) => void;
    /** Year view: the chart is the timeline, with a collapsed list below it. */
    yearView?: boolean;
};

/** A checkpoint on the line: a diary card, a yearly moment or your own one-off choice. */
type Pin = {
    key: string;
    day: number;
    date: string;
    cents: number;
    title: string;
    label: string;
    kind: 'card' | 'season' | 'one_off';
    num: number | null;
    card?: Card;
    moment?: SeasonalMoment;
};

const H = 176;
const PAD = { l: 12, r: 16, t: 34, b: 24 };
const AXIS = 36;
const INK = '#0b1f3a';
const KBC = '#00a3e0';
const RED = '#e5484d';
const GREEN = '#2f9e6a';
const ORANGE = '#e2843a';

const signed = (cents: number) =>
    `${cents > 0 ? '+' : cents < 0 ? '−' : ''}${euro(Math.abs(cents))}`;

function shortEuro(cents: number): string {
    const v = cents / 100;
    const sign = v < 0 ? '−' : '';
    const a = Math.abs(v);
    if (a >= 1000) {
        const k = (a / 1000).toFixed(a >= 10000 ? 0 : 1).replace('.0', '');
        return `${sign}€${k}k`;
    }
    return `${sign}€${Math.round(a)}`;
}

function niceStep(raw: number): number {
    const p = 10 ** Math.floor(Math.log10(raw));
    const f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

/** Smooth line that doesn't invent peaks (monotone cubic). */
function smooth(pts: [number, number][]): string {
    const n = pts.length;
    if (n < 2) return '';
    const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
    const s = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
    const m = pts.map((_, i) =>
        i === 0
            ? s[0]
            : i === n - 1
              ? s[n - 2]
              : s[i - 1] * s[i] <= 0
                ? 0
                : (s[i - 1] + s[i]) / 2,
    );
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === 0) {
            m[i] = 0;
            m[i + 1] = 0;
            continue;
        }
        const a = m[i] / s[i];
        const b = m[i + 1] / s[i];
        const h = a * a + b * b;
        if (h > 9) {
            const t = 3 / Math.sqrt(h);
            m[i] = t * a * s[i];
            m[i + 1] = t * b * s[i];
        }
    }
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += ` C${pts[i][0] + h},${pts[i][1] + m[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - m[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
    }
    return d;
}

/** Labels that would touch each other move to the next row. */
function stagger(items: { x: number; w: number }[]): number[] {
    const ends: number[] = [];
    return items.map(({ x, w }) => {
        const left = x - w / 2;
        let row = ends.findIndex((e) => left - e >= 4);
        if (row === -1) {
            row = ends.length;
            ends.push(0);
        }
        ends[row] = x + w / 2;
        return row;
    });
}

function urgencyChip(urgency: number) {
    if (urgency >= 70)
        return { label: 'Urgent', cls: 'bg-orange-100 text-orange-700' };
    if (urgency >= 40) return { label: 'Soon', cls: 'bg-kbc/12 text-kbc' };
    return { label: 'For info', cls: 'bg-ink/6 text-ink/60' };
}

type Tone = 'good' | 'bad' | 'neutral';

function Slider({
    label,
    display,
    tone,
    min,
    max,
    step,
    value,
    onChange,
}: {
    label: string;
    display: string;
    tone: Tone;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (v: number) => void;
}) {
    const pct = (v: number) => ((v - min) / (max - min)) * 100;
    const zero = pct(Math.min(max, Math.max(min, 0)));
    const at = pct(value);
    const fill =
        tone === 'good' ? GREEN : tone === 'bad' ? ORANGE : 'transparent';

    return (
        <label className="block">
            <span className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-semibold text-ink">
                    {label}
                </span>
                <span
                    className={cn(
                        'text-[12px] font-bold whitespace-nowrap tabular-nums',
                        tone === 'good' && 'text-emerald-700',
                        tone === 'bad' && 'text-orange-700',
                        tone === 'neutral' && 'text-ink/40',
                    )}
                >
                    {display}
                </span>
            </span>
            <span className="relative flex h-7 items-center">
                <span className="absolute inset-x-0 h-1.5 rounded-full bg-ink/10" />
                {min < 0 && (
                    <span
                        aria-hidden
                        className="absolute h-3 w-0.5 -translate-x-1/2 rounded-full bg-ink/20"
                        style={{ left: `${zero}%` }}
                    />
                )}
                <span
                    aria-hidden
                    className="absolute h-1.5 rounded-full"
                    style={{
                        left: `${Math.min(zero, at)}%`,
                        width: `${Math.abs(at - zero)}%`,
                        background: fill,
                    }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    aria-label={label}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="relative z-10 h-7 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-ink/10 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(11,31,58,0.25)] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ink/10 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(11,31,58,0.25)]"
                />
            </span>
        </label>
    );
}

/** "My money, month by month": balance lived ahead, moments as checkpoints on the line. */
export default function MoneyForecast({
    horizon,
    today,
    end,
    balanceCents,
    monthly,
    cards,
    seasonal,
    mood,
    variant,
    onWhy,
    yearView = false,
}: Props) {
    const [w, setW] = useState<WhatIf>(noWhatIf);
    const [picked, setPicked] = useState<string | null>(null);
    const [listOpen, setListOpen] = useState(false);
    const scroller = useRef<HTMLDivElement>(null);

    const totalDays = daysBetween(today, end);
    const months = pickableMonths(today, end);
    const oneOffMonth =
        w.one_off_month && months.includes(w.one_off_month)
            ? w.one_off_month
            : months[Math.min(1, months.length - 1)];
    const oneOffDay = Math.min(
        totalDays,
        Math.max(1, daysBetween(today, `${oneOffMonth}-15`)),
    );

    // checkpoints
    const sortedCards = [...cards]
        .filter((c) => c.rule_key !== 'all_good')
        .sort((a, b) => a.expected_on.localeCompare(b.expected_on));
    const pins: Pin[] = [
        ...sortedCards.map((c, i) => ({
            key: `card-${c.rule_key}-${c.id}`,
            day: Math.max(0, daysBetween(today, c.expected_on)),
            date: c.expected_on,
            cents: c.impact_cents ?? 0,
            title: c.title,
            label:
                c.impact_cents !== null
                    ? shortEuro(c.impact_cents)
                    : `${c.confidence}%`,
            kind: 'card' as const,
            num: i + 1,
            card: c,
        })),
        ...seasonal.map((s) => ({
            key: s.key,
            day: daysBetween(today, s.expected_on),
            date: s.expected_on,
            cents: s.impact_cents,
            title: s.title,
            label:
                s.impact_cents !== 0
                    ? `${s.short} ${shortEuro(s.impact_cents)}`
                    : s.short,
            kind: 'season' as const,
            num: null,
            moment: s,
        })),
        ...(w.one_off_cents !== 0
            ? [
                  {
                      key: 'one-off',
                      day: oneOffDay,
                      date: addDays(today, oneOffDay),
                      cents: w.one_off_cents,
                      title:
                          w.one_off_cents < 0
                              ? 'Your one-off expense'
                              : 'Your windfall',
                      label: shortEuro(w.one_off_cents),
                      kind: 'one_off' as const,
                      num: null,
                  },
              ]
            : []),
    ].sort((a, b) => a.day - b.day);

    // Only costs count; money that might come in only counts once it's there.
    const toCost = (p: Pin): Cost => ({
        key: p.key,
        day: p.day,
        cents: p.cents,
        title: p.title,
        date: p.date,
        kind: p.kind,
    });
    const costs = pins
        .filter((p) => p.kind !== 'one_off' && p.cents < 0)
        .map(toCost);
    const oneOff = pins.filter((p) => p.kind === 'one_off').map(toCost);

    const base = project(balanceCents, monthly, totalDays, costs, noWhatIf);
    const mine = project(
        balanceCents,
        monthly,
        totalDays,
        [...costs, ...oneOff],
        w,
    );
    const changed =
        w.spend_delta_cents !== 0 ||
        w.income_pct !== 0 ||
        w.one_off_cents !== 0 ||
        w.saving_cents !== 0;
    const saving = w.saving_cents > 0;

    // scale
    const values = [
        ...base.map((p) => p.balance),
        ...mine.map((p) => p.balance),
        ...(saving ? mine.map((p) => p.saved) : []),
    ];
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = Math.max(hi - lo, Math.abs(hi) * 0.2, 20000);
    const yMin =
        lo < 0 || saving ? Math.min(0, lo) - span * 0.08 : lo - span * 0.2;
    const yMax = hi + span * 0.08;
    const tick = niceStep((yMax - yMin) / 3);
    const ticks: number[] = [];
    for (let v = Math.ceil(yMin / tick) * tick; v <= yMax; v += tick)
        ticks.push(v);

    const W = horizon === 12 ? 700 : 282;
    const x = (day: number) => PAD.l + (day / totalDays) * (W - PAD.l - PAD.r);
    const y = (v: number) =>
        PAD.t + ((yMax - v) / (yMax - yMin)) * (H - PAD.t - PAD.b);
    const bottom = H - PAD.b;
    const zeroY = Math.min(bottom, Math.max(PAD.t, y(0)));
    const zeroAt = Math.min(1, Math.max(0, (zeroY - PAD.t) / (bottom - PAD.t)));

    const pts = (series: Point[], f: 'balance' | 'saved') =>
        series.map((p) => [x(p.day), y(p[f])] as [number, number]);
    const mineLine = smooth(pts(mine, 'balance'));
    const baseLine = smooth(pts(base, 'balance'));
    const savedLine = smooth(pts(mine, 'saved'));
    const area = `${mineLine} L${x(totalDays)},${zeroY} L${x(0)},${zeroY} Z`;

    // month axis
    const gridMonths =
        horizon === 1
            ? []
            : monthStarts(today, end).map((iso) => ({
                  iso,
                  day: daysBetween(today, iso),
              }));
    const xLabels =
        horizon === 1
            ? [10, 20, 30].map((d) => ({
                  key: `d${d}`,
                  x: x(d),
                  label: shortDate(addDays(today, d)).replace(
                      /(\d+) (\w{3})\w*/,
                      '$1 $2',
                  ),
              }))
            : gridMonths
                  .map((m, i) => {
                      const next = gridMonths[i + 1]?.day ?? totalDays;
                      const mid = (m.day + next) / 2;
                      const jan = m.iso.slice(5, 7) === '01';
                      return {
                          key: m.iso,
                          x: x(mid),
                          label: jan
                              ? `${monthShort(m.iso)} '${m.iso.slice(2, 4)}`
                              : monthShort(m.iso),
                          width: x(next) - x(m.day),
                      };
                  })
                  .filter((l) => l.width > 20);

    // pins on the line, close together = stacked
    const placed = pins.map((p, i) => {
        const px = x(p.day);
        const stack = pins
            .slice(0, i)
            .filter((o) => Math.abs(x(o.day) - px) < 20).length;
        return { pin: p, px, py: y(valueAt(mine, p.day)) - stack * 24 };
    });
    const labelRows = stagger(
        placed.map(({ pin, px }) => ({
            x: px,
            w: pin.label.length * 6 + (pin.num !== null ? 26 : 14),
        })),
    );
    const rowCount = Math.max(0, ...labelRows.map((r) => r + 1));

    const selected =
        pins.find((p) => p.key === picked) ??
        (yearView ? (pins.find((p) => p.kind === 'card') ?? pins[0]) : null) ??
        null;

    function pick(p: Pin, scroll = false) {
        setPicked(p.key);
        if (scroll && scroller.current) {
            scroller.current.scrollTo({
                left: Math.max(0, x(p.day) - 120),
                behavior: 'smooth',
            });
        }
    }

    // Doppel tells
    const endLabel = `end of ${monthName(end)}`;
    const endValue = mine[mine.length - 1].balance;
    const endBase = base[base.length - 1].balance;
    const endSaved = mine[mine.length - 1].saved;
    const firstNeg = mine.find((p) => p.balance < 0);
    const tight = endValue < monthly.spend_cents * 0.25;

    const parts: string[] = [];
    if (w.spend_delta_cents > 0)
        parts.push(`spent ${euro(w.spend_delta_cents)} more every month`);
    if (w.spend_delta_cents < 0)
        parts.push(`spent ${euro(-w.spend_delta_cents)} less every month`);
    if (w.income_pct !== 0)
        parts.push(
            `earned ${Math.abs(w.income_pct)}% ${w.income_pct > 0 ? 'more' : 'less'}`,
        );
    if (w.one_off_cents < 0)
        parts.push(
            `spent a one-off ${euro(-w.one_off_cents)} in ${monthName(`${oneOffMonth}-15`)}`,
        );
    if (w.one_off_cents > 0)
        parts.push(
            `got ${euro(w.one_off_cents)} extra in ${monthName(`${oneOffMonth}-15`)}`,
        );

    const negLine = firstNeg
        ? ` Around ${shortDate(addDays(today, firstNeg.day))} I dipped below zero. Then things got tight.`
        : null;
    let story: string;
    if (!changed) {
        story = `As it is, I had ${euro(endValue)} at the ${endLabel}.${negLine ?? (tight ? ' Tight, but I made it.' : ' That felt calm.')}`;
    } else if (parts.length === 0) {
        const bufferMonths = endSaved / Math.max(1, monthly.spend_cents);
        const buffer =
            bufferMonths >= 1
                ? `${Math.floor(bufferMonths)} ${Math.floor(bufferMonths) === 1 ? 'month' : 'months'} of buffer`
                : `${Math.max(1, Math.round(bufferMonths * 4.3))} weeks of buffer`;
        story = `Saving ${euro(w.saving_cents)} a month, I had ${euro(endSaved)} put aside by the ${endLabel}, good for ${buffer}.${negLine ? ' But my current account dipped below zero for a while.' : ''}`;
    } else {
        if (saving) parts.push(`saved ${euro(w.saving_cents)} a month`);
        const diff = endValue + endSaved - endBase;
        const verdict =
            negLine ??
            (tight
                ? ' Then things got tight.'
                : diff > 0
                  ? ` That's ${euro(diff)} more than as it is.`
                  : diff < 0
                    ? ` ${euro(-diff)} less than as it is, but I made it.`
                    : '');
        story = `If you ${joinEn(parts)}, I had ${euro(endValue)} at the ${endLabel}.${verdict}`;
    }
    const storyMood: FaceMood = firstNeg || tight ? 'worried' : mood;

    const set = (patch: Partial<WhatIf>) =>
        setW((cur) => ({ ...cur, ...patch }));
    const incomeCents = Math.round((monthly.income_cents * w.income_pct) / 100);

    const pinColor = (p: Pin, v: number) =>
        p.kind === 'one_off'
            ? p.cents < 0
                ? ORANGE
                : GREEN
            : p.kind === 'season'
              ? INK
              : v < 0
                ? RED
                : INK;

    return (
        <section className={yearView ? 'mt-4' : 'mt-9'}>
            {!yearView && (
                <>
                    <h2 className="text-[22px] font-bold tracking-tight">
                        My money, month by month
                    </h2>
                    <p className="mt-0.5 text-[13px] text-ink/55">
                        This is how my account looked. Go ahead and slide, I'll
                        live it again right away.
                    </p>
                </>
            )}

            {/* chart = timeline */}
            <div
                className={cn(
                    'animate-doppel-rise rounded-[28px] bg-[#f4f6fa] p-4',
                    !yearView && 'mt-4',
                )}
            >
                <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[12px] text-ink/50">
                            In my account, {endLabel}
                        </p>
                        <p
                            className={cn(
                                'text-[28px] leading-tight font-bold tracking-tight tabular-nums transition-colors',
                                endValue < 0 ? 'text-[#e5484d]' : 'text-ink',
                            )}
                        >
                            {euro(endValue)}
                        </p>
                    </div>
                    <div className="shrink-0 pb-1 text-right text-[12px] leading-snug">
                        {changed ? (
                            <p className="text-ink/50">
                                As it is {euro(endBase)}
                            </p>
                        ) : (
                            <p className="text-ink/50">
                                Today {euro(balanceCents)}
                            </p>
                        )}
                        {saving && (
                            <p className="font-semibold text-emerald-700">
                                + {euro(endSaved)} saved
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative mt-2 -mr-4 flex">
                    {/* fixed y axis */}
                    <svg
                        width={AXIS}
                        height={H}
                        className="shrink-0 overflow-visible"
                        aria-hidden
                    >
                        {ticks.map((t) => (
                            <text
                                key={t}
                                x={AXIS - 6}
                                y={y(t) + 3.5}
                                textAnchor="end"
                                className="text-[10px] tabular-nums"
                                fill={t === 0 ? RED : INK}
                                fillOpacity={t === 0 ? 1 : 0.4}
                            >
                                {shortEuro(t)}
                            </text>
                        ))}
                    </svg>

                    <div
                        ref={scroller}
                        className="min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto overscroll-x-contain pr-4"
                    >
                        <div className="relative" style={{ width: W }}>
                            <svg
                                width={W}
                                height={H}
                                className="block overflow-visible"
                                role="img"
                                aria-label={`Expected balance until the ${endLabel}`}
                            >
                                <defs>
                                    <linearGradient
                                        id="mf-stroke"
                                        gradientUnits="userSpaceOnUse"
                                        x1="0"
                                        x2="0"
                                        y1={PAD.t}
                                        y2={bottom}
                                    >
                                        <stop offset={zeroAt} stopColor={KBC} />
                                        <stop offset={zeroAt} stopColor={RED} />
                                    </linearGradient>
                                    <linearGradient
                                        id="mf-area"
                                        gradientUnits="userSpaceOnUse"
                                        x1="0"
                                        x2="0"
                                        y1={PAD.t}
                                        y2={bottom}
                                    >
                                        <stop
                                            offset={0}
                                            stopColor={KBC}
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset={zeroAt}
                                            stopColor={KBC}
                                            stopOpacity={0.03}
                                        />
                                        <stop
                                            offset={zeroAt}
                                            stopColor={RED}
                                            stopOpacity={0.06}
                                        />
                                        <stop
                                            offset={1}
                                            stopColor={RED}
                                            stopOpacity={0.22}
                                        />
                                    </linearGradient>
                                </defs>

                                {ticks.map((t) => (
                                    <line
                                        key={t}
                                        x1={0}
                                        x2={W}
                                        y1={y(t)}
                                        y2={y(t)}
                                        stroke={t === 0 ? RED : INK}
                                        strokeOpacity={t === 0 ? 0.35 : 0.07}
                                        strokeDasharray={
                                            t === 0 ? '3 3' : undefined
                                        }
                                    />
                                ))}
                                {gridMonths.map((m) => (
                                    <line
                                        key={m.iso}
                                        x1={x(m.day)}
                                        x2={x(m.day)}
                                        y1={PAD.t - 6}
                                        y2={bottom + 4}
                                        stroke={INK}
                                        strokeOpacity={0.06}
                                    />
                                ))}
                                {xLabels.map((l) => (
                                    <text
                                        key={l.key}
                                        x={l.x}
                                        y={H - 6}
                                        textAnchor="middle"
                                        className="text-[10px]"
                                        fill={INK}
                                        fillOpacity={0.45}
                                    >
                                        {l.label}
                                    </text>
                                ))}

                                <path d={area} fill="url(#mf-area)" />
                                {changed && (
                                    <path
                                        d={baseLine}
                                        fill="none"
                                        stroke={INK}
                                        strokeOpacity={0.35}
                                        strokeWidth={1.5}
                                        strokeDasharray="4 4"
                                    />
                                )}
                                {saving && (
                                    <path
                                        d={savedLine}
                                        fill="none"
                                        stroke={GREEN}
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                )}
                                <path
                                    d={mineLine}
                                    fill="none"
                                    stroke="url(#mf-stroke)"
                                    strokeWidth={2.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={
                                        changed ? undefined : '5 4'
                                    }
                                />
                                {selected && (
                                    <line
                                        x1={x(selected.day)}
                                        x2={x(selected.day)}
                                        y1={y(valueAt(mine, selected.day))}
                                        y2={bottom}
                                        stroke={INK}
                                        strokeOpacity={0.25}
                                        strokeDasharray="2 3"
                                    />
                                )}
                            </svg>

                            {/* now */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                                style={{ left: x(0), top: y(balanceCents) }}
                            >
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-kbc/40" />
                                <span className="relative size-3 rounded-full border-[3px] border-white bg-kbc shadow" />
                            </span>

                            {/* checkpoints */}
                            {placed.map(({ pin, px, py }) => {
                                const active = selected?.key === pin.key;
                                const color = pinColor(
                                    pin,
                                    valueAt(mine, pin.day),
                                );
                                return (
                                    <button
                                        key={pin.key}
                                        type="button"
                                        onClick={() => pick(pin)}
                                        aria-label={`${shortDate(pin.date)}: ${pin.title}`}
                                        className={cn(
                                            'absolute z-10 grid size-[22px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-[11px] font-bold tabular-nums shadow-sm transition-[top,transform] duration-300',
                                            active
                                                ? 'scale-115 text-white'
                                                : 'bg-white',
                                            pin.kind === 'season' &&
                                                !active &&
                                                'border-dashed',
                                        )}
                                        style={{
                                            left: px,
                                            top: py,
                                            borderColor: active
                                                ? 'white'
                                                : color,
                                            color: active ? 'white' : color,
                                            background: active
                                                ? color
                                                : undefined,
                                        }}
                                    >
                                        {pin.num ?? (
                                            <CalendarDays className="size-3" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* short labels below the axis */}
                        {pins.length > 0 && (
                            <div
                                className="relative mt-1"
                                style={{ width: W, height: rowCount * 24 }}
                            >
                                {placed.map(({ pin, px }, i) => {
                                    const active = selected?.key === pin.key;
                                    return (
                                        <button
                                            key={pin.key}
                                            type="button"
                                            onClick={() => pick(pin)}
                                            className={cn(
                                                'absolute flex h-5 -translate-x-1/2 items-center gap-1 rounded-full px-1.5 text-[10px] font-semibold whitespace-nowrap tabular-nums transition-colors',
                                                active
                                                    ? 'bg-ink text-white'
                                                    : pin.kind === 'season'
                                                      ? 'border border-dashed border-ink/20 text-ink/55'
                                                      : 'bg-white text-ink/70',
                                            )}
                                            style={{
                                                left: Math.max(
                                                    30,
                                                    Math.min(W - 30, px),
                                                ),
                                                top: labelRows[i] * 24,
                                            }}
                                        >
                                            {pin.num !== null && (
                                                <span
                                                    className={cn(
                                                        'grid size-3.5 place-items-center rounded-full text-[9px]',
                                                        active
                                                            ? 'bg-white/20'
                                                            : 'bg-ink/8',
                                                    )}
                                                >
                                                    {pin.num}
                                                </span>
                                            )}
                                            {pin.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* detail of the chosen checkpoint */}
                {selected && (
                    <PinDetail
                        key={selected.key}
                        pin={selected}
                        after={valueAt(mine, selected.day)}
                        onWhy={onWhy}
                    />
                )}

                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/50">
                    <span className="flex items-center gap-1.5">
                        <span className="w-4 border-t-2 border-dashed border-ink/35" />
                        As it is
                    </span>
                    {changed && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 border-t-[2.5px] border-kbc" />
                            With your choices
                        </span>
                    )}
                    {saving && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 border-t-2 border-emerald-600" />
                            Saved
                        </span>
                    )}
                    {horizon === 12 && (
                        <span className="ml-auto text-ink/40">
                            Swipe for the whole year →
                        </span>
                    )}
                </p>
            </div>

            {/* Doppel tells */}
            <div className="mt-4 flex items-end gap-2">
                <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-kbc/10">
                    <Doppel
                        mood={storyMood}
                        variant={variant ?? 'backpack'}
                        size={38}
                    />
                </div>
                <div className="relative flex-1 rounded-[20px] rounded-bl-md bg-white px-4 py-3 shadow-[0_10px_30px_rgba(11,31,58,0.08)]">
                    <p
                        aria-live="polite"
                        className="text-[14px] leading-snug font-semibold text-ink"
                    >
                        {story}
                    </p>
                </div>
            </div>

            {/* what if */}
            <div className="mt-4 flex flex-col gap-3 rounded-[28px] bg-[#f4f6fa] p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold">What if...</h3>
                    <button
                        type="button"
                        onClick={() => setW(noWhatIf)}
                        disabled={!changed}
                        className="flex items-center gap-1 text-[12px] font-semibold text-kbc transition-opacity disabled:opacity-0"
                    >
                        <RotateCcw className="size-3.5" />
                        Back to as it is
                    </button>
                </div>

                <Slider
                    label="Monthly spending"
                    display={
                        w.spend_delta_cents === 0
                            ? 'As it is'
                            : `${signed(w.spend_delta_cents)} ${w.spend_delta_cents > 0 ? 'more' : 'less'} per month`
                    }
                    tone={
                        w.spend_delta_cents > 0
                            ? 'bad'
                            : w.spend_delta_cents < 0
                              ? 'good'
                              : 'neutral'
                    }
                    min={-50000}
                    max={50000}
                    step={2500}
                    value={w.spend_delta_cents}
                    onChange={(v) => set({ spend_delta_cents: v })}
                />

                <Slider
                    label="Income"
                    display={
                        w.income_pct === 0
                            ? 'As it is'
                            : `${w.income_pct > 0 ? '+' : '−'}${Math.abs(w.income_pct)}% · ${signed(incomeCents)}/month`
                    }
                    tone={
                        w.income_pct > 0
                            ? 'good'
                            : w.income_pct < 0
                              ? 'bad'
                              : 'neutral'
                    }
                    min={-30}
                    max={30}
                    step={5}
                    value={w.income_pct}
                    onChange={(v) => set({ income_pct: v })}
                />

                <div>
                    <Slider
                        label="One-off"
                        display={
                            w.one_off_cents === 0
                                ? 'Expense or windfall'
                                : `${signed(w.one_off_cents)} ${w.one_off_cents < 0 ? 'expense' : 'windfall'}`
                        }
                        tone={
                            w.one_off_cents > 0
                                ? 'good'
                                : w.one_off_cents < 0
                                  ? 'bad'
                                  : 'neutral'
                        }
                        min={-1000000}
                        max={1000000}
                        step={10000}
                        value={w.one_off_cents}
                        onChange={(v) => set({ one_off_cents: v })}
                    />
                    {w.one_off_cents !== 0 && months.length > 1 && (
                        <div className="mt-1 flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
                            {months.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => set({ one_off_month: m })}
                                    className={cn(
                                        'shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors',
                                        m === oneOffMonth
                                            ? 'bg-ink text-white'
                                            : 'bg-white text-ink/60 hover:bg-ink/8',
                                    )}
                                >
                                    {monthShort(`${m}-15`)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Slider
                    label="Saving"
                    display={
                        w.saving_cents === 0
                            ? 'Nothing aside'
                            : `${euro(w.saving_cents)} per month`
                    }
                    tone={saving ? 'good' : 'neutral'}
                    min={0}
                    max={50000}
                    step={2500}
                    value={w.saving_cents}
                    onChange={(v) => set({ saving_cents: v })}
                />
            </div>
            {/* collapsed list */}
            {yearView && pins.length > 0 && (
                <div className="mt-3 rounded-[24px] bg-[#f4f6fa]">
                    <button
                        type="button"
                        onClick={() => setListOpen((o) => !o)}
                        aria-expanded={listOpen}
                        className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-semibold"
                    >
                        All moments ({pins.length})
                        <ChevronDown
                            className={cn(
                                'size-4 text-ink/50 transition-transform',
                                listOpen && 'rotate-180',
                            )}
                        />
                    </button>
                    {listOpen && (
                        <ul className="flex flex-col gap-1 px-2 pb-2">
                            {pins.map((p) => (
                                <li key={p.key}>
                                    <button
                                        type="button"
                                        onClick={() => pick(p, true)}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors',
                                            selected?.key === p.key
                                                ? 'bg-white'
                                                : 'hover:bg-white/60',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                                                p.kind === 'season'
                                                    ? 'border border-dashed border-ink/25 text-ink/50'
                                                    : 'bg-ink text-white',
                                            )}
                                        >
                                            {p.num ?? (
                                                <CalendarDays className="size-3" />
                                            )}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[13px] font-semibold">
                                                {p.title}
                                            </span>
                                            <span className="block text-[11px] text-ink/50">
                                                {shortDate(p.date)}
                                                {p.kind === 'season' &&
                                                    ' · expected'}
                                            </span>
                                        </span>
                                        {p.cents !== 0 && (
                                            <span className="shrink-0 text-[12px] font-bold tabular-nums">
                                                {signed(p.cents)}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}

function PinDetail({
    pin,
    after,
    onWhy,
}: {
    pin: Pin;
    after: number;
    onWhy: (card: Card) => void;
}) {
    const card = pin.card;
    const chip = card
        ? urgencyChip(card.urgency)
        : pin.kind === 'season'
          ? { label: 'Expected', cls: 'bg-ink/6 text-ink/55' }
          : { label: 'Your choice', cls: 'bg-orange-100 text-orange-700' };
    const body = card?.body ?? pin.moment?.body ?? null;

    return (
        <article className="mt-3 animate-doppel-rise rounded-[20px] bg-white p-3.5">
            <header className="flex items-center gap-2">
                <span
                    className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-bold',
                        chip.cls,
                    )}
                >
                    {chip.label}
                </span>
                <span className="text-[12px] text-ink/50">
                    {shortDate(pin.date)}
                </span>
                <span className="flex-1" />
                {card && (
                    <span className="text-[12px] font-semibold text-ink/55">
                        {card.confidence}% sure
                    </span>
                )}
                {pin.cents !== 0 && (
                    <span className="text-[13px] font-bold tabular-nums">
                        {euro(pin.cents)}
                    </span>
                )}
            </header>
            <h3 className="mt-2 text-[15px] leading-snug font-bold">
                {pin.title}
            </h3>
            {body && (
                <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-ink/60">
                    {body}
                </p>
            )}
            <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[12px] text-ink/50">
                    After that I had{' '}
                    <span
                        className={cn(
                            'font-bold',
                            after < 0 ? 'text-[#e5484d]' : 'text-ink',
                        )}
                    >
                        {euro(after)}
                    </span>
                </span>
                {card && card.signals.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onWhy(card)}
                        className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-kbc"
                    >
                        <HelpCircle className="size-3.5" />
                        Why do I think that?
                    </button>
                )}
            </div>
        </article>
    );
}
