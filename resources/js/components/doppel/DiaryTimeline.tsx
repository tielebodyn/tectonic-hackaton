import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import BalanceChart from '@/components/doppel/BalanceChart';
import {
    cardsWithin,
    daysBetween,
    horizonEnd,
    monthLabel,
    noWhatIf,
    project,
    seasonalMoments,
    type Cost,
} from '@/components/doppel/forecast';
import type {
    Card,
    FaceMood,
    Horizon,
    MascotVariant,
    Monthly,
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

type Row = {
    key: string;
    date: string;
    title: string;
    cents: number | null;
    card: Card | null;
    urgent: boolean;
};

const horizons: { value: Horizon; label: string }[] = [
    { value: 1, label: '30 days' },
    { value: 3, label: '3 months' },
    { value: 12, label: '1 year' },
];

/** Diary: how far ahead, one balance line, and what happened per month. */
export default function DiaryTimeline({
    cards,
    today,
    leaving,
    onWhy,
    monthly,
    balanceCents,
}: Props) {
    const [horizon, setHorizon] = useState<Horizon>(1);
    const [active, setActive] = useState<string | null>(null);
    const end = horizonEnd(today, horizon);

    const rows: Row[] = [
        ...cardsWithin(cards, end)
            .filter((c) => c.rule_key !== 'all_good')
            .map((c) => ({
                key: `card-${c.rule_key}-${c.id}`,
                date: c.expected_on,
                title: c.title,
                cents: c.impact_cents,
                card: c,
                urgent: c.urgency >= 70,
            })),
        ...(horizon > 1 && monthly
            ? seasonalMoments(today, end, monthly).map((s) => ({
                  key: s.key,
                  date: s.expected_on,
                  title: s.title,
                  cents: s.impact_cents,
                  card: null,
                  urgent: false,
              }))
            : []),
    ]
        .filter((r) => r.card === null || r.card.id !== leaving)
        .sort((a, b) => a.date.localeCompare(b.date));

    const costs: Cost[] = rows
        .filter((r) => (r.cents ?? 0) < 0)
        .map((r) => ({
            key: r.key,
            day: Math.max(0, daysBetween(today, r.date)),
            cents: r.cents ?? 0,
            title: r.title,
            date: r.date,
            kind: r.card ? 'card' : 'season',
        }));
    const points =
        monthly && balanceCents !== undefined
            ? project(
                  balanceCents,
                  monthly,
                  daysBetween(today, end),
                  costs,
                  noWhatIf,
              )
            : null;
    const endBalance = points ? points[points.length - 1].balance : null;
    const delta =
        points && endBalance !== null ? endBalance - points[0].balance : 0;

    const months = rows.reduce<Record<string, Row[]>>((acc, r) => {
        (acc[r.date.slice(0, 7)] ??= []).push(r);
        return acc;
    }, {});

    function pick(key: string) {
        setActive(key);
        document
            .getElementById(key)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return (
        <section className="px-5 pt-6 pb-8">
            <h2 className="text-[22px] font-bold tracking-tight">My diary</h2>
            <p className="mt-0.5 text-[13px] text-ink/55">
                {horizon === 1
                    ? 'How I lived your next month, day by day.'
                    : horizon === 3
                      ? 'How I lived your next three months, month by month.'
                      : 'How I lived your next year, month by month.'}
            </p>

            <div
                role="tablist"
                aria-label="How far ahead"
                className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-[#f4f6fa] p-1"
            >
                {horizons.map((h) => (
                    <button
                        key={h.value}
                        type="button"
                        role="tab"
                        aria-selected={h.value === horizon}
                        onClick={() => {
                            setHorizon(h.value);
                            setActive(null);
                        }}
                        className={cn(
                            'rounded-full py-2 text-[13px] font-semibold transition-colors',
                            h.value === horizon
                                ? 'bg-white text-ink shadow-[0_1px_4px_rgba(11,31,58,0.1)]'
                                : 'text-ink/50 hover:text-ink',
                        )}
                    >
                        {h.label}
                    </button>
                ))}
            </div>

            {points && endBalance !== null && (
                <div
                    key={horizon}
                    className="mt-4 animate-doppel-rise rounded-[24px] bg-[#f4f6fa] p-4"
                >
                    <p className="text-[12px] text-ink/50">
                        In my account on {shortDate(end)}
                        {horizon > 1 ? ` ${end.slice(0, 4)}` : ''}
                    </p>
                    <div className="mt-0.5 flex items-baseline justify-between gap-2">
                        <p
                            className={cn(
                                'text-[28px] leading-none font-bold tracking-tight',
                                endBalance < 0 ? 'text-[#e5484d]' : 'text-ink',
                            )}
                        >
                            {euro(endBalance)}
                        </p>
                        <span
                            className={cn(
                                'rounded-full px-2.5 py-1 text-[12px] font-bold',
                                delta < 0
                                    ? 'bg-[#e5484d]/10 text-[#e5484d]'
                                    : 'bg-emerald-100 text-emerald-700',
                            )}
                        >
                            {delta >= 0 ? '+' : ''}
                            {euro(delta)}
                        </span>
                    </div>
                    <div className="mt-4">
                        <BalanceChart
                            points={points}
                            today={today}
                            end={end}
                            active={active}
                            onPick={pick}
                            markers={rows
                                .filter(
                                    (r) => r.cents !== null && r.cents !== 0,
                                )
                                .map((r) => ({
                                    key: r.key,
                                    day: Math.max(
                                        0,
                                        daysBetween(today, r.date),
                                    ),
                                    negative: (r.cents ?? 0) < 0,
                                }))}
                        />
                    </div>
                </div>
            )}

            {rows.length === 0 ? (
                <div className="mt-6 rounded-[24px] bg-emerald-50 p-6 text-center">
                    <p className="text-[18px] leading-snug font-bold">
                        I've already lived this stretch. Nothing happened to
                        worry about.
                    </p>
                </div>
            ) : (
                Object.entries(months).map(([month, items], mi) => (
                    <div
                        key={`${horizon}-${month}`}
                        className="mt-6 animate-doppel-rise"
                        style={{ animationDelay: `${mi * 60}ms` }}
                    >
                        <h3 className="mb-2 text-[12px] font-bold tracking-[0.12em] text-ink/40 uppercase">
                            {monthLabel(`${month}-01`)}
                        </h3>
                        <ul className="overflow-hidden rounded-[22px] bg-[#f4f6fa]">
                            {items.map((r, i) => {
                                const day = r.date
                                    .slice(8, 10)
                                    .replace(/^0/, '');
                                const Row = r.card ? 'button' : 'div';
                                return (
                                    <li
                                        key={r.key}
                                        id={r.key}
                                        className={cn(
                                            i > 0 && 'border-t border-ink/6',
                                        )}
                                    >
                                        <Row
                                            {...(r.card
                                                ? {
                                                      type: 'button' as const,
                                                      onClick: () =>
                                                          r.card &&
                                                          onWhy(r.card),
                                                  }
                                                : {})}
                                            className={cn(
                                                'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors',
                                                active === r.key && 'bg-kbc/8',
                                                r.card && 'hover:bg-ink/3',
                                            )}
                                        >
                                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[15px] font-bold text-ink">
                                                {day}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="line-clamp-2 text-[14px] leading-snug font-semibold text-ink">
                                                    {r.title}
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink/45">
                                                    {r.urgent && (
                                                        <span className="size-1.5 rounded-full bg-orange-500" />
                                                    )}
                                                    {r.card
                                                        ? `${r.card.confidence}% sure`
                                                        : 'Every year'}
                                                </span>
                                            </span>
                                            {r.cents !== null &&
                                                r.cents !== 0 && (
                                                    <span
                                                        className={cn(
                                                            'shrink-0 text-[14px] font-bold',
                                                            r.cents < 0
                                                                ? 'text-ink'
                                                                : 'text-emerald-600',
                                                        )}
                                                    >
                                                        {r.cents > 0 ? '+' : ''}
                                                        {euro(r.cents)}
                                                    </span>
                                                )}
                                            {r.card && (
                                                <ChevronRight className="size-4 shrink-0 text-ink/30" />
                                            )}
                                        </Row>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))
            )}
        </section>
    );
}
