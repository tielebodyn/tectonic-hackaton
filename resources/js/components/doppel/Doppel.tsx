import type { Mood, Variant } from '@/types/doppel';
import { cn } from '@/lib/utils';

type Props = {
    mood: Mood;
    variant: Variant;
    /** Breedte in px; hoogte is 1,2× */
    size?: number;
    /** Waar Doppel naar kijkt (vork-weergave: naar elkaar). */
    look?: 'center' | 'left' | 'right';
    /** Korte knik, bv. na "Zo ben ik niet". */
    nod?: boolean;
    className?: string;
};

const INK = 'var(--color-ink)';
const PAPER = 'var(--color-paper)';
const ACCENT = 'var(--color-kbc)';

// Wenkbrauwen: links/rechts, rotatie + hoogte per mood.
const browLeft: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translateY(-7px) rotate(-10deg)',
    worried: 'translateY(-2px) rotate(-16deg)',
    relieved: 'translateY(-4px)',
    paused: 'translateY(4px) rotate(4deg)',
};
const browRight: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translateY(1px) rotate(-4deg)',
    worried: 'translateY(-2px) rotate(16deg)',
    relieved: 'translateY(-4px)',
    paused: 'translateY(4px) rotate(-4deg)',
};

// Mond: één glimlach-pad, per mood geschaald (negatief = fronsen).
const mouth: Record<Mood, string> = {
    relaxed: 'scale(1, 1)',
    thinking: 'translateX(6px) scale(0.5, 0.35)',
    worried: 'scale(0.85, -0.9)',
    relieved: 'scale(1.3, 1.6)',
    paused: 'scale(0.8, 0.08)',
};

// Pupillen: waar Doppel kijkt.
const pupil: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translate(3px, -4px)',
    worried: 'translateY(1px)',
    relieved: 'none',
    paused: 'translate(-3px, 1px)',
};
const lookShift: Record<NonNullable<Props['look']>, string> = {
    center: '',
    left: ' translateX(-4px)',
    right: ' translateX(4px)',
};

// Schouders: omhoog bij spanning, zakken bij opluchting.
const torso: Record<Mood, string> = {
    relaxed: 'none',
    thinking: 'translateY(-1px)',
    worried: 'translateY(-6px) scaleX(0.95)',
    relieved: 'translateY(5px) scaleX(1.05)',
    paused: 'translateY(2px)',
};

const fillBox = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
} as const;
const fillBoxBottom = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
} as const;

