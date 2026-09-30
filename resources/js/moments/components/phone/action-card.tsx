import { ArrowRight, Check, Info, Sparkles } from 'lucide-react';
import type { Moment, RankedRecommendation } from '../../types';
import { KIND_STYLE, KindChip } from '../../ui';
import { cn } from '@/lib/utils';

/** Solid CTA colours per kind (KIND_STYLE only ships tints). */
export const KIND_SOLID: Record<string, string> = {
    kbc: 'bg-k-kbc',
    partner: 'bg-k-partner',
    no_sale: 'bg-k-nosale',
    human: 'bg-k-human',
    protect: 'bg-k-protect',
};

/** Honest, customer-facing label: what is this card, and does anyone earn from it. */
export const HONEST_LABEL: Record<string, string> = {
    kbc: 'KBC product',
    partner: 'Partner offer · KBC may earn a fee',
    no_sale: 'Nothing to sell',
    human: 'A real person, free',
    protect: 'For your safety',
};

type CardProps = {
    item: RankedRecommendation;
    moment?: Moment;
    soft: boolean; // sensitive moment: muted colours on anything that sells
    isNew: boolean;
    onOpen: () => void;
};

function MomentLine({
    moment,
    className,
}: {
    moment?: Moment;
    className?: string;
}) {
    if (!moment) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex min-w-0 items-center gap-1.5 text-[11px] text-ink-2',
                className,
            )}
        >
            <Sparkles
                className="size-3 shrink-0 text-kbc-sky"
                strokeWidth={2.5}
            />
            <span className="truncate font-medium text-ink">
                {moment.title}
            </span>
            <span className="shrink-0 text-ink-3">·</span>
            <span className="shrink-0">{moment.horizon}</span>
            <span className="shrink-0 text-ink-3">·</span>
            <span className="shrink-0 tabular-nums">
                {moment.confidence}% sure
            </span>
        </div>
    );
}

function NewBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-kbc-sky/12 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#0086bb] uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-kbc-sky" />
            New
        </span>
    );
}

export function HeroCard({ item, moment, soft, isNew, onOpen }: CardProps) {
    const { rec } = item;
    // Sensitive moment: the whole hero goes quiet, navy instead of bright kind colours.
    const muted = soft;
    const k = KIND_STYLE[rec.kind];
    const Icon = k.icon;

    return (
        <button
            onClick={onOpen}
            className="block w-full animate-in overflow-hidden rounded-[22px] border border-line bg-white text-left duration-500 fade-in slide-in-from-top-2 active:scale-[0.99]"
        >
            <div
                className={cn(
                    'relative px-4 pt-4 pb-3.5',
                    muted ? 'bg-mist/70' : k.bg,
                )}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                        <KindChip
                            kind={rec.kind}
                            className={cn('bg-white', muted && 'text-ink-2')}
                        />
                        {isNew && <NewBadge />}
                    </div>
                    <span className="text-[10.5px] font-medium text-ink-2">
                        {HONEST_LABEL[rec.kind]}
                    </span>
                </div>
                <div className="mt-3 flex items-start gap-3">
                    <div
                        className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-[14px] text-white',
                            muted ? 'bg-kbc-navy/85' : KIND_SOLID[rec.kind],
                        )}
                    >
                        <Icon className="size-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[17px] leading-snug font-semibold tracking-tight text-ink">
                            {rec.title}
                        </div>
                        {rec.partner && (
                            <div className="mt-0.5 text-[12px] text-ink-2">
                                with{' '}
                                <span className="font-medium text-ink">
                                    {rec.partner}
                                </span>{' '}
                                · via KBC
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 pt-3 pb-4">
                <MomentLine moment={moment} />
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                    {rec.body}
                </p>
                {rec.valueToCustomer && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-k-nosale">
                        <Check className="size-3.5" strokeWidth={2.75} />
                        {rec.valueToCustomer}
                    </div>
                )}
                <div
                    className={cn(
                        'mt-3.5 flex h-11 items-center justify-center gap-1.5 rounded-[14px] text-[14px] font-semibold',
                        muted
                            ? 'bg-kbc-navy text-white'
                            : cn(KIND_SOLID[rec.kind], 'text-white'),
                    )}
                >
                    {rec.cta}
                    <ArrowRight className="size-4" strokeWidth={2.25} />
                </div>
                <div className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-ink-3">
                    <Info className="size-3" />
                    Why am I seeing this?
                </div>
            </div>
        </button>
    );
}

export function CompactCard({ item, moment, soft, isNew, onOpen }: CardProps) {
    const { rec } = item;
    const sells = rec.kind === 'kbc' || rec.kind === 'partner';
    const muted = soft && sells;

    return (
        <button
            onClick={onOpen}
            className="block w-full animate-in rounded-[18px] border border-line bg-white p-3.5 text-left duration-500 fade-in slide-in-from-top-2 active:scale-[0.99]"
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <KindChip
                        kind={rec.kind}
                        className={cn(muted && 'bg-mist text-ink-2')}
                    />
                    {isNew && <NewBadge />}
                </div>
                <span className="flex items-center gap-1 text-[10.5px] text-ink-3">
                    {HONEST_LABEL[rec.kind]}
                    <Info className="size-3" />
                </span>
            </div>
            <div className="mt-2 text-[14.5px] leading-snug font-semibold tracking-tight text-ink">
                {rec.title}
            </div>
            {rec.partner && (
                <div className="text-[11.5px] text-ink-2">
                    with {rec.partner}
                </div>
            )}
            <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-2">
                {rec.body}
            </p>
            <MomentLine moment={moment} className="mt-2" />
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line pt-2.5">
                <span
                    className={cn(
                        'flex items-center gap-1 text-[12.5px] font-semibold',
                        muted ? 'text-ink' : KIND_STYLE[rec.kind].text,
                    )}
                >
                    {rec.cta}
                    <ArrowRight className="size-3.5" strokeWidth={2.5} />
                </span>
                {rec.valueToCustomer && (
                    <span className="truncate text-[11px] font-medium text-k-nosale">
                        {rec.valueToCustomer}
                    </span>
                )}
            </div>
        </button>
    );
}
