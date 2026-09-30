import { useState } from 'react';
import { MONTHS, monthName, nice, short } from '../../data/portfolio';
import type { YearItem } from '../../data/portfolio';
import { cn } from '@/lib/utils';

const W = 1000;
const H = 300;

/** Monotone cubic (Fritsch–Carlson): smooth, but never invents peaks the data doesn't have. */
function smooth(pts: [number, number][]): string {
    const n = pts.length;

    if (n < 2) {
        return '';
    }

    const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
    const slope = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
    const m = pts.map((_, i) => {
        if (i === 0) {
            return slope[0];
        }

        if (i === n - 1) {
            return slope[n - 2];
        }

        return slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
    });

    for (let i = 0; i < n - 1; i++) {
        if (slope[i] === 0) {
            m[i] = 0;
            m[i + 1] = 0;
            continue;
        }

        const a = m[i] / slope[i];
        const b = m[i + 1] / slope[i];
        const h = a * a + b * b;

        if (h > 9) {
            const t = 3 / Math.sqrt(h);
            m[i] = t * a * slope[i];
            m[i + 1] = t * b * slope[i];
        }
    }

    let d = `M${pts[0][0]},${pts[0][1]}`;

    for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += ` C${pts[i][0] + h},${pts[i][1] + m[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - m[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
    }

    return d;
}

/** Projected money on your accounts, today → Sep 2027, with the moments pinned on the line. */
export function BalanceChart({
    points,
    baseline,
    items,
    selectedId,
    onSelect,
}: {
    points: number[];
    baseline: number[];
    items: YearItem[];
    selectedId?: string;
    onSelect: (id: string) => void;
}) {
    const [hover, setHover] = useState<number | null>(null);

    const all = [...points, ...baseline];
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const span = Math.max(hi - lo, Math.abs(hi) * 0.2, 10000);
    const yMin = lo < 0 ? lo - span * 0.12 : Math.max(0, lo - span * 0.35);
    const yMax = hi + span * 0.12;
    const step = nice((yMax - yMin) / 4);
    const ticks: number[] = [];

    for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) {
        ticks.push(v);
    }

    const x = (i: number) => (i / 12) * W;
    const y = (v: number) => H - ((v - yMin) / (yMax - yMin)) * H;
    const pct = (v: number) => (y(v) / H) * 100;
    const at = (series: number[], days: number) => {
        const f = Math.min(12, (days / 365) * 12);
        const i = Math.floor(f);
        const next = series[Math.min(12, i + 1)];

        return series[i] + (next - series[i]) * (f - i);
    };

    const line = smooth(points.map((v, i) => [x(i), y(v)]));
    const base = smooth(baseline.map((v, i) => [x(i), y(v)]));
    const changed = points.some((v, i) => v !== baseline[i]);
    const negative = lo < 0;
    const floor = negative ? y(0) : H;
    const moments = items.filter((i) => i.kind === 'moment');
    const h = hover ?? 12;

    return (
        <div className="relative pl-14">
            <div
                className="relative h-[300px]"
                onMouseLeave={() => setHover(null)}
            >
                {/* grid + y labels */}
                {ticks.map((t) => (
                    <div
                        key={t}
                        className="absolute inset-x-0"
                        style={{ top: `${pct(t)}%` }}
                    >
                        <div
                            className={cn(
                                'h-px',
                                t === 0 ? 'bg-k-human/40' : 'bg-line/70',
                            )}
                        />
                        <span
                            className={cn(
                                'absolute -top-2 -left-14 w-12 text-right text-[11px] tabular-nums',
                                t === 0 ? 'text-k-human' : 'text-ink-3',
                            )}
                        >
                            {short(t)}
                        </span>
                    </div>
                ))}

                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 size-full overflow-visible"
                >
                    <defs>
                        <linearGradient
                            id="year-area"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#00aeef"
                                stopOpacity="0.22"
                            />
                            <stop
                                offset="100%"
                                stopColor="#00aeef"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <clipPath id="year-below-zero">
                            <rect
                                x="0"
                                y={y(0)}
                                width={W}
                                height={Math.max(0, H - y(0))}
                            />
                        </clipPath>
                    </defs>
                    <path
                        d={`${line} L${W},${floor} L0,${floor} Z`}
                        fill="url(#year-area)"
                    />
                    {negative && (
                        <path
                            d={`${line} L${W},${y(0)} L0,${y(0)} Z`}
                            fill="#e4572e"
                            fillOpacity="0.12"
                            clipPath="url(#year-below-zero)"
                        />
                    )}
                    {changed && (
                        <path
                            d={base}
                            fill="none"
                            stroke="#8795a3"
                            strokeWidth="1.5"
                            strokeDasharray="5 5"
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                    <path
                        d={line}
                        fill="none"
                        stroke="#003665"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="transition-[d] duration-500"
                    />
                    {negative && (
                        <path
                            d={line}
                            fill="none"
                            stroke="#e4572e"
                            strokeWidth="2.5"
                            clipPath="url(#year-below-zero)"
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                    {hover !== null && (
                        <line
                            x1={x(hover)}
                            x2={x(hover)}
                            y1="0"
                            y2={H}
                            stroke="#e2e8ef"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                </svg>

                {/* moments pinned on the line */}
                {moments.map((m, i) => {
                    const v = at(points, m.days);
                    const stack = moments
                        .slice(0, i)
                        .filter((o) => Math.abs(o.days - m.days) < 12).length;
                    const active = m.id === selectedId;

                    return (
                        <button
                            key={m.id}
                            onClick={() => onSelect(m.id)}
                            title={m.title}
                            className={cn(
                                'absolute z-10 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[11px] font-semibold tabular-nums shadow-sm transition-all duration-500',
                                active
                                    ? 'bg-kbc-navy scale-110 border-white text-white'
                                    : 'border-kbc-navy text-kbc-navy hover:bg-kbc-navy bg-white hover:text-white',
                            )}
                            style={{
                                left: `${(m.days / 365) * 100}%`,
                                top: `calc(${pct(v)}% - ${stack * 28}px)`,
                            }}
                        >
                            {i + 1}
                        </button>
                    );
                })}

                {/* value bubble: hovered month, or the end of the year */}
                <div
                    className={cn(
                        'pointer-events-none absolute z-20 -translate-y-1/2 transition-all duration-300',
                        h < 3 ? 'pl-4' : '-translate-x-full pr-4',
                    )}
                    style={{
                        left: `${(h / 12) * 100}%`,
                        top: `${pct(points[h])}%`,
                    }}
                >
                    <div className="rounded-xl bg-ink px-3 py-2 text-white shadow-lg">
                        <div className="text-[11px] whitespace-nowrap text-white/60">
                            {h === 0 ? 'Today' : `End of ${monthName(h)}`}
                        </div>
                        <div className="text-[15px] font-semibold tabular-nums">
                            {short(points[h])}
                        </div>
                        {changed && (
                            <div className="text-[11px] whitespace-nowrap text-white/60 tabular-nums">
                                {points[h] - baseline[h] >= 0 ? '+' : ''}
                                {short(points[h] - baseline[h])} vs. as-is
                            </div>
                        )}
                    </div>
                </div>
                <span
                    className="bg-kbc-sky pointer-events-none absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition-all duration-300"
                    style={{
                        left: `${(h / 12) * 100}%`,
                        top: `${pct(points[h])}%`,
                    }}
                />

                {/* hover zones */}
                <div className="absolute inset-0 flex">
                    {points.map((_, i) => (
                        <div
                            key={i}
                            className="h-full"
                            style={{
                                width:
                                    i === 0 || i === 12
                                        ? `${100 / 24}%`
                                        : `${100 / 12}%`,
                            }}
                            onMouseEnter={() => setHover(i)}
                        />
                    ))}
                </div>
            </div>

            <div className="text-ink-3 relative mt-3 h-4 text-[12px]">
                <span className="absolute left-0">Today</span>
                {MONTHS.map((m, i) =>
                    i < 11 ? (
                        <span
                            key={m}
                            className="absolute -translate-x-1/2"
                            style={{ left: `${((i + 1) / 12) * 100}%` }}
                        >
                            {m}
                        </span>
                    ) : null,
                )}
                <span className="absolute right-0">Sep</span>
            </div>
        </div>
    );
}
