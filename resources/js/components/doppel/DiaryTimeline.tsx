import { useState } from 'react';
import DiaryCard from '@/components/doppel/DiaryCard';
import {
    cardsWithin,
    horizonEnd,
    seasonalMoments,
} from '@/components/doppel/forecast';
import MoneyForecast from '@/components/doppel/MoneyForecast';
import type {
    Card,
    FaceMood,
    Horizon,
    MascotVariant,
    Monthly,
} from '@/components/doppel/types';
import { shortDate } from '@/components/doppel/types';
import { cn } from '@/lib/utils';

type Props = {
    cards: Card[];
    today: string;
    mood: FaceMood;
    leaving: number | null;
    onWhy: (card: Card) => void;
    monthly?: Monthly;
    balanceCents?: number;
    variant?: MascotVariant;
};

const horizons: { value: Horizon; label: string; subtitle: string }[] = [
    {
        value: 1,
        label: '30 dagen',
        subtitle: 'Zo heb ik je komende maand beleefd, dag na dag.',
    },
    {
        value: 3,
        label: '3 maanden',
        subtitle: 'Zo heb ik je komende drie maanden beleefd, maand na maand.',
    },
    {
        value: 12,
        label: '12 maanden',
        subtitle: 'Zo heb ik je komende jaar beleefd, maand na maand.',
    },
];

/** Dagboek: alle kaarten op een tijdlijn, van vandaag naar verder weg. Ver = vager. */
export default function DiaryTimeline({
    cards,
    today,
    mood,
    leaving,
    onWhy,
    monthly,
    balanceCents,
    variant,
}: Props) {
    const [horizon, setHorizon] = useState<Horizon>(1);
    const current = horizons.find((h) => h.value === horizon) ?? horizons[0];
    const end = horizonEnd(today, horizon);

    const inRange = cardsWithin(cards, end);
    const seasonal =
        horizon > 1 && monthly ? seasonalMoments(today, end, monthly) : [];
    const sorted = [...inRange].sort((a, b) =>
        a.expected_on.localeCompare(b.expected_on),
    );

    return (
        <section className="px-5 pt-6 pb-6">
            <h2 className="text-[22px] font-bold tracking-tight">
                Mijn dagboek
            </h2>
            <p className="mt-0.5 text-[13px] text-ink/55">{current.subtitle}</p>

            <div
                role="tablist"
                aria-label="Hoe ver vooruit"
                className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-[#f4f6fa] p-1"
            >
                {horizons.map((h) => (
                    <button
                        key={h.value}
                        type="button"
                        role="tab"
                        aria-selected={h.value === horizon}
                        onClick={() => setHorizon(h.value)}
                        className={cn(
                            'rounded-full py-2 text-[13px] font-semibold transition-colors',
                            h.value === horizon
                                ? 'bg-ink text-white'
                                : 'text-ink/60 hover:text-ink',
                        )}
                    >
                        {h.label}
                    </button>
                ))}
            </div>

            {monthly && balanceCents !== undefined && (
                <MoneyForecast
                    key={horizon}
                    horizon={horizon}
                    today={today}
                    end={end}
                    balanceCents={balanceCents}
                    monthly={monthly}
                    cards={inRange}
                    seasonal={seasonal}
                    mood={mood}
                    variant={variant}
                    onWhy={onWhy}
                    yearView={horizon > 1}
                />
            )}

            {horizon === 1 && (
                <>
                    <h3 className="mt-8 text-[18px] font-bold">Dag na dag</h3>
                    <ol className="relative mt-4 flex flex-col gap-4 pl-7">
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
                                    style={{
                                        opacity: leaving === card.id ? 1 : fade,
                                    }}
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
                                            leaving !== null &&
                                            leaving === card.id
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
                                Ik heb je maand al geleefd. Er gebeurde niets om
                                je zorgen over te maken.
                            </p>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
