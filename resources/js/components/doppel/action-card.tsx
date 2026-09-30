import { cn } from '@/lib/utils';
import type { Action } from '@/types/doppel';

const styles = {
    kbc: {
        card: 'bg-kind-kbc text-white',
        tag: 'bg-white/15 text-white',
        tagLabel: 'KBC',
        button: 'bg-doppel-sky text-white hover:bg-doppel-sky/90',
        link: 'text-white/70 hover:text-white',
    },
    partner: {
        card: 'bg-white border border-kind-partner text-doppel-ink',
        tag: 'bg-doppel-line text-doppel-muted',
        tagLabel: 'Partner',
        button: 'bg-doppel-navy text-white hover:bg-doppel-navy-soft',
        link: 'text-doppel-muted hover:text-doppel-ink',
    },
    no_sale: {
        card: 'bg-kind-nosale-soft border-l-4 border-kind-nosale text-doppel-ink',
        tag: 'bg-kind-nosale/15 text-kind-nosale',
        tagLabel: 'Nothing to buy',
        button: 'bg-kind-nosale text-white hover:bg-kind-nosale/90',
        link: 'text-doppel-muted hover:text-doppel-ink',
    },
    human: {
        card: 'bg-kind-human-soft border-2 border-kind-human text-doppel-ink',
        tag: 'bg-kind-human/15 text-kind-human',
        tagLabel: 'A person from KBC',
        button: 'bg-kind-human text-white hover:bg-kind-human/90',
        link: 'text-doppel-muted hover:text-doppel-ink',
    },
} as const;

type Props = {
    action: Action;
    leaving?: boolean;
    onCta: () => void;
    onWhy: () => void;
    onDismiss: () => void;
};

export function ActionCard({
    action,
    leaving = false,
    onCta,
    onWhy,
    onDismiss,
}: Props) {
    const style = styles[action.kind];

    return (
        <article
            className={cn(
                'max-h-96 overflow-hidden rounded-2xl p-4 shadow-sm transition-all duration-500',
                'animate-in fade-in slide-in-from-bottom-2',
                style.card,
                leaving &&
                    'pointer-events-none max-h-0 translate-x-10 py-0 opacity-0',
            )}
        >
            <span
                className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
                    style.tag,
                )}
            >
                {style.tagLabel}
            </span>
            <p className="mt-2 text-[16px] leading-snug font-medium">
                {action.title}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={onCta}
                    className={cn(
                        'shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                        style.button,
                    )}
                >
                    {action.cta_label}
                </button>
                <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs font-medium">
                    <button
                        type="button"
                        onClick={onWhy}
                        className={style.link}
                    >
                        Why?
                    </button>
                    {action.kind !== 'human' && (
                        <button
                            type="button"
                            onClick={onDismiss}
                            className={style.link}
                        >
                            That's not me
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
