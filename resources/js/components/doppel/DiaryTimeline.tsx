import DiaryCard from '@/components/doppel/DiaryCard';
import type { Card, FaceMood } from '@/components/doppel/types';
import { shortDate } from '@/components/doppel/types';

type Props = {
    cards: Card[];
    today: string;
    mood: FaceMood;
    leaving: number | null;
    onWhy: (card: Card) => void;
};

/** Dagboek: alle kaarten op een tijdlijn, van vandaag naar verder weg. Ver = vager. */
export default function DiaryTimeline({
    cards,
    today,
    mood,
    leaving,
    onWhy,
}: Props) {
    const sorted = [...cards].sort((a, b) =>
        a.expected_on.localeCompare(b.expected_on),
    );

    return (
        <section className="px-5 pt-6 pb-6">
            <h2 className="text-[22px] font-bold tracking-tight">
                Mijn dagboek
            </h2>
            <p className="mt-0.5 text-[13px] text-ink/55">
                Zo leefde ik de komende dertig dagen, dag na dag.
            </p>

            <ol className="relative mt-5 flex flex-col gap-4 pl-7">
                {/* tijd-as */}
                <span
                    aria-hidden
                    className="absolute top-2 bottom-2 left-[9px] w-px bg-ink/10"
                />
                <li className="relative -mb-1">
                    <span
                        aria-hidden
                        className="absolute top-1 -left-7 grid size-5 place-items-center rounded-full bg-kbc/15"
                    >
                        <span className="size-2.5 rounded-full bg-kbc shadow-[0_0_0_4px_rgba(0,163,224,0.2)]" />
                    </span>
                    <span className="text-[11px] font-bold tracking-[0.14em] text-kbc uppercase">
                        Vandaag · {shortDate(today)}
                    </span>
                </li>
                {sorted.map((card, i) => {
                    const fade = Math.max(0.55, 1 - i * 0.12);
                    return (
                        <li
                            key={`${card.rule_key}-${card.id}`}
                            className="relative"
                            style={{ opacity: leaving === card.id ? 1 : fade }}
                        >
                            <span
                                aria-hidden
                                className="absolute top-5 -left-7 size-5 rounded-full border-2 border-white bg-ink/15"
                            />
                            <DiaryCard
                                card={card}
                                index={i}
                                mood={mood}
                                leaving={
                                    leaving !== null && leaving === card.id
                                }
                                onWhy={onWhy}
                            />
                        </li>
                    );
                })}
            </ol>
            {sorted.length === 0 && (
                <div className="mt-4 rounded-[24px] bg-emerald-50 p-6 text-center">
                    <p className="text-[20px] leading-snug font-bold">
                        Ik heb je maand geleefd. Niets om je zorgen over te
                        maken.
                    </p>
                </div>
            )}
        </section>
    );
}
