import { useId } from 'react';
import type { Mood, Variant } from '@/types/doppel';
import { cn } from '@/lib/utils';

type Props = {
    mood: Mood;
    variant: Variant;
    /** Breedte in px; hoogte is gelijk. */
    size?: number;
    /** Waar Doppel naar kijkt (vork-weergave: naar elkaar). */
    look?: 'center' | 'left' | 'right';
    /** Korte knik, bv. na "Zo ben ik niet". */
    nod?: boolean;
    className?: string;
};

// Vachtkleuren: licht KBC-blauw pluis met witte highlight.
const FUR_LIGHT = '#ffffff';
const FUR_MID = '#d9e9fb';
const FUR_DARK = '#6f95cc';
const FUR_LINE = '#8fb0dc';
const FACE = '#141d33';

const browLeft: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translateY(-7px) rotate(-10deg)',
    worried: 'translateY(-1px) rotate(-18deg)',
    relieved: 'translateY(-5px)',
    paused: 'translateY(4px) rotate(4deg)',
};
const browRight: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translateY(1px) rotate(-4deg)',
    worried: 'translateY(-1px) rotate(18deg)',
    relieved: 'translateY(-5px)',
    paused: 'translateY(4px) rotate(-4deg)',
};
const mouth: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translateX(7px) scale(0.5, 0.35)',
    worried: 'scale(0.85, -0.9)',
    relieved: 'scale(1.35, 1.7)',
    paused: 'scale(0.8, 0.08)',
};
const pupil: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translate(4px, -5px)',
    worried: 'translateY(2px)',
    relieved: 'none',
    paused: 'translate(-4px, 1px)',
};
const lookShift: Record<NonNullable<Props['look']>, string> = {
    center: '',
    left: ' translateX(-5px)',
    right: ' translateX(5px)',
};
// Houding van het hele lijf.
const posture: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'rotate(-4deg)',
    worried: 'translateY(-4px) scale(0.97, 1.02)',
    relieved: 'translateY(3px) scale(1.03, 0.97)',
    paused: 'translateX(6px) rotate(6deg)',
};

const fillBox = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
} as const;
const fillBoxBottom = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
} as const;

const BODY =
    'M 120 52 C 174 52 212 94 212 146 C 212 202 170 230 120 230 C 70 230 28 202 28 146 C 28 94 66 52 120 52 Z';

