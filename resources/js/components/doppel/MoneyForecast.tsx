import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import Doppel from '@/components/doppel/Doppel';
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
import type { Cost, Point } from '@/components/doppel/forecast';
import {
    addDays,
    daysBetween,
    joinNl,
    monthKey,
    monthName,
    monthShort,
    monthStarts,
    noWhatIf,
    pickableMonths,
    project,
    valueAt,
} from '@/components/doppel/forecast';
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
};

const W = 318;
const H = 190;
const PAD = { l: 40, r: 10, t: 14, b: 24 };
const INK = '#0b1f3a';
const KBC = '#00a3e0';
const RED = '#e5484d';
const GREEN = '#2f9e6a';

const signed = (cents: number) =>
    `${cents > 0 ? '+' : cents < 0 ? '−' : ''}${euro(Math.abs(cents))}`;

function shortEuro(cents: number): string {
    const v = cents / 100;
    if (Math.abs(v) >= 1000) {
        const k = (v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1);
        return `€${k.replace('.', ',').replace(',0', '')}k`;
    }
    return `€${Math.round(v)}`;
}

function niceStep(raw: number): number {
    const p = 10 ** Math.floor(Math.log10(raw));
    const f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

/** Vloeiende lijn die geen pieken verzint (monotone cubic). */
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
    hints,
}: {
    label: string;
    display: string;
    tone: Tone;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (v: number) => void;
    hints: [string, string];
}) {
    const pct = (v: number) => ((v - min) / (max - min)) * 100;
    const zero = pct(Math.min(max, Math.max(min, 0)));
    const at = pct(value);
    const fill =
        tone === 'good' ? GREEN : tone === 'bad' ? '#e2843a' : 'transparent';

    return (
        <label className="block">
            <span className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] font-semibold text-ink">
                    {label}
                </span>
                <span
                    className={cn(
                        'text-[13px] font-bold tabular-nums',
                        tone === 'good' && 'text-emerald-700',
                        tone === 'bad' && 'text-orange-700',
                        tone === 'neutral' && 'text-ink/45',
                    )}
                >
                    {display}
                </span>
            </span>
            <span className="relative mt-2 flex h-7 items-center">
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
                    className="absolute h-1.5 rounded-full transition-[background] duration-300"
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
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="relative z-10 h-7 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-ink/10 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(11,31,58,0.25)] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ink/10 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(11,31,58,0.25)]"
                />
            </span>
            <span className="mt-0.5 flex justify-between text-[11px] text-ink/40">
                <span>{hints[0]}</span>
                <span>{hints[1]}</span>
            </span>
        </label>
    );
}

