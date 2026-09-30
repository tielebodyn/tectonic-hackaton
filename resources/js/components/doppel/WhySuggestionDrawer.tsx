import { CalendarClock, Eye, HeartHandshake, Target } from 'lucide-react';
import { toast } from 'sonner';
import type {
    ActionKind,
    Card,
    CardAction,
    FaceMood,
} from '@/components/doppel/types';
import { euro } from '@/components/doppel/types';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type Props = {
    action: CardAction;
    card: Card;
    mood: FaceMood;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

/** What KBC gains commercially from this kind of suggestion. Fixed, per kind. */
const commercial: Record<ActionKind, number> = {
    kbc: 60,
    partner: 40,
    no_sale: 0,
    human: 0,
};

function kindLabel(action: CardAction): { text: string; cls: string } {
    switch (action.kind) {
        case 'kbc':
            return {
                text: 'KBC product · KBC earns from this',
                cls: 'bg-kbc/12 text-kbc',
            };
        case 'partner':
            return {
                text: `${action.partner_name ? `Partner: ${action.partner_name}` : 'Partner'} · KBC may receive a fee`,
                cls: 'bg-ink/8 text-ink/70',
            };
        case 'no_sale':
            return {
                text: 'Nothing to sell',
                cls: 'bg-emerald-100 text-emerald-700',
            };
        case 'human':
            return {
                text: 'A real person · free',
                cls: 'bg-orange-100 text-orange-600',
            };
    }
}

function daysUntil(iso: string): number {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return Math.round((new Date(iso).getTime() - start.getTime()) / 86400000);
}

function timingLine(card: Card): string {
    const days = daysUntil(card.expected_on);
    const when =
        days > 1
            ? `It happens in ${days} days`
            : days === 1
              ? 'It happens tomorrow'
              : days === 0
                ? 'It happens today'
                : 'It is happening now';
    if (card.urgency >= 70) return `${when}, so now is the moment.`;
    if (card.urgency >= 40) return `${when}. Better early than late.`;
    return `${when}. No rush.`;
}

/** How good the suggestion is for you: help and tips always score high, otherwise by amount. */
function valueForYou(action: CardAction, card: Card): number {
    if (action.kind === 'no_sale' || action.kind === 'human') return 90;
    if (card.impact_cents === null) return 55;
    return Math.min(
        85,
        45 + Math.round(Math.abs(card.impact_cents) / 100 / 25),
    );
}

/** Bottom drawer: why Doppel makes this suggestion, and what KBC gets out of it. */
export default function WhySuggestionDrawer({
    action,
    card,
    mood,
    open,
    onOpenChange,
}: Props) {
    const label = kindLabel(action);
    const worried = mood === 'worried' || mood === 'paused';
    const selling = action.kind === 'kbc' || action.kind === 'partner';

    const reasons = [
        {
            icon: Target,
            text: `I'm ${card.confidence}% sure this fits you.`,
        },
        { icon: CalendarClock, text: timingLine(card) },
        ...(card.impact_cents !== null
            ? [
                  {
                      icon: HeartHandshake,
                      text: `It's about ${euro(Math.abs(card.impact_cents))}.`,
                  },
              ]
            : []),
        ...(card.signals.length > 0
            ? [
                  {
                      icon: Eye,
                      text:
                          card.signals.length === 1
                              ? 'Based on 1 thing I saw.'
                              : `Based on ${card.signals.length} things I saw.`,
                  },
              ]
            : []),
    ];

    const bars = [
        { label: 'Fits your situation', value: card.confidence, kbc: false },
        { label: 'Right moment', value: card.urgency, kbc: false },
        {
            label: 'Good for you',
            value: valueForYou(action, card),
            kbc: false,
        },
        { label: 'Good for KBC', value: commercial[action.kind], kbc: true },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="doppel mx-auto max-h-[92dvh] max-w-[390px] gap-0 overflow-y-auto rounded-t-[32px] border-0 bg-white px-5 pt-3 pb-8 text-ink"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <span
                    aria-hidden
                    className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-ink/12"
                />
                <SheetTitle className="text-[20px] font-bold text-ink">
                    Why this suggestion?
                </SheetTitle>
                <SheetDescription className="mt-1 text-[14px] text-ink/60">
                    {action.title}
                </SheetDescription>
                <span
                    className={cn(
                        'mt-2 self-start rounded-full px-2.5 py-1 text-[11px] font-bold',
                        label.cls,
                    )}
                >
                    {label.text}
                </span>

                <h3 className="mt-5 text-[15px] font-bold">
                    Why I suggest this
                </h3>
                <ul className="mt-2 flex flex-col gap-2">
                    {reasons.map((reason, i) => {
                        const Icon = reason.icon;
                        return (
                            <li
                                key={reason.text}
                                className="flex animate-doppel-rise items-center gap-3 rounded-2xl bg-[#f4f6fa] p-3"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-kbc">
                                    <Icon className="size-4" />
                                </span>
                                <span className="text-[14px] leading-snug font-semibold">
                                    {reason.text}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-4 rounded-2xl bg-[#f4f6fa] p-4">
                    <ul className="flex flex-col gap-2.5">
                        {bars.map((bar, i) => (
                            <li key={bar.label}>
                                <span className="flex justify-between text-[12px]">
                                    <span className="font-semibold text-ink/70">
                                        {bar.label}
                                    </span>
                                    <span className="text-ink/45 tabular-nums">
                                        {bar.value}
                                    </span>
                                </span>
                                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-white">
                                    <span
                                        className={cn(
                                            'block h-full origin-left animate-doppel-rise rounded-full',
                                            bar.kbc ? 'bg-ink/30' : 'bg-kbc',
                                        )}
                                        style={{
                                            width: `${bar.value}%`,
                                            animationDelay: `${200 + i * 60}ms`,
                                        }}
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-[12px] leading-snug text-ink/55">
                        What is good for you weighs 2.5× more than what is good
                        for KBC.
                    </p>
                </div>

                {(worried || selling) && (
                    <div className="mt-3 flex flex-col gap-1 rounded-2xl bg-emerald-50 p-3 text-[13px] leading-snug font-semibold text-emerald-800">
                        {worried && (
                            <p>
                                Because money is tight right now, I'm not
                                selling you anything. Only help.
                            </p>
                        )}
                        {selling && (
                            <p>
                                You don't have to do anything. This is a
                                suggestion, not an obligation.
                            </p>
                        )}
                    </div>
                )}

                <p className="mt-5 text-center text-[12px] leading-snug text-ink/50">
                    Fixed, auditable rules chose this suggestion. AI only helped
                    write the words.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        onOpenChange(false);
                        toast(
                            "Okay, I'll show you fewer suggestions like this.",
                        );
                    }}
                    className="mt-2 self-center text-[13px] font-semibold text-kbc underline-offset-2 hover:underline"
                >
                    Show me fewer suggestions like this
                </button>
            </SheetContent>
        </Sheet>
    );
}
