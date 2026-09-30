import {
    ChevronRight,
    Handshake,
    Landmark,
    Lightbulb,
    PhoneCall,
    ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type {
    ActionKind,
    Card,
    CardAction,
    FaceMood,
} from '@/components/doppel/types';
import WhySuggestionDrawer from '@/components/doppel/WhySuggestionDrawer';

const style: Record<
    ActionKind,
    { tile: string; icon: typeof Landmark; label: string }
> = {
    kbc: { tile: 'bg-kbc/12 text-kbc', icon: Landmark, label: 'KBC' },
    partner: {
        tile: 'bg-ink/8 text-ink/70',
        icon: Handshake,
        label: 'Partner',
    },
    no_sale: {
        tile: 'bg-emerald-100 text-emerald-700',
        icon: ThumbsUp,
        label: 'Geen verkoop',
    },
    human: {
        tile: 'bg-orange-100 text-orange-600',
        icon: PhoneCall,
        label: 'Adviseur',
    },
};

type Props = { action: CardAction; card: Card; mood: FaceMood };

export default function ActionCard({ action, card, mood }: Props) {
    const s = style[action.kind];
    const Icon = s.icon;
    const [whyOpen, setWhyOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() =>
                    toast(
                        `${action.cta_label}: in de echte app gaat dit verder.`,
                    )
                }
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left transition-transform active:scale-[0.98]"
            >
                <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${s.tile}`}
                >
                    <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[14px] leading-tight font-semibold text-ink">
                        {action.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] font-bold text-kbc">
                        {action.cta_label}
                        {action.partner_name ? (
                            <span className="font-medium text-ink/45">
                                {' '}
                                · via {action.partner_name}
                            </span>
                        ) : null}
                    </span>
                </span>
                <span aria-hidden className="size-8 shrink-0" />
                <ChevronRight className="size-4 shrink-0 text-ink/35" />
            </button>
            <button
                type="button"
                onClick={() => setWhyOpen(true)}
                aria-label="Waarom dit voorstel?"
                title="Waarom dit voorstel?"
                className="absolute top-1/2 right-9 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-[#f4f6fa] text-kbc transition-colors hover:bg-kbc/12"
            >
                <Lightbulb className="size-4" />
            </button>
            <WhySuggestionDrawer
                action={action}
                card={card}
                mood={mood}
                open={whyOpen}
                onOpenChange={setWhyOpen}
            />
        </div>
    );
}
