import { CalendarClock } from 'lucide-react';
import { Fragment, useState } from 'react';
import DiaryCard from '@/components/doppel/DiaryCard';
import {
    cardsWithin,
    daysBetween,
    horizonEnd,
    monthKey,
    monthLabel,
    seasonalMoments,
} from '@/components/doppel/forecast';
import MoneyForecast from '@/components/doppel/MoneyForecast';
import type {
    Card,
    FaceMood,
    Horizon,
    MascotVariant,
    Monthly,
    SeasonalMoment,
} from '@/components/doppel/types';
import { euro, shortDate } from '@/components/doppel/types';
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
        subtitle: 'Zo leefde ik de komende dertig dagen, dag na dag.',
    },
    {
        value: 3,
        label: '3 maanden',
        subtitle: 'Zo leefde ik de komende drie maanden, maand na maand.',
    },
    {
        value: 12,
        label: '12 maanden',
        subtitle: 'Zo leefde ik het komende jaar, maand na maand.',
    },
];

type Entry =
    | { kind: 'card'; date: string; card: Card }
    | { kind: 'season'; date: string; moment: SeasonalMoment };

/** Terugkerend jaarmoment: lichter dan een voorspelling, want het is geen verrassing. */
function SeasonCard({
    moment,
    index,
}: {
    moment: SeasonalMoment;
    index: number;
}) {
    return (
        <article
            className="flex animate-doppel-rise flex-col gap-2 rounded-[24px] border border-dashed border-ink/15 bg-white p-4"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <header className="flex items-center gap-2">
                <span className="rounded-full bg-ink/6 px-2.5 py-1 text-[11px] font-bold text-ink/55">
                    Verwacht
                </span>
                <span className="text-[12px] text-ink/50">
                    {shortDate(moment.expected_on)}
                </span>
                <span className="flex-1" />
                {moment.impact_cents !== 0 && (
                    <span className="text-[13px] font-bold text-ink/60">
                        {euro(moment.impact_cents)}
                    </span>
                )}
            </header>
            <div>
                <h3 className="text-[15px] leading-snug font-bold text-ink/85">
                    {moment.title}
                </h3>
                <p className="mt-1 text-[13px] leading-snug text-ink/55">
                    {moment.body}
                </p>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-ink/40">
                <CalendarClock className="size-3.5" />
                Komt elk jaar terug · op basis van je eigen uitgaven
            </p>
        </article>
    );
}

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
    const totalDays = daysBetween(today, end);

    const inRange = cardsWithin(cards, end);
    const seasonal =
        horizon > 1 && monthly ? seasonalMoments(today, end, monthly) : [];
    const entries: Entry[] = [
        ...inRange.map((card) => ({
            kind: 'card' as const,
            date: card.expected_on,
            card,
        })),
        ...seasonal.map((moment) => ({
            kind: 'season' as const,
            date: moment.expected_on,
            moment,
        })),
    ].sort((a, b) => a.date.localeCompare(b.date));

    const fadeFor = (entry: Entry, i: number) =>
        horizon === 1
            ? Math.max(0.55, 1 - i * 0.12)
            : Math.max(
                  0.55,
                  1 - (daysBetween(today, entry.date) / totalDays) * 0.5,
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
                {entries.map((entry, i) => {
                    const fade = fadeFor(entry, i);
                    const month = monthKey(entry.date);
                    const newMonth =
                        horizon > 1 &&
                        month !== monthKey(today) &&
                        (i === 0 || monthKey(entries[i - 1].date) !== month);
                    const header = newMonth && (
                        <li
                            className="relative -mb-1 pt-2"
                            style={{ opacity: fade }}
                        >
                            <span
                                aria-hidden
                                className="absolute top-3.5 -left-[23px] size-2 rounded-full bg-ink/25"
                            />
                            <span className="text-[11px] font-bold tracking-[0.14em] text-ink/45 uppercase">
                                {monthLabel(entry.date)}
                            </span>
                        </li>
                    );

                    if (entry.kind === 'season') {
                        return (
                            <Fragment key={entry.moment.key}>
                                {header}
                                <li
                                    className="relative"
                                    style={{ opacity: fade }}
                                >
                                    <span
                                        aria-hidden
                                        className="absolute top-5 -left-7 size-5 rounded-full border-2 border-dashed border-ink/20 bg-white"
                                    />
                                    <SeasonCard
                                        moment={entry.moment}
                                        index={i}
                                    />
                                </li>
                            </Fragment>
                        );
                    }

                    const card = entry.card;
                    return (
                        <Fragment key={`${card.rule_key}-${card.id}`}>
                            {header}
                            <li
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
                                        leaving !== null && leaving === card.id
                                    }
                                    onWhy={onWhy}
                                />
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
            {entries.length === 0 && (
                <div className="mt-4 rounded-[24px] bg-emerald-50 p-6 text-center">
                    <p className="text-[20px] leading-snug font-bold">
                        Ik heb je maand geleefd. Niets om je zorgen over te
                        maken.
                    </p>
                </div>
            )}

            {monthly && balanceCents !== undefined && (
                <MoneyForecast
                    horizon={horizon}
                    today={today}
                    end={end}
                    balanceCents={balanceCents}
                    monthly={monthly}
                    cards={inRange}
                    seasonal={seasonal}
                    mood={mood}
                    variant={variant}
                />
            )}
        </section>
    );
}