export default function Doppel({
    mood,
    variant,
    size = 200,
    look = 'center',
    nod = false,
    className,
}: Props) {
    const paused = mood === 'paused';

    return (
        <svg
            viewBox="0 0 200 240"
            width={size}
            height={size * 1.2}
            className={cn('overflow-visible select-none', className)}
            role="img"
            aria-label={`Doppel, ${mood}`}
        >
            <g
                className="doppel-figure"
                style={{
                    ...fillBoxBottom,
                    transform: paused ? 'translateX(8px) scaleX(0.9)' : 'none',
                    filter: paused ? 'saturate(0.35)' : 'none',
                    opacity: paused ? 0.78 : 1,
                }}
            >
                <g className="animate-doppel-breathe" style={fillBoxBottom}>
                    {/* attribuut achter het lichaam */}
                    {variant === 'starter' && (
                        <g>
                            <rect
                                x="126"
                                y="154"
                                width="38"
                                height="62"
                                rx="15"
                                fill={PAPER}
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            <path
                                d="M 128 172 H 162"
                                stroke={ACCENT}
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </g>
                    )}

                    {/* lichaam */}
                    <g
                        className="doppel-torso"
                        style={{ ...fillBoxBottom, transform: torso[mood] }}
                    >
                        <path
                            d="M 54 240 V 180 C 54 158 68 148 86 148 H 114 C 132 148 146 158 146 180 V 240 Z"
                            fill={PAPER}
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />
                        {variant === 'starter' && (
                            <g
                                fill="none"
                                stroke={ACCENT}
                                strokeWidth="4"
                                strokeLinecap="round"
                            >
                                <path d="M 82 152 Q 76 195 84 238" />
                                <path d="M 118 152 Q 124 195 116 238" />
                            </g>
                        )}
                    </g>

                    {/* hoofd */}
                    <g
                        className={cn(nod && 'animate-doppel-nod')}
                        style={{
                            transformBox: 'fill-box',
                            transformOrigin: '50% 95%',
                        }}
                    >
                        <ellipse
                            cx="100"
                            cy="94"
                            rx="50"
                            ry="52"
                            fill={PAPER}
                            stroke={INK}
                            strokeWidth="3"
                        />
                        {/* plukje */}
                        <path
                            d="M 96 44 Q 100 30 112 36"
                            fill="none"
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* ogen, knipperen elke 5 s */}
                        <g className="animate-doppel-blink" style={fillBox}>
                            <ellipse
                                cx="80"
                                cy="98"
                                rx="11"
                                ry="13"
                                fill="#fff"
                                stroke={INK}
                                strokeWidth="2.5"
                            />
                            <ellipse
                                cx="120"
                                cy="98"
                                rx="11"
                                ry="13"
                                fill="#fff"
                                stroke={INK}
                                strokeWidth="2.5"
                            />
                            <g
                                className="doppel-pupil"
                                style={{
                                    ...fillBox,
                                    transform: `${pupil[mood]}${lookShift[look]}`,
                                }}
                            >
                                <circle cx="81" cy="100" r="5.5" fill={INK} />
                                <circle cx="121" cy="100" r="5.5" fill={INK} />
                                <circle cx="83" cy="98" r="1.8" fill="#fff" />
                                <circle cx="123" cy="98" r="1.8" fill="#fff" />
                            </g>
                        </g>

                        {/* wenkbrauwen */}
                        <g
                            fill="none"
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinecap="round"
                        >
                            <path
                                className="doppel-brow"
                                d="M 68 74 Q 80 66 92 72"
                                style={{
                                    ...fillBox,
                                    transform: browLeft[mood],
                                }}
                            />
                            <path
                                className="doppel-brow"
                                d="M 108 72 Q 120 66 132 74"
                                style={{
                                    ...fillBox,
                                    transform: browRight[mood],
                                }}
                            />
                        </g>

                        {/* mond */}
                        <path
                            className="doppel-mouth"
                            d="M 86 122 Q 100 134 114 122"
                            fill="none"
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinecap="round"
                            style={{ ...fillBox, transform: mouth[mood] }}
                        />
                    </g>

                    {/* attribuut voor het lichaam */}
                    {variant === 'mover' && (
                        <g>
                            <rect
                                x="58"
                                y="186"
                                width="84"
                                height="54"
                                rx="6"
                                fill={PAPER}
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            <path
                                d="M 100 186 V 240 M 58 204 H 142"
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            <path
                                d="M 70 218 H 90 M 110 218 H 130"
                                stroke={ACCENT}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                opacity="0.6"
                            />
                            <circle
                                cx="64"
                                cy="188"
                                r="7"
                                fill={PAPER}
                                stroke={INK}
                                strokeWidth="3"
                            />
                            <circle
                                cx="136"
                                cy="188"
                                r="7"
                                fill={PAPER}
                                stroke={INK}
                                strokeWidth="3"
                            />
                        </g>
                    )}
                    {variant === 'freelancer' && (
                        <g>
                            <rect
                                x="62"
                                y="178"
                                width="76"
                                height="46"
                                rx="6"
                                fill={PAPER}
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            <rect
                                x="69"
                                y="185"
                                width="62"
                                height="32"
                                rx="3"
                                fill={ACCENT}
                                opacity="0.14"
                            />
                            <rect
                                x="54"
                                y="222"
                                width="92"
                                height="9"
                                rx="4.5"
                                fill={PAPER}
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            {/* koffie */}
                            <rect
                                x="154"
                                y="204"
                                width="22"
                                height="24"
                                rx="4"
                                fill={PAPER}
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            <path
                                d="M 176 210 Q 186 216 176 222"
                                fill="none"
                                stroke={ACCENT}
                                strokeWidth="3"
                            />
                            <g
                                className="animate-doppel-steam"
                                fill="none"
                                stroke={ACCENT}
                                strokeWidth="2"
                                strokeLinecap="round"
                                style={fillBox}
                            >
                                <path d="M 160 198 q 3 -4 0 -8" />
                                <path d="M 168 198 q -3 -4 0 -8" />
                            </g>
                        </g>
                    )}
                </g>
            </g>
        </svg>
    );
}
