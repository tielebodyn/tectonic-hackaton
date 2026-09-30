import { cn } from '@/lib/utils';
import type { MascotVariant, Mood } from '@/types/doppel';

// Kobe, the face of Doppel. An original character: one body, swappable
// accessories per life stage, and four moods carried by eyes and brows.

const NAVY = '#0b2a4a';
const SKY = '#1ba6e0';
const QUIET = '#8795a6';

type Props = {
    variant: MascotVariant;
    mood: Mood;
    size?: number;
    className?: string;
};

export function Kobe({ variant, mood, size = 96, className }: Props) {
    const body = mood === 'paused' ? QUIET : NAVY;

    return (
        <svg
            viewBox="0 0 120 120"
            width={size}
            height={size}
            role="img"
            aria-label={`Kobe, ${mood}`}
            className={cn(mood !== 'paused' && 'animate-kobe-float', className)}
        >
            {variant === 'backpack' && (
                <rect x="18" y="52" width="22" height="34" rx="7" fill={SKY} />
            )}

            {/* feet */}
            <ellipse
                cx="46"
                cy="104"
                rx="10"
                ry="5"
                fill={body}
                className="transition-colors duration-700"
            />
            <ellipse
                cx="74"
                cy="104"
                rx="10"
                ry="5"
                fill={body}
                className="transition-colors duration-700"
            />

            {/* body */}
            <ellipse
                cx="60"
                cy="64"
                rx="38"
                ry="40"
                fill={body}
                className="transition-colors duration-700"
            />
            <ellipse
                cx="60"
                cy="80"
                rx="22"
                ry="17"
                fill="#ffffff"
                opacity="0.12"
            />

            {variant === 'backpack' && (
                <>
                    <path
                        d="M40 36 Q36 60 40 84"
                        stroke={SKY}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M80 36 Q84 60 80 84"
                        stroke={SKY}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                    />
                </>
            )}

            <Face mood={mood} />

            {variant === 'moving_box' && (
                <g>
                    <rect
                        x="32"
                        y="76"
                        width="56"
                        height="32"
                        rx="3"
                        fill="#d9a86c"
                    />
                    <rect x="32" y="76" width="56" height="7" fill="#c8955a" />
                    <rect
                        x="56"
                        y="76"
                        width="8"
                        height="32"
                        fill="#efd3a8"
                        opacity="0.8"
                    />
                    <circle cx="32" cy="88" r="5" fill={body} />
                    <circle cx="88" cy="88" r="5" fill={body} />
                </g>
            )}

            {variant === 'laptop_coffee' && (
                <g>
                    <rect
                        x="30"
                        y="80"
                        width="46"
                        height="26"
                        rx="3"
                        fill="#c7d0da"
                    />
                    <circle
                        cx="53"
                        cy="93"
                        r="3"
                        fill="#ffffff"
                        opacity="0.8"
                    />
                    <rect
                        x="24"
                        y="104"
                        width="58"
                        height="5"
                        rx="2"
                        fill="#9aa7b6"
                    />
                    <rect
                        x="86"
                        y="90"
                        width="14"
                        height="17"
                        rx="3"
                        fill="#ffffff"
                        stroke="#9aa7b6"
                        strokeWidth="2"
                    />
                    <path
                        d="M100 95 q5 2 0 7"
                        stroke="#9aa7b6"
                        strokeWidth="2"
                        fill="none"
                    />
                    {mood !== 'paused' && (
                        <path
                            d="M90 85 q-3 -4 0 -8 M96 85 q-3 -4 0 -8"
                            stroke="#9aa7b6"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                    )}
                </g>
            )}

            {mood === 'thinking' && (
                <g fill={SKY}>
                    <circle cx="96" cy="26" r="3" className="animate-thought" />
                    <circle
                        cx="104"
                        cy="17"
                        r="4"
                        className="animate-thought [animation-delay:200ms]"
                    />
                    <circle
                        cx="113"
                        cy="7"
                        r="5"
                        className="animate-thought [animation-delay:400ms]"
                    />
                </g>
            )}
        </svg>
    );
}

function Face({ mood }: { mood: Mood }) {
    if (mood === 'relieved') {
        return (
            <g
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            >
                <path d="M39 58 q8 -8 16 0" />
                <path d="M65 58 q8 -8 16 0" />
                <path d="M40 42 q7 -5 14 -2" />
                <path d="M66 40 q7 -3 14 2" />
                <path d="M54 72 q6 5 12 0" />
                <circle
                    cx="38"
                    cy="68"
                    r="4"
                    fill="#f4a3b4"
                    stroke="none"
                    opacity="0.7"
                />
                <circle
                    cx="82"
                    cy="68"
                    r="4"
                    fill="#f4a3b4"
                    stroke="none"
                    opacity="0.7"
                />
            </g>
        );
    }

    const pupil =
        mood === 'thinking'
            ? { dx: 3, dy: -3 }
            : mood === 'paused'
              ? { dx: 0, dy: 4 }
              : { dx: 0, dy: 1 };

    return (
        <g>
            <circle cx="47" cy="58" r="11" fill="#ffffff" />
            <circle cx="73" cy="58" r="11" fill="#ffffff" />
            <circle
                cx={47 + pupil.dx}
                cy={58 + pupil.dy}
                r="5"
                fill={NAVY}
                className="transition-all duration-500"
            />
            <circle
                cx={73 + pupil.dx}
                cy={58 + pupil.dy}
                r="5"
                fill={NAVY}
                className="transition-all duration-500"
            />

            {mood === 'paused' && (
                <>
                    <rect x="35" y="46" width="24" height="11" fill={QUIET} />
                    <rect x="61" y="46" width="24" height="11" fill={QUIET} />
                </>
            )}

            <g
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            >
                {mood === 'thinking' ? (
                    <>
                        <path d="M38 42 l16 2" />
                        <path d="M66 40 q7 -6 15 -2" />
                        <circle
                            cx="60"
                            cy="75"
                            r="2.5"
                            fill="#ffffff"
                            stroke="none"
                        />
                    </>
                ) : mood === 'paused' ? (
                    <>
                        <path d="M38 43 l16 0" />
                        <path d="M66 43 l16 0" />
                        <path d="M55 75 l10 0" />
                    </>
                ) : (
                    <>
                        <path d="M38 42 q8 -4 16 0" />
                        <path d="M66 42 q8 -4 16 0" />
                        <path d="M55 73 q5 4 10 0" />
                    </>
                )}
            </g>
        </g>
    );
}
