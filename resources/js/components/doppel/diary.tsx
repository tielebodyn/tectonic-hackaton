import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Prediction } from '@/types/doppel';

export function relativeDay(iso: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round(
        (new Date(iso).getTime() - today.getTime()) / 86_400_000,
    );

    if (days <= 0) {
        return 'Today';
    }

    if (days === 1) {
        return 'Tomorrow';
    }

    if (days < 14) {
        return `In ${days} days`;
    }

    if (days < 45) {
        return `In ${Math.round(days / 7)} weeks`;
    }

    return `In ${Math.round(days / 30)} months`;
}

export function shortDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

// Kobe's opening line. When the text changes, the old line is struck through
// and the new line is written underneath: the diary rewrites itself.
export function DiaryOpener({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const [shown, setShown] = useState(text);
    const [previous, setPrevious] = useState<string | null>(null);

    if (text !== shown) {
        setPrevious(shown);
        setShown(text);
    }

    useEffect(() => {
        if (previous === null) {
            return;
        }

        const timer = setTimeout(() => setPrevious(null), 1800);

        return () => clearTimeout(timer);
    }, [previous]);

    return (
        <div className={className}>
            {previous !== null && (
                <p className="mb-2 font-diary text-base text-doppel-muted italic">
                    <span className="diary-strike animate-strike [box-decoration-break:clone]">
                        {previous}
                    </span>
                </p>
            )}
            <p
                key={shown}
                className={cn(
                    'font-diary text-[21px] leading-snug text-doppel-ink italic',
                    'animate-in duration-700 fade-in slide-in-from-bottom-1',
                    previous !== null &&
                        '[animation-delay:500ms] [animation-fill-mode:both]',
                )}
            >
                {shown}
            </p>
        </div>
    );
}

export function Confidence({
    value,
    className,
}: {
    value: number;
    className?: string;
}) {
    const filled = Math.round(value * 5);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-xs text-doppel-muted',
                className,
            )}
        >
            <span className="inline-flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className={cn(
                            'size-1.5 rounded-full',
                            i < filled ? 'bg-doppel-sky' : 'bg-doppel-line',
                        )}
                    />
                ))}
            </span>
            {Math.round(value * 100)}% sure
        </span>
    );
}

type TimelineProps = {
    predictions: Prediction[];
    onOpen: (prediction: Prediction) => void;
    quiet?: boolean;
};

export function Timeline({
    predictions,
    onOpen,
    quiet = false,
}: TimelineProps) {
    return (
        <ol
            className={cn(
                'relative space-y-1 transition-all duration-700',
                quiet && 'opacity-60 grayscale',
            )}
        >
            <span
                className="absolute top-3 bottom-3 left-[7px] w-px bg-doppel-line"
                aria-hidden
            />
            {predictions.map((prediction) => (
                <li
                    key={prediction.id}
                    className="animate-in duration-500 fade-in slide-in-from-left-2"
                >
                    <button
                        type="button"
                        onClick={() => onOpen(prediction)}
                        className="group relative flex w-full gap-4 rounded-xl py-3 pr-2 text-left transition-colors hover:bg-white/70"
                    >
                        <span className="relative z-10 mt-1.5 size-[15px] shrink-0 rounded-full border-[3px] border-doppel-paper bg-doppel-sky" />
                        <span className="flex-1">
                            <span className="block text-xs font-medium tracking-wide text-doppel-muted uppercase">
                                {relativeDay(prediction.expected_at)} ·{' '}
                                {shortDate(prediction.expected_at)}
                            </span>
                            <span className="mt-1 block font-diary text-[17px] leading-snug text-doppel-ink">
                                {prediction.title}
                            </span>
                            <span className="mt-1.5 flex items-center justify-between">
                                <Confidence value={prediction.confidence} />
                                <span className="text-xs font-medium text-doppel-sky opacity-80 group-hover:opacity-100">
                                    What Doppel saw ›
                                </span>
                            </span>
                        </span>
                    </button>
                </li>
            ))}
        </ol>
    );
}
