import { useId } from 'react';
import { daysBetween, type Point } from '@/components/doppel/forecast';
import { euro, shortDate } from '@/components/doppel/types';

type Marker = { key: string; day: number; negative: boolean };

type Props = {
    points: Point[];
    today: string;
    end: string;
    markers: Marker[];
    active: string | null;
    onPick: (key: string) => void;
};

const W = 320;
const H = 150;
const PAD = { t: 12, b: 22, l: 4, r: 4 };

/** One balance line, soft fill, a zero line only when you dip below it. No labels on the line. */
export default function BalanceChart({
    points,
    today,
    end,
    markers,
    active,
    onPick,
}: Props) {
    const id = useId().replace(/:/g, '');
    const total = Math.max(1, daysBetween(today, end));
    const values = points.map((p) => p.balance);
    const min = Math.min(0, ...values);
    const max = Math.max(...values, 1);
    const span = max - min || 1;
    const below = Math.min(...values) < 0;

    const x = (day: number) => PAD.l + (day / total) * (W - PAD.l - PAD.r);
    const y = (v: number) =>
        PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b);
    const at = (day: number) => {
        const i = points.findIndex((p) => p.day >= day);
        if (i <= 0) return points[Math.max(0, i)].balance;
        const a = points[i - 1];
        const b = points[i];
        return (
            a.balance +
            ((b.balance - a.balance) * (day - a.day)) / (b.day - a.day || 1)
        );
    };

    const line = points
        .map(
            (p, i) =>
                `${i ? 'L' : 'M'}${x(p.day).toFixed(1)},${y(p.balance).toFixed(1)}`,
        )
        .join(' ');
    const area = `${line} L${x(total)},${y(min)} L${x(0)},${y(min)} Z`;
    const color = below ? '#e5484d' : 'var(--color-kbc)';
    const mid = new Date(Date.parse(today) + (total / 2) * 86_400_000)
        .toISOString()
        .slice(0, 10);

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full overflow-visible"
            role="img"
            aria-label="Balance over time"
        >
            <defs>
                <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            {below && (
                <>
                    <line
                        x1={PAD.l}
                        x2={W - PAD.r}
                        y1={y(0)}
                        y2={y(0)}
                        stroke="#e5484d"
                        strokeOpacity="0.35"
                        strokeDasharray="3 4"
                    />
                    <text
                        x={W - PAD.r}
                        y={y(0) - 5}
                        textAnchor="end"
                        className="fill-[#e5484d] text-[10px] font-semibold"
                    >
                        €0
                    </text>
                </>
            )}

            <path d={area} fill={`url(#${id}-fill)`} />
            <path
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {markers.map((m) => {
                const cx = x(m.day);
                const cy = y(at(m.day));
                const on = active === m.key;
                return (
                    <g
                        key={m.key}
                        className="cursor-pointer"
                        onClick={() => onPick(m.key)}
                    >
                        <circle cx={cx} cy={cy} r="14" fill="transparent" />
                        <circle
                            cx={cx}
                            cy={cy}
                            r={on ? 6 : 4.5}
                            fill="white"
                            stroke={m.negative ? '#e5484d' : 'var(--color-ink)'}
                            strokeWidth={on ? 3 : 2}
                            className="transition-all"
                        />
                    </g>
                );
            })}

            {/* today */}
            <circle
                cx={x(0)}
                cy={y(points[0].balance)}
                r="4"
                fill="var(--color-ink)"
            />

            <g className="fill-[#0b1f3a]/40 text-[10px]">
                <text x={x(0)} y={H - 4}>
                    Today
                </text>
                <text x={x(total / 2)} y={H - 4} textAnchor="middle">
                    {shortDate(mid)}
                </text>
                <text x={x(total)} y={H - 4} textAnchor="end">
                    {shortDate(end)}
                </text>
            </g>
            <title>{`From ${euro(points[0].balance)} to ${euro(points[points.length - 1].balance)}`}</title>
        </svg>
    );
}
