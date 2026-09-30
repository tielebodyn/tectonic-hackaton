import { Backpack, Laptop, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MascotVariant = 'backpack' | 'box' | 'laptop';
export type Mood = 'neutral' | 'relieved' | 'paused';

const icons = { backpack: Backpack, box: Package, laptop: Laptop };

const moodRing: Record<Mood, string> = {
    neutral: 'ring-sky-400 bg-sky-50 dark:bg-sky-950',
    relieved: 'ring-emerald-400 bg-emerald-50 dark:bg-emerald-950',
    paused: 'ring-amber-400 bg-amber-50 dark:bg-amber-950',
};

/** Kobe, Doppel's mascot: the life-stage prop tells who he is doubling, the ring tells how he feels. */
export function Kobe({
    variant,
    mood = 'neutral',
    size = 'md',
}: {
    variant: MascotVariant;
    mood?: Mood;
    size?: 'sm' | 'md';
}) {
    const Icon = icons[variant] ?? Backpack;

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full ring-4 transition-colors',
                moodRing[mood],
                size === 'md' ? 'size-20' : 'size-12',
            )}
            aria-label="Kobe"
        >
            <Icon
                className={cn(
                    'text-[#003665] dark:text-sky-200',
                    size === 'md' ? 'size-9' : 'size-6',
                )}
            />
        </div>
    );
}
