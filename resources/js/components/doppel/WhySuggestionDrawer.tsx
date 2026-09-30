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

/** Wat KBC commercieel aan dit soort voorstel heeft. Vast, per soort. */
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
                text: 'KBC-product · KBC verdient hieraan',
                cls: 'bg-kbc/12 text-kbc',
            };
        case 'partner':
            return {
                text: `${action.partner_name ? `Partner: ${action.partner_name}` : 'Partner'} · KBC krijgt mogelijk een vergoeding`,
                cls: 'bg-ink/8 text-ink/70',
            };
        case 'no_sale':
            return {
                text: 'Niets te verkopen',
                cls: 'bg-emerald-100 text-emerald-700',
            };
        case 'human':
            return {
                text: 'Een echte persoon · gratis',
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
            ? `Het speelt over ${days} dagen`
            : days === 1
              ? 'Het speelt morgen al'
              : days === 0
                ? 'Het speelt vandaag'
                : 'Het speelt nu al';
    if (card.urgency >= 70) return `${when}, dus nu is het moment.`;
    if (card.urgency >= 40) return `${when}. Beter op tijd dan te laat.`;
    return `${when}. Geen haast.`;
}

/** Hoe goed het voorstel voor jou is: hulp en tips altijd hoog, anders naar het bedrag. */
function valueForYou(action: CardAction, card: Card): number {
    if (action.kind === 'no_sale' || action.kind === 'human') return 90;
    if (card.impact_cents === null) return 55;
    return Math.min(
        85,
        45 + Math.round(Math.abs(card.impact_cents) / 100 / 25),
    );
}

/** Lade van onder: waarom Doppel dit voorstel doet, en wat KBC eraan heeft. */
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
            text: `Ik ben er ${card.confidence}% zeker van dat dit bij je past.`,
        },
        { icon: CalendarClock, text: timingLine(card) },
        ...(card.impact_cents !== null
            ? [
                  {
                      icon: HeartHandshake,
                      text: `Het gaat om ${euro(Math.abs(card.impact_cents))}.`,
                  },
              ]
            : []),
        ...(card.signals.length > 0
            ? [
                  {
                      icon: Eye,
                      text:
                          card.signals.length === 1
                              ? 'Gebaseerd op 1 ding dat ik zag.'
                              : `Gebaseerd op ${card.signals.length} dingen die ik zag.`,
                  },
              ]
            : []),
    ];

    const bars = [
        { label: 'Past bij je situatie', value: card.confidence, kbc: false },
        { label: 'Juiste moment', value: card.urgency, kbc: false },
        {
            label: 'Goed voor jou',
            value: valueForYou(action, card),
            kbc: false,
        },
        { label: 'Goed voor KBC', value: commercial[action.kind], kbc: true },
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
                    Waarom dit voorstel?
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
                    Waarom ik dit voorstel
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
                        Wat goed is voor jou weegt 2,5× zwaarder dan wat goed is
                        voor KBC.
                    </p>
                </div>

                {(worried || selling) && (
                    <div className="mt-3 flex flex-col gap-1 rounded-2xl bg-emerald-50 p-3 text-[13px] leading-snug font-semibold text-emerald-800">
                        {worried && (
                            <p>
                                Omdat het nu krap is, verkoop ik je niets. Enkel
                                hulp.
                            </p>
                        )}
                        {selling && (
                            <p>
                                Je hoeft niets te doen. Dit is een voorstel,
                                geen verplichting.
                            </p>
                        )}
                    </div>
                )}

                <p className="mt-5 text-center text-[12px] leading-snug text-ink/50">
                    Vaste, controleerbare regels kozen dit voorstel. AI hielp
                    enkel de woorden te schrijven.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        onOpenChange(false);
                        toast(
                            'Oké, ik toon je minder van dit soort voorstellen.',
                        );
                    }}
                    className="mt-2 self-center text-[13px] font-semibold text-kbc underline-offset-2 hover:underline"
                >
                    Toon me minder van dit soort voorstellen
                </button>
            </SheetContent>
        </Sheet>
    );
}
