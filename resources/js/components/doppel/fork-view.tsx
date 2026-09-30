import { relativeDay } from '@/components/doppel/diary';
import { Kobe } from '@/components/doppel/kobe';
import { cn } from '@/lib/utils';
import type { Fork, MascotVariant, Prediction } from '@/types/doppel';

type Props = {
    fork: Fork;
    variant: MascotVariant;
    base: Prediction[];
    forked: Prediction[];
    onChoose: (which: 'base' | 'fork') => void;
};

// "What if I…": two Doppels side by side, the customer picks one.
export function ForkView({ fork, variant, base, forked, onChoose }: Props) {
    return (
        <div className="grid animate-in grid-cols-2 gap-3 duration-500 zoom-in-95 fade-in">
            <Column
                title="As things are"
                variant={variant}
                predictions={base}
                tone="base"
                cta="Stay as I am"
                onChoose={() => onChoose('base')}
            />
            <Column
                title={capitalize(
                    fork.label
                        .replace(/^What if (I|we) /, '')
                        .replace(/\?$/, ''),
                )}
                opener={fork.opener}
                variant={variant}
                predictions={forked}
                tone="fork"
                cta="Make it real"
                onChoose={() => onChoose('fork')}
            />
        </div>
    );
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

type ColumnProps = {
    title: string;
    opener?: string;
    variant: MascotVariant;
    predictions: Prediction[];
    tone: 'base' | 'fork';
    cta: string;
    onChoose: () => void;
};

function Column({
    title,
    opener,
    variant,
    predictions,
    tone,
    cta,
    onChoose,
}: ColumnProps) {
    const isFork = tone === 'fork';

    return (
        <div
            className={cn(
                'flex flex-col rounded-2xl p-3',
                isFork
                    ? 'bg-doppel-sky-soft ring-2 ring-doppel-sky'
                    : 'bg-white',
            )}
        >
            <div className="flex items-center gap-2">
                <Kobe
                    variant={variant}
                    mood={isFork ? 'relieved' : 'neutral'}
                    size={40}
                />
                <p className="text-xs leading-tight font-semibold text-doppel-ink">
                    {title}
                </p>
            </div>
            {opener && (
                <p className="mt-2 font-diary text-[13px] leading-snug text-doppel-ink italic">
                    {opener}
                </p>
            )}
            <ol className="mt-3 flex-1 space-y-2.5">
                {predictions.map((prediction) => (
                    <li
                        key={prediction.id}
                        className="border-l-2 border-doppel-line pl-2"
                    >
                        <span className="block text-[10px] font-medium text-doppel-muted uppercase">
                            {relativeDay(prediction.expected_at)}
                        </span>
                        <span className="block font-diary text-[13px] leading-snug text-doppel-ink">
                            {prediction.title}
                        </span>
                    </li>
                ))}
            </ol>
            <button
                type="button"
                onClick={onChoose}
                className={cn(
                    'mt-3 rounded-full py-2 text-xs font-semibold',
                    isFork
                        ? 'bg-doppel-navy text-white hover:bg-doppel-navy-soft'
                        : 'border border-doppel-line text-doppel-ink hover:bg-doppel-paper',
                )}
            >
                {cta}
            </button>
        </div>
    );
}