/** "Mijn geld, maand per maand": saldo vooruit geleefd, met knoppen om zelf te schuiven. */
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
}: Props) {
    const [w, setW] = useState<WhatIf>(noWhatIf);
    const [hover, setHover] = useState<number | null>(null);

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

    // Enkel kosten tellen; geld dat misschien binnenkomt telt pas als het er is.
    const costs: Cost[] = [
        ...cards
            .filter((c) => (c.impact_cents ?? 0) < 0)
            .map((c) => ({
                key: `card-${c.rule_key}-${c.id}`,
                day: Math.max(0, daysBetween(today, c.expected_on)),
                cents: c.impact_cents ?? 0,
                title: c.title,
                date: c.expected_on,
                kind: 'card' as const,
            })),
        ...seasonal
            .filter((s) => s.impact_cents < 0)
            .map((s) => ({
                key: s.key,
                day: daysBetween(today, s.expected_on),
                cents: s.impact_cents,
                title: s.title,
                date: s.expected_on,
                kind: 'season' as const,
            })),
    ];
    const oneOff: Cost[] =
        w.one_off_cents !== 0
            ? [
                  {
                      key: 'one-off',
                      day: oneOffDay,
                      cents: w.one_off_cents,
                      title:
                          w.one_off_cents < 0
                              ? 'Jouw eenmalige uitgave'
                              : 'Jouw meevaller',
                      date: addDays(today, oneOffDay),
                      kind: 'one_off',
                  },
              ]
            : [];

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

    // schaal
    const values = [
        ...base.map((p) => p.balance),
        ...mine.map((p) => p.balance),
        ...(saving ? mine.map((p) => p.saved) : []),
    ];
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = Math.max(hi - lo, Math.abs(hi) * 0.2, 20000);
    const yMin =
        lo < 0 || saving ? Math.min(0, lo) - span * 0.08 : lo - span * 0.25;
    const yMax = hi + span * 0.1;
    const tick = niceStep((yMax - yMin) / 3.5);
    const ticks: number[] = [];
    for (let v = Math.ceil(yMin / tick) * tick; v <= yMax; v += tick)
        ticks.push(v);

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

    // x-as
    const xTicks =
        horizon === 1
            ? [10, 20, 30].map((d) => ({
                  day: d,
                  label: shortDate(addDays(today, d)).replace(
                      /(\d+) (\w{3})\w*/,
                      '$1 $2',
                  ),
              }))
            : monthStarts(today, end)
                  .filter((_, i) => horizon === 3 || i % 2 === 1)
                  .map((iso) => ({
                      day: daysBetween(today, iso),
                      label: monthShort(iso),
                  }))
                  .filter((t) => t.day >= 8);

    // uitlezing
    const focus = hover ?? totalDays;
    const focusValue = valueAt(mine, focus);
    const focusBase = valueAt(base, focus);
    const focusSaved = valueAt(mine, focus, 'saved');
    const focusDate = addDays(today, focus);
    const nearPin =
        hover === null
            ? null
            : ([...costs, ...oneOff]
                  .map((c) => ({ c, d: Math.abs(c.day - hover) }))
                  .filter((o) => o.d <= Math.max(2, totalDays * 0.03))
                  .sort((a, b) => a.d - b.d)[0]?.c ?? null);

    function scrub(e: React.PointerEvent<SVGSVGElement>) {
        const r = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W;
        const f = (px - PAD.l) / (W - PAD.l - PAD.r);
        setHover(Math.round(Math.min(1, Math.max(0, f)) * totalDays));
    }

    // Doppel vertelt
    const endLabel = `eind ${monthName(end)}`;
    const endValue = mine[mine.length - 1].balance;
    const endBase = base[base.length - 1].balance;
    const endSaved = mine[mine.length - 1].saved;
    const firstNeg = mine.find((p) => p.balance < 0);
    const tight = endValue < monthly.spend_cents * 0.25;

    const parts: string[] = [];
    if (w.spend_delta_cents > 0)
        parts.push(`elke maand ${euro(w.spend_delta_cents)} meer uitgeeft`);
    if (w.spend_delta_cents < 0)
        parts.push(`elke maand ${euro(-w.spend_delta_cents)} minder uitgeeft`);
    if (w.income_pct !== 0)
        parts.push(
            `${Math.abs(w.income_pct)}% ${w.income_pct > 0 ? 'meer' : 'minder'} verdient`,
        );
    if (w.one_off_cents < 0)
        parts.push(
            `in ${monthName(`${oneOffMonth}-15`)} eenmalig ${euro(-w.one_off_cents)} uitgeeft`,
        );
    if (w.one_off_cents > 0)
        parts.push(
            `in ${monthName(`${oneOffMonth}-15`)} ${euro(w.one_off_cents)} extra krijgt`,
        );

    const negLine = firstNeg
        ? ` Rond ${shortDate(addDays(today, firstNeg.day))} zakte ik onder nul. Dan werd het krap.`
        : null;
    let story: string;
    if (!changed) {
        story = `Zoals nu stond ik ${endLabel} op ${euro(endValue)}.${negLine ?? (tight ? ' Krap, maar het lukte.' : ' Dat voelde rustig.')}`;
    } else if (parts.length === 0) {
        const bufferMonths = endSaved / Math.max(1, monthly.spend_cents);
        const buffer =
            bufferMonths >= 1
                ? `${Math.floor(bufferMonths)} ${Math.floor(bufferMonths) === 1 ? 'maand' : 'maanden'} buffer`
                : `${Math.max(1, Math.round(bufferMonths * 4.3))} weken buffer`;
        story = `Met ${euro(w.saving_cents)} per maand sparen had ik ${endLabel} ${euro(endSaved)} opzij, goed voor ${buffer}.${negLine ? ' Maar mijn zichtrekening ging even onder nul.' : ''}`;
    } else {
        if (saving) parts.push(`${euro(w.saving_cents)} per maand spaart`);
        const diff = endValue + endSaved - endBase;
        const verdict =
            negLine ??
            (tight
                ? ' Dan werd het krap.'
                : diff > 0
                  ? ` Dat is ${euro(diff)} meer dan zoals nu.`
                  : diff < 0
                    ? ` ${euro(-diff)} minder dan zoals nu, maar het lukte.`
                    : '');
        story = `Als je ${joinNl(parts)}, stond ik ${endLabel} op ${euro(endValue)}.${verdict}`;
    }
    const storyMood: FaceMood = firstNeg || tight ? 'worried' : mood;

    const set = (patch: Partial<WhatIf>) =>
        setW((cur) => ({ ...cur, ...patch }));
    const incomeCents = Math.round((monthly.income_cents * w.income_pct) / 100);

    return (
        <section className="mt-9">
            <h2 className="text-[22px] font-bold tracking-tight">
                Mijn geld, maand per maand
            </h2>
            <p className="mt-0.5 text-[13px] text-ink/55">
                Zo zag mijn rekening eruit. Schuif gerust, ik leef het meteen
                opnieuw.
            </p>

            {/* grafiek */}
            <div className="mt-4 rounded-[28px] bg-[#f4f6fa] p-4">
                <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[12px] text-ink/50">
                            {hover === null
                                ? `Op mijn rekening, ${endLabel}`
                                : `Op mijn rekening, ${shortDate(focusDate)}`}
                        </p>
                        <p
                            className={cn(
                                'text-[28px] leading-tight font-bold tracking-tight tabular-nums transition-colors',
                                focusValue < 0 ? 'text-[#e5484d]' : 'text-ink',
                            )}
                        >
                            {euro(focusValue)}
                        </p>
                    </div>
                    <div className="shrink-0 pb-1 text-right text-[12px] leading-snug">
                        {changed && (
                            <p className="text-ink/50">
                                Zoals nu {euro(focusBase)}
                            </p>
                        )}
                        {saving && (
                            <p className="font-semibold text-emerald-700">
                                + {euro(focusSaved)} gespaard
                            </p>
                        )}
                    </div>
                </div>

                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="mt-2 w-full touch-pan-y overflow-visible select-none"
                    onPointerMove={scrub}
                    onPointerDown={scrub}
                    onPointerLeave={() => setHover(null)}
                    role="img"
                    aria-label={`Verwacht saldo tot ${endLabel}`}
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
                        <g key={t}>
                            <line
                                x1={PAD.l}
                                x2={W - PAD.r}
                                y1={y(t)}
                                y2={y(t)}
                                stroke={t === 0 ? RED : INK}
                                strokeOpacity={t === 0 ? 0.35 : 0.07}
                                strokeDasharray={t === 0 ? '3 3' : undefined}
                            />
                            <text
                                x={PAD.l - 8}
                                y={y(t) + 3.5}
                                textAnchor="end"
                                className="fill-ink/40 text-[10px] tabular-nums"
                                style={t === 0 ? { fill: RED } : undefined}
                            >
                                {shortEuro(t)}
                            </text>
                        </g>
                    ))}
                    {xTicks.map((t) => (
                        <text
                            key={t.day}
                            x={x(t.day)}
                            y={H - 6}
                            textAnchor="middle"
                            className="fill-ink/40 text-[10px]"
                        >
                            {t.label}
                        </text>
                    ))}
                    <text
                        x={x(0)}
                        y={H - 6}
                        textAnchor="start"
                        className="fill-ink/40 text-[10px]"
                    >
                        nu
                    </text>

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
                        strokeDasharray={changed ? undefined : '5 4'}
                    />

                    {/* momenten uit het dagboek */}
                    {[...costs, ...oneOff].map((c) => {
                        const v = valueAt(mine, c.day);
                        const active = nearPin?.key === c.key;
                        return (
                            <circle
                                key={c.key}
                                cx={x(c.day)}
                                cy={y(v)}
                                r={active ? 5.5 : 4}
                                fill={c.kind === 'season' ? '#f4f6fa' : 'white'}
                                stroke={
                                    c.kind === 'one_off'
                                        ? c.cents < 0
                                            ? '#e2843a'
                                            : GREEN
                                        : c.kind === 'season'
                                          ? INK
                                          : v < 0
                                            ? RED
                                            : KBC
                                }
                                strokeOpacity={c.kind === 'season' ? 0.45 : 1}
                                strokeWidth={2}
                                strokeDasharray={
                                    c.kind === 'season' ? '2 1.5' : undefined
                                }
                            />
                        );
                    })}

                    {hover !== null && (
                        <g pointerEvents="none">
                            <line
                                x1={x(hover)}
                                x2={x(hover)}
                                y1={PAD.t}
                                y2={bottom}
                                stroke={INK}
                                strokeOpacity={0.15}
                            />
                            <circle
                                cx={x(hover)}
                                cy={y(focusValue)}
                                r={5}
                                fill={focusValue < 0 ? RED : KBC}
                                stroke="white"
                                strokeWidth={2}
                            />
                        </g>
                    )}
                </svg>

                <p className="mt-1 min-h-[18px] truncate text-[12px] text-ink/60">
                    {nearPin ? (
                        <>
                            <span className="font-semibold text-ink">
                                {shortDate(nearPin.date)}
                            </span>{' '}
                            · {nearPin.title} ·{' '}
                            <span className="font-semibold text-ink">
                                {signed(nearPin.cents)}
                            </span>
                        </>
                    ) : (
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/50">
                            <span className="flex items-center gap-1.5">
                                <span className="w-4 border-t-2 border-dashed border-ink/35" />
                                Zoals nu
                            </span>
                            {changed && (
                                <span className="flex items-center gap-1.5">
                                    <span className="w-4 border-t-[2.5px] border-kbc" />
                                    Met jouw keuzes
                                </span>
                            )}
                            {saving && (
                                <span className="flex items-center gap-1.5">
                                    <span className="w-4 border-t-2 border-emerald-600" />
                                    Gespaard
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full border-2 border-kbc bg-white" />
                                Moment
                            </span>
                        </span>
                    )}
                </p>
            </div>

            {/* Doppel vertelt */}
            <div className="mt-3 flex items-end gap-2">
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

            {/* knoppen */}
            <div className="mt-4 flex flex-col gap-5 rounded-[28px] bg-[#f4f6fa] p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold">Wat als...</h3>
                    <button
                        type="button"
                        onClick={() => setW(noWhatIf)}
                        disabled={!changed}
                        className="flex items-center gap-1 text-[12px] font-semibold text-kbc transition-opacity disabled:opacity-0"
                    >
                        <RotateCcw className="size-3.5" />
                        Terug naar zoals nu
                    </button>
                </div>

                <Slider
                    label="Elke maand uitgeven"
                    display={
                        w.spend_delta_cents === 0
                            ? 'Zoals nu'
                            : `${signed(w.spend_delta_cents)} ${w.spend_delta_cents > 0 ? 'meer' : 'minder'} per maand`
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
                    hints={['Minder uitgeven', 'Meer uitgeven']}
                />

                <Slider
                    label="Inkomen"
                    display={
                        w.income_pct === 0
                            ? 'Zoals nu'
                            : `${w.income_pct > 0 ? '+' : '−'}${Math.abs(w.income_pct)}% · ${signed(incomeCents)}/maand`
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
                    hints={['−30%', '+30%']}
                />

                <div>
                    <Slider
                        label="Eenmalige uitgave of meevaller"
                        display={
                            w.one_off_cents === 0
                                ? 'Niets'
                                : `${signed(w.one_off_cents)} ${w.one_off_cents < 0 ? 'uitgave' : 'meevaller'}`
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
                        hints={['Uitgave', 'Meevaller']}
                    />
                    {months.length > 1 && (
                        <div className="mt-2 flex [scrollbar-width:none] gap-1.5 overflow-x-auto">
                            {months.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => set({ one_off_month: m })}
                                    className={cn(
                                        'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
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
                    {months.length === 1 && (
                        <p className="mt-1 text-[11px] text-ink/40">
                            Landt half{' '}
                            {monthName(`${monthKey(oneOffMonth)}-15`)}.
                        </p>
                    )}
                </div>

                <Slider
                    label="Sparen"
                    display={
                        w.saving_cents === 0
                            ? 'Niets opzij'
                            : `${euro(w.saving_cents)} per maand`
                    }
                    tone={saving ? 'good' : 'neutral'}
                    min={0}
                    max={50000}
                    step={2500}
                    value={w.saving_cents}
                    onChange={(v) => set({ saving_cents: v })}
                    hints={['€0', '€500 per maand']}
                />
            </div>
        </section>
    );
}
