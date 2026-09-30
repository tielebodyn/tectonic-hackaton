import { CheckCircle2, HelpCircle } from 'lucide-react';
import ActionCard from '@/components/doppel/ActionCard';
import ConfidenceArc from '@/components/doppel/ConfidenceArc';
import type { Card, CardAction, FaceMood } from '@/components/doppel/types';
import { euro, shortDate } from '@/components/doppel/types';
import { cn } from '@/lib/utils';

type Props = {
    card: Card;
    index: number;
    mood: FaceMood;
    leaving?: boolean;
    onWhy: (card: Card) => void;
};

function urgencyChip(urgency: number) {
    if (urgency >= 70)
        return { label: 'Dringend', cls: 'bg-orange-100 text-orange-700' };
    if (urgency >= 40)
        return { label: 'Binnenkort', cls: 'bg-kbc/12 text-kbc' };
    return { label: 'Ter info', cls: 'bg-ink/6 text-ink/60' };
}

/** Bij zorgen komen mens en "geen verkoop" eerst; KBC-verkoop nooit bovenaan. */
function orderActions(actions: CardAction[], mood: FaceMood): CardAction[] {
    if (mood !== 'worried' && mood !== 'paused') return actions;
    const rank: Record<CardAction['kind'], number> = {
        human: 0,
        no_sale: 1,
        partner: 2,
        kbc: 3,
    };
    return [...actions].sort((a, b) => rank[a.kind] - rank[b.kind]);
}

export default function DiaryCard({
    card,
    index,
    mood,
    leaving = false,
    onWhy,
}: Props) {
    const allGood = card.rule_key === 'all_good';
    const chip = urgencyChip(card.urgency);

    return (
        <article
            className={cn(
                'flex flex-col gap-3 rounded-[24px] p-4',
                allGood ? 'bg-emerald-50' : 'bg-[#f4f6fa]',
                leaving
                    ? 'animate-doppel-shrink overflow-hidden'
                    : 'animate-doppel-rise',
            )}
            style={leaving ? undefined : { animationDelay: `${index * 60}ms` }}
        >
            <header className="flex items-center gap-2">
                {allGood ? (
                    <span className="grid size-11 place-items-center rounded-2xl bg-white text-emerald-600">
                        <CheckCircle2 className="size-5" />
                    </span>
                ) : (
                    <>
                        <span
                            className={cn(
                                'rounded-full px-2.5 py-1 text-[11px] font-bold',
                                chip.cls,
                            )}
                        >
                            {chip.label}
                        </span>
                        <span className="text-[12px] text-ink/50">
                            {shortDate(card.expected_on)}
                        </span>
                    </>
                )}
                <span className="flex-1" />
                {card.impact_cents !== null && (
                    <span className="text-[13px] font-bold text-ink">
                        {euro(card.impact_cents)}
                    </span>
                )}
                {!allGood && (
                    <ConfidenceArc value={card.confidence} size={40} />
                )}
            </header>

            <div>
                <h3 className="text-[16px] leading-snug font-bold text-ink">
                    {card.title}
                </h3>
                {card.body && (
                    <p className="mt-1 text-[13px] leading-snug text-ink/60">
                        {card.body}
                    </p>
                )}
            </div>

            {card.actions.length > 0 && (
                <div className="flex flex-col gap-2">
                    {orderActions(card.actions, mood).map((action) => (
                        <ActionCard
                            key={`${action.kind}-${action.title}`}
                            action={action}
                        />
                    ))}
                </div>
            )}

            {card.signals.length > 0 && !allGood && (
                <button
                    type="button"
                    onClick={() => onWhy(card)}
                    className="flex items-center justify-center gap-1.5 self-center text-[13px] font-semibold text-kbc"
                >
                    <HelpCircle className="size-4" />
                    Waarom denk ik dat?
                </button>
            )}
        </article>
    );
}
