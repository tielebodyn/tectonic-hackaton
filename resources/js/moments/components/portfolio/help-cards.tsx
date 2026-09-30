import { ArrowRight, Check, EyeOff } from 'lucide-react';
import type { ActionKind, PersonaView } from '../../types';
import { KindChip } from '../../ui';
import { cn } from '@/lib/utils';

/** Say plainly what each card is, before the customer has to guess. */
const HONESTY: Record<ActionKind, string> = {
    no_sale: 'Nothing to sell',
    kbc: 'KBC product',
    partner: 'Partner offer, via KBC',
    human: 'A real person',
    protect: 'For your safety',
};

export function HelpCards({
    view,
    onSelectMoment,
    onOpen,
}: {
    view: PersonaView;
    onSelectMoment: (id: string) => void;
    onOpen: () => void;
}) {
    const { ranked, suppressed } = view.decision;
    const heldBack = suppressed.filter(
        (s) => s.reason !== 'The moment behind it no longer applies',
    );

    if (!ranked.length) {
        return (
            <div className="border-line text-ink-2 rounded-3xl border bg-white p-8 text-[15px]">
                Nothing needs your attention right now.
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {ranked.map(({ rec, rank }) => {
                    const moment = view.moments.find(
                        (m) => m.id === rec.momentId,
                    );
                    const first = rank === 1;

                    return (
                        <article
                            key={rec.id}
                            className={cn(
                                'flex flex-col rounded-3xl border bg-white p-6 transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(16,24,40,0.18)]',
                                first
                                    ? 'border-kbc-navy/30 shadow-[0_8px_30px_-14px_rgba(0,54,101,0.35)]'
                                    : 'border-line',
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <KindChip kind={rec.kind} />
                                <span className="text-ink-3 text-[12px]">
                                    {HONESTY[rec.kind]}
                                </span>
                                {rec.partner && (
                                    <span className="text-ink-3 text-[12px]">
                                        · {rec.partner}
                                    </span>
                                )}
                                {first && (
                                    <span className="bg-kbc-sky/12 text-kbc-navy ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold">
                                        Best fit now
                                    </span>
                                )}
                            </div>
                            <h3 className="mt-4 text-[18px] leading-snug font-semibold tracking-tight text-ink">
                                {rec.title}
                            </h3>
                            <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
                                {rec.body}
                            </p>
                            {rec.valueToCustomer && (
                                <div className="text-k-nosale mt-4 flex items-start gap-2 text-[13px] font-medium">
                                    <Check
                                        className="mt-0.5 size-3.5 shrink-0"
                                        strokeWidth={2.5}
                                    />
                                    {rec.valueToCustomer}
                                </div>
                            )}
                            <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                                {moment ? (
                                    <button
                                        onClick={() =>
                                            onSelectMoment(moment.id)
                                        }
                                        className="text-ink-3 hover:text-ink-2 min-w-0 text-left text-[12px]"
                                    >
                                        For
                                        <span className="text-ink-2 block truncate font-medium">
                                            {moment.title}
                                        </span>
                                    </button>
                                ) : (
                                    <span />
                                )}
                                <button
                                    onClick={onOpen}
                                    className={cn(
                                        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors',
                                        first
                                            ? 'bg-kbc-navy hover:bg-kbc-navy-2 text-white'
                                            : 'border-line text-kbc-navy hover:bg-mist border',
                                    )}
                                >
                                    {rec.cta}
                                    <ArrowRight className="size-3.5" />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {heldBack.length > 0 && (
                <div className="text-ink-2 mt-4 flex items-start gap-2.5 rounded-2xl bg-white/60 px-5 py-3.5 text-[13px]">
                    <EyeOff className="text-ink-3 mt-0.5 size-4 shrink-0" />
                    <span>
                        We're holding back {heldBack.length}{' '}
                        {heldBack.length === 1 ? 'offer' : 'offers'} on purpose:{' '}
                        {[
                            ...new Set(
                                heldBack.map(
                                    (s) =>
                                        s.reason.charAt(0).toLowerCase() +
                                        s.reason.slice(1),
                                ),
                            ),
                        ].join('; ')}
                        .
                    </span>
                </div>
            )}
        </div>
    );
}
