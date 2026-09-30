import ActionCard from '@/components/doppel/ActionCard';
import type {
    ActionKind,
    Card,
    CardAction,
    FaceMood,
} from '@/components/doppel/types';

type Row = { action: CardAction; card: Card };

const groups: { kind: ActionKind; title: string; blurb: string }[] = [
    {
        kind: 'human',
        title: 'Een mens erbij',
        blurb: 'Als het groter is dan een tip.',
    },
    {
        kind: 'no_sale',
        title: 'Geen verkoop',
        blurb: 'Dingen die je zelf kunt doen.',
    },
    {
        kind: 'kbc',
        title: 'Bij KBC',
        blurb: 'Alleen als jij het wil.',
    },
    {
        kind: 'partner',
        title: 'Via een partner',
        blurb: 'Vergelijken kan geen kwaad.',
    },
];

/** Acties: alles wat je kunt doen, gegroepeerd. Bij zorgen komt de mens eerst en verkoop laatst. */
export default function ActionsTab({
    cards,
    mood,
}: {
    cards: Card[];
    mood: FaceMood;
}) {
    const rows: Row[] = cards.flatMap((card) =>
        card.actions.map((action) => ({ action, card })),
    );
    const worried = mood === 'worried' || mood === 'paused';
    const order = worried
        ? groups
        : [groups[2], groups[1], groups[3], groups[0]];
    const visible = order.filter((g) =>
        rows.some((r) => r.action.kind === g.kind),
    );

    return (
        <section className="px-5 pt-6 pb-6">
            <h2 className="text-[22px] font-bold tracking-tight">
                Wat je kunt doen
            </h2>
            <p className="mt-0.5 text-[13px] text-ink/55">
                {worried
                    ? 'Eerst hulp, dan tips. Verkopen doe ik nu niet.'
                    : 'Kies zelf. Ik dring niet aan.'}
            </p>

            {visible.length === 0 ? (
                <div className="mt-4 rounded-[24px] bg-emerald-50 p-6 text-center">
                    <p className="text-[18px] leading-snug font-bold">
                        Niets te doen. Geniet ervan.
                    </p>
                </div>
            ) : (
                visible.map((g, gi) => (
                    <div
                        key={g.kind}
                        className="mt-6 animate-doppel-rise"
                        style={{ animationDelay: `${gi * 80}ms` }}
                    >
                        <h3 className="text-[15px] font-bold">{g.title}</h3>
                        <p className="text-[12px] text-ink/50">{g.blurb}</p>
                        <div className="mt-2 flex flex-col gap-2 rounded-[24px] bg-[#f4f6fa] p-2">
                            {rows
                                .filter((r) => r.action.kind === g.kind)
                                .map((r) => (
                                    <div
                                        key={`${r.card.rule_key}-${r.action.title}`}
                                    >
                                        <p className="px-3 pt-2 pb-1 text-[11px] text-ink/45">
                                            {r.card.title}
                                        </p>
                                        <ActionCard action={r.action} />
                                    </div>
                                ))}
                        </div>
                    </div>
                ))
            )}
        </section>
    );
}
