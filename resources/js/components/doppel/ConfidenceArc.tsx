type Props = {
    /** 0–100 */
    value: number;
    size?: number;
    onDark?: boolean;
};

/** Confidence as an arc that fills, with the percentage inside. */
export default function ConfidenceArc({
    value,
    size = 44,
    onDark = false,
}: Props) {
    const r = 17;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(100, value));

    return (
        <div
            className="relative shrink-0"
            style={{ width: size, height: size }}
            aria-label={`${pct}% sure`}
        >
            <svg
                viewBox="0 0 44 44"
                width={size}
                height={size}
                className="-rotate-90"
            >
                <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="none"
                    stroke={
                        onDark
                            ? 'rgba(255,255,255,0.18)'
                            : 'rgba(11,31,58,0.08)'
                    }
                    strokeWidth="4"
                />
                <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="none"
                    stroke="var(--color-kbc)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - pct / 100)}
                    className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
            </svg>
            <span
                className="absolute inset-0 grid place-items-center text-[10px] font-bold"
                style={{ color: onDark ? '#fff' : 'var(--color-ink)' }}
            >
                {pct}%
            </span>
        </div>
    );
}
