import { Activity, Receipt, Smartphone, Wallet } from 'lucide-react';
import type { Card, Signal } from '@/components/doppel/types';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';

type Props = {
    card: Card | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDismiss: (card: Card) => void;
};

function iconFor(signal: Signal) {
    const t = `${signal.label} ${signal.detail}`.toLowerCase();
    if (/saldo|buffer|spaar/.test(t)) return Wallet;
    if (/betaal|factuur|abonnement|huur|kosten|inkomst/.test(t)) return Receipt;
    if (/app|bekeek|zocht|opende/.test(t)) return Smartphone;
    return Activity;
}

/** Lade van onder: "Wat Doppel zag" met signalen en de knop "Zo ben ik niet". */
export default function WhyDrawer({
    card,
    open,
    onOpenChange,
    onDismiss,
}: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="doppel mx-auto max-w-[390px] rounded-t-[32px] border-0 bg-white px-5 pt-3 pb-8 text-ink"
            >
                <span
                    aria-hidden
                    className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-ink/12"
                />
                {card && (
                    <>
                        <SheetTitle className="text-[20px] font-bold text-ink">
                            Wat Doppel zag
                        </SheetTitle>
                        <SheetDescription className="mt-1 text-[14px] text-ink/60">
                            {card.title}
                        </SheetDescription>

                        <ul className="mt-5 flex flex-col gap-2">
                            {card.signals.map((signal, i) => {
                                const Icon = iconFor(signal);
                                return (
                                    <li
                                        key={`${signal.label}-${i}`}
                                        className="flex animate-doppel-rise items-start gap-3 rounded-2xl bg-[#f4f6fa] p-3"
                                        style={{
                                            animationDelay: `${i * 60}ms`,
                                        }}
                                    >
                                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-kbc">
                                            <Icon className="size-4" />
                                        </span>
                                        <span>
                                            <span className="block text-[14px] font-semibold">
                                                {signal.label}
                                            </span>
                                            <span className="block text-[13px] leading-snug text-ink/60">
                                                {signal.detail}
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <p className="mt-5 text-center text-[12px] text-ink/50">
                            Doppel is {card.confidence}% zeker. Klopt dit niet?
                            Zeg het hem.
                        </p>
                        {card.id !== null && (
                            <button
                                type="button"
                                onClick={() => onDismiss(card)}
                                className="mt-3 w-full rounded-full border border-ink/12 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/4"
                            >
                                Zo ben ik niet
                            </button>
                        )}
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