export default function Doppel({
    mood,
    variant,
    size = 240,
    look = 'center',
    nod = false,
    className,
}: Props) {
    const id = useId().replace(/:/g, '');
    const body = `url(#${id}-body)`;
    const paused = mood === 'paused';

    return (
        <svg
            viewBox="0 0 240 260"
            width={size}
            height={size * (260 / 240)}
            className={cn('overflow-visible select-none', className)}
            role="img"
            aria-label={`Doppel, ${mood}`}
        >
            <defs>
                <radialGradient id={`${id}-body`} cx="38%" cy="30%" r="78%">
                    <stop offset="0%" stopColor={FUR_LIGHT} />
                    <stop offset="42%" stopColor={FUR_MID} />
                    <stop offset="100%" stopColor={FUR_DARK} />
                </radialGradient>
                <radialGradient id={`${id}-eye`} cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#2b3a5e" />
                    <stop offset="100%" stopColor="#05070f" />
                </radialGradient>
                <linearGradient id={`${id}-kbc`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4cc4f5" />
                    <stop offset="100%" stopColor="#0079b8" />
                </linearGradient>
                <linearGradient id={`${id}-box`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#efd3a5" />
                    <stop offset="100%" stopColor="#b98a4e" />
                </linearGradient>
                <filter
                    id={`${id}-fur`}
                    x="-25%"
                    y="-25%"
                    width="150%"
                    height="150%"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        seed="4"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="9"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter
                    id={`${id}-halo`}
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                >
                    <feGaussianBlur stdDeviation="5" />
                </filter>
                <filter
                    id={`${id}-soft`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur stdDeviation="3" />
                </filter>
                <filter
                    id={`${id}-shadow`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur stdDeviation="8" />
                </filter>
            </defs>

            <g
                className="doppel-figure"
                style={{
                    ...fillBoxBottom,
                    filter: paused ? 'saturate(0.3)' : 'none',
                    opacity: paused ? 0.8 : 1,
                }}
            >
                {/* grondschaduw */}
                <ellipse
                    cx="120"
                    cy="246"
                    rx="70"
                    ry="10"
                    fill="#000"
                    opacity="0.45"
                    filter={`url(#${id}-shadow)`}
                />

                <g className="animate-doppel-breathe" style={fillBoxBottom}>
                    <g
                        className="doppel-torso"
                        style={{ ...fillBoxBottom, transform: posture[mood] }}
                    >
                        {/* attribuut achter het lijf */}
                        {variant === 'starter' && (
                            <g>
                                <rect
                                    x="182"
                                    y="112"
                                    width="50"
                                    height="66"
                                    rx="20"
                                    fill={`url(#${id}-kbc)`}
                                />
                                <rect
                                    x="192"
                                    y="146"
                                    width="30"
                                    height="22"
                                    rx="9"
                                    fill="#0b1f3a"
                                    opacity="0.25"
                                />
                            </g>
                        )}

                        {/* armen en voeten */}
                        <g fill={body} filter={`url(#${id}-fur)`}>
                            <ellipse
                                cx="34"
                                cy="172"
                                rx="18"
                                ry="13"
                                transform="rotate(20 34 172)"
                            />
                            <ellipse
                                cx="206"
                                cy="172"
                                rx="18"
                                ry="13"
                                transform="rotate(-20 206 172)"
                            />
                            <ellipse cx="92" cy="236" rx="20" ry="11" />
                            <ellipse cx="148" cy="236" rx="20" ry="11" />
                        </g>

                        {/* pluis-halo, vachtrand, glad volume */}
                        <path
                            d={BODY}
                            fill={body}
                            opacity="0.7"
                            filter={`url(#${id}-halo)`}
                            style={{
                                transformBox: 'fill-box',
                                transformOrigin: 'center',
                                transform: 'scale(1.05)',
                            }}
                        />
                        <path d={BODY} fill={body} filter={`url(#${id}-fur)`} />
                        <path
                            d={BODY}
                            fill={body}
                            opacity="0.92"
                            style={{
                                transformBox: 'fill-box',
                                transformOrigin: 'center',
                                transform: 'scale(0.965)',
                            }}
                        />
                        {/* buikschaduw */}
                        <ellipse
                            cx="120"
                            cy="212"
                            rx="60"
                            ry="16"
                            fill={FUR_DARK}
                            opacity="0.35"
                            filter={`url(#${id}-halo)`}
                        />

                        {/* gezicht */}
                        <g
                            className={cn(nod && 'animate-doppel-nod')}
                            style={{
                                transformBox: 'fill-box',
                                transformOrigin: '50% 100%',
                            }}
                        >
                            {/* blos */}
                            <g
                                fill="#ffb3c6"
                                opacity="0.45"
                                filter={`url(#${id}-soft)`}
                            >
                                <ellipse cx="78" cy="154" rx="11" ry="6" />
                                <ellipse cx="162" cy="154" rx="11" ry="6" />
                            </g>

                            {/* ogen */}
                            <g className="animate-doppel-blink" style={fillBox}>
                                <g
                                    className="doppel-pupil"
                                    style={{
                                        ...fillBox,
                                        transform: `${pupil[mood]}${lookShift[look]}`,
                                    }}
                                >
                                    <circle
                                        cx="96"
                                        cy="132"
                                        r="16"
                                        fill={`url(#${id}-eye)`}
                                    />
                                    <circle
                                        cx="144"
                                        cy="132"
                                        r="16"
                                        fill={`url(#${id}-eye)`}
                                    />
                                    <circle
                                        cx="90"
                                        cy="125"
                                        r="5.5"
                                        fill="#fff"
                                    />
                                    <circle
                                        cx="138"
                                        cy="125"
                                        r="5.5"
                                        fill="#fff"
                                    />
                                    <circle
                                        cx="102"
                                        cy="140"
                                        r="2.2"
                                        fill="#fff"
                                        opacity="0.7"
                                    />
                                    <circle
                                        cx="150"
                                        cy="140"
                                        r="2.2"
                                        fill="#fff"
                                        opacity="0.7"
                                    />
                                </g>
                            </g>

                            {/* wenkbrauwen, in donkerder pluis */}
                            <g
                                fill="none"
                                stroke={FUR_LINE}
                                strokeWidth="4.5"
                                strokeLinecap="round"
                            >
                                <path
                                    className="doppel-brow"
                                    d="M 84 108 Q 96 100 108 106"
                                    style={{
                                        ...fillBox,
                                        transform: browLeft[mood],
                                    }}
                                />
                                <path
                                    className="doppel-brow"
                                    d="M 132 106 Q 144 100 156 108"
                                    style={{
                                        ...fillBox,
                                        transform: browRight[mood],
                                    }}
                                />
                            </g>

                            {/* mond */}
                            <path
                                className="doppel-mouth"
                                d="M 109 158 Q 120 169 131 158"
                                fill="none"
                                stroke={FACE}
                                strokeWidth="4.5"
                                strokeLinecap="round"
                                style={{ ...fillBox, transform: mouth[mood] }}
                            />
                        </g>

                        {/* attribuut voor het lijf */}
                        {variant === 'mover' && (
                            <g>
                                <rect
                                    x="68"
                                    y="184"
                                    width="104"
                                    height="58"
                                    rx="9"
                                    fill={`url(#${id}-box)`}
                                />
                                <rect
                                    x="116"
                                    y="184"
                                    width="8"
                                    height="58"
                                    fill="#fff"
                                    opacity="0.35"
                                />
                                <rect
                                    x="68"
                                    y="204"
                                    width="104"
                                    height="3"
                                    fill="#7a5320"
                                    opacity="0.45"
                                />
                            </g>
                        )}
                        {variant === 'freelancer' && (
                            <g>
                                <rect
                                    x="64"
                                    y="192"
                                    width="112"
                                    height="46"
                                    rx="9"
                                    fill="#1b2540"
                                />
                                <rect
                                    x="72"
                                    y="199"
                                    width="96"
                                    height="30"
                                    rx="5"
                                    fill={`url(#${id}-kbc)`}
                                    opacity="0.55"
                                    filter={`url(#${id}-soft)`}
                                />
                                <rect
                                    x="72"
                                    y="199"
                                    width="96"
                                    height="30"
                                    rx="5"
                                    fill={`url(#${id}-kbc)`}
                                    opacity="0.9"
                                />
                                {/* koffie */}
                                <rect
                                    x="204"
                                    y="206"
                                    width="26"
                                    height="30"
                                    rx="6"
                                    fill="#f4f6fb"
                                />
                                <path
                                    d="M 230 214 Q 242 221 230 228"
                                    fill="none"
                                    stroke="#f4f6fb"
                                    strokeWidth="4"
                                />
                                <g
                                    className="animate-doppel-steam"
                                    fill="none"
                                    stroke="#f4f6fb"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    opacity="0.7"
                                    style={fillBox}
                                >
                                    <path d="M 212 200 q 3 -5 0 -10" />
                                    <path d="M 222 200 q -3 -5 0 -10" />
                                </g>
                            </g>
                        )}
                    </g>
                </g>
            </g>
        </svg>
    );
}
