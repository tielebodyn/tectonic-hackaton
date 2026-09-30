import type { FaceMood, MascotVariant } from '@/components/doppel/types';
import { cn } from '@/lib/utils';

type Props = {
    mood: FaceMood;
    variant: MascotVariant;
    /** Width in px; height is the same. */
    size?: number;
    /** Ignored for the renders; only the SVG version looks sideways. */
    look?: 'center' | 'left' | 'right';
    /** Short nod, e.g. after "That's not me". */
    nod?: boolean;
    /** Waving variant (welcome screen). */
    wave?: boolean;
    className?: string;
};

/**
 * 3D renders in public/images/doppel. One character, a render per situation:
 * backpack (starter), box (mover), laptop worried / relieved (self-employed).
 */
function srcFor(variant: MascotVariant, mood: FaceMood, wave: boolean): string {
    if (variant === 'laptop') {
        return mood === 'worried' || mood === 'paused'
            ? '/images/doppel/laptop-worried.png'
            : '/images/doppel/laptop-relieved.png';
    }
    if (variant === 'box') return '/images/doppel/box.png';
    return wave
        ? '/images/doppel/backpack-wave.png'
        : '/images/doppel/backpack.png';
}

export default function Doppel({
    mood,
    variant,
    size = 240,
    nod = false,
    wave = false,
    className,
}: Props) {
    const src = srcFor(variant, mood, wave);
    const paused = mood === 'paused';

    return (
        <div
            className={cn(
                'relative inline-block origin-bottom animate-doppel-breathe will-change-transform',
                nod && 'animate-doppel-nod',
                className,
            )}
            style={{ width: size, height: size }}
        >
            <img
                key={src}
                src={src}
                alt={`Doppel, ${mood}`}
                width={size}
                height={size}
                draggable={false}
                className={cn(
                    'size-full animate-doppel-rise object-contain transition-[transform,filter,opacity] duration-500 select-none',
                    mood === 'thinking' && '-rotate-6',
                    paused && 'translate-x-1 rotate-6 opacity-80 saturate-50',
                )}
            />
        </div>
    );
}
