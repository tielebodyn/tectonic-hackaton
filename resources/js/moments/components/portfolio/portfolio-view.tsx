import { Lock, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
    MONTHS_LONG,
    NO_SCENARIO,
    bufferMonths,
    extraOption,
    liquidCents,
    monthName,
    project,
    purchaseAmount,
    saveOptions,
    short,
    yearItems,
} from '../../data/portfolio';
import type { Scenario } from '../../data/portfolio';
import { view as buildView } from '../../engine';
import type { Persona, PersonaView } from '../../types';
import { BalanceChart } from './balance-chart';
import { HelpCards } from './help-cards';
import { MomentDetail } from './moment-detail';
import { WhatIf } from './what-if';
import { YearTimeline } from './year-timeline';
import { cn } from '@/lib/utils';

function Section({
    eyebrow,
    title,
    aside,
    children,
}: {
    eyebrow: string;
    title: string;
    aside?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="border-line rounded-[28px] border bg-white p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="mb-7 flex items-end justify-between gap-6">
                <div>
                    <div className="text-ink-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                        {eyebrow}
                    </div>
                    <h2 className="mt-1.5 text-[22px] font-semibold tracking-tight text-ink">
                        {title}
                    </h2>
                </div>
                {aside}
            </div>
            {children}
        </section>
    );
}

function Stat({
    label,
    value,
    sub,
    children,
}: {
    label: string;
    value: ReactNode;
    sub: ReactNode;
    children?: ReactNode;
}) {
    return (
        <div className="border-line flex flex-col rounded-3xl border bg-white p-5">
            <div className="text-ink-3 text-[13px]">{label}</div>
            <div className="mt-1.5 text-[28px] leading-tight font-semibold tracking-tight text-ink tabular-nums">
                {value}
            </div>
            <div className="text-ink-2 mt-1 text-[13px] leading-snug">
                {sub}
            </div>
            {children}
        </div>
    );
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function PortfolioView({
    personas,
    view: given,
    onOpenPersona,
}: {
    personas: Persona[];
    view?: PersonaView;
    onOpenPersona: (id: string) => void;
}) {
    const view =
        given ?? (personas[0] ? buildView(personas[0], [], []) : undefined);
    const [selected, setSelected] = useState<string | undefined>();
    const [scenario, setScenario] = useState<Scenario>(NO_SCENARIO);

    if (!view) {
        return <div className="text-ink-3 p-10">No customers loaded yet.</div>;
    }

    const items = yearItems(view);
    const moments = items.filter((i) => i.kind === 'moment');
    const active = moments.find((m) => m.id === selected) ?? moments[0];
    const activeN = active ? moments.indexOf(active) + 1 : 0;

    const saveSteps = saveOptions(view);
    const purchase = purchaseAmount(view);
    const extra = extraOption(view);
    const baseline = project(view, items, NO_SCENARIO);
    const points = project(view, items, scenario);
    const changed = JSON.stringify(scenario) !== JSON.stringify(NO_SCENARIO);

    const { incomeCents, spendCents } = view.monthly;
    const net = incomeCents - spendCents;
    const liquid = liquidCents(view);
    const buffer = bufferMonths(liquid, view);
    const next = moments.find((m) => m.days >= 14) ?? moments[0];

    /* ---------- the one sentence that explains the chart ---------- */
    const end = points[12];
    const low = Math.min(...points);
    const lowMonth = points.indexOf(low);
    const endBuffer = bufferMonths(end, view);
    const firstAt = (series: number[], months: number) =>
        series.findIndex((v) => bufferMonths(v, view) >= months);
    const changes = [
        scenario.saveStep > 0 &&
            `spend ${short(saveSteps[scenario.saveStep])} less a month`,
        scenario.purchase &&
            `spend ${short(purchase)} in ${MONTHS_LONG[scenario.purchaseMonth - 1]}`,
        scenario.incomeDrop && 'earn 20% less from January',
        scenario.extra && lower(extra.label),
    ].filter(Boolean) as string[];
    const joined =
        changes.length > 1
            ? `${changes.slice(0, -1).join(', ')} and ${changes.at(-1)}`
            : changes[0];

    let headline: ReactNode;
    let tone = 'text-ink';

    if (low < 0) {
        tone = 'text-k-human';
        headline = (
            <>
                {changed ? `If you ${joined}, ` : 'Heads up: '}
                you'd be{' '}
                <span className="font-semibold">
                    {short(-low)} short
                </span> by{' '}
                {monthName(lowMonth)}.{' '}
                <span className="text-ink-2">
                    We'd rather talk about it now than then.
                </span>
            </>
        );
    } else if (!changed) {
        headline = (
            <>
                If things carry on like this, you'll have{' '}
                <span className="text-kbc-navy font-semibold">
                    {short(end)}
                </span>{' '}
                by next September. That's about {endBuffer.toFixed(1)} months of
                what you spend.
            </>
        );
    } else {
        const diff = end - baseline[12];
        const reach = firstAt(points, 3);
        const baseReach = firstAt(baseline, 3);
        const milestone =
            reach > 0 && (baseReach === -1 || reach < baseReach)
                ? ` a 3-month safety buffer by ${monthName(reach)}, and`
                : '';

        headline = (
            <>
                If you {joined}, you'd have{milestone}{' '}
                <span className="text-kbc-navy font-semibold">
                    {short(end)}
                </span>{' '}
                by next September:{' '}
                <span
                    className={cn(
                        'font-semibold',
                        diff >= 0 ? 'text-k-nosale' : 'text-k-human',
                    )}
                >
                    {diff >= 0 ? '+' : ''}
                    {short(diff)}
                </span>{' '}
                compared to carrying on as now.
            </>
        );
    }

    const selectMoment = (id: string) => setSelected(id);

    return (
        <div className="mx-auto max-w-[1440px] space-y-8 px-10 pt-10 pb-12">
            {/* ---------- hero ---------- */}
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-10">
                <div>
                    <div className="text-kbc-sky text-[13px] font-medium">
                        Your year ahead · Oct 2026 to Sep 2027
                    </div>
                    <h1 className="mt-3 text-[44px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
                        Here's what's coming up
                        <br />
                        for you, {view.firstName}.
                    </h1>
                    <p className="text-ink-2 mt-4 max-w-[560px] text-[17px] leading-relaxed">
                        {view.greeting}
                    </p>
                </div>

                <div className="grid w-[720px] grid-cols-3 gap-4">
                    <Stat
                        label="This month"
                        value={
                            <span
                                className={
                                    net >= 0 ? 'text-ink' : 'text-k-human'
                                }
                            >
                                {net >= 0 ? '+' : ''}
                                {short(net)}
                            </span>
                        }
                        sub={
                            net >= 0
                                ? 'left over after everything'
                                : 'more going out than coming in'
                        }
                    >
                        <div className="text-ink-3 mt-4 space-y-1.5 text-[12px] tabular-nums">
                            {[
                                ['In', incomeCents, 'bg-k-nosale'],
                                ['Out', spendCents, 'bg-ink-3/60'],
                            ].map(([label, v, color]) => (
                                <div
                                    key={label as string}
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-6">{label}</span>
                                    <div className="bg-mist h-1.5 flex-1 overflow-hidden rounded-full">
                                        <div
                                            className={cn(
                                                'h-full rounded-full',
                                                color as string,
                                            )}
                                            style={{
                                                width: `${((v as number) / Math.max(incomeCents, spendCents, 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-ink-2 w-12 text-right">
                                        {short(v as number)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Stat>
                    <Stat
                        label="Your safety buffer"
                        value={
                            <>
                                {buffer.toFixed(1)}{' '}
                                <span className="text-ink-2 text-[17px] font-medium">
                                    months
                                </span>
                            </>
                        }
                        sub={`of spending, ${short(liquid)} on your accounts`}
                    >
                        <div className="mt-4 flex gap-1">
                            {Array.from({ length: 6 }, (_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'h-1.5 flex-1 rounded-full',
                                        buffer >= i + 1
                                            ? 'bg-kbc-navy'
                                            : buffer > i
                                              ? 'bg-kbc-navy/40'
                                              : 'bg-mist',
                                    )}
                                />
                            ))}
                        </div>
                        <div className="text-ink-3 mt-1.5 text-[11px]">
                            3 to 6 months is a comfortable cushion
                        </div>
                    </Stat>
                    {next && (
                        <button
                            onClick={() => selectMoment(next.id)}
                            className="bg-kbc-navy hover:bg-kbc-navy-2 flex flex-col rounded-3xl p-5 text-left text-white transition-colors"
                        >
                            <div className="text-[13px] text-white/60">
                                Next big moment
                            </div>
                            <div className="mt-1.5 line-clamp-3 text-[17px] leading-snug font-semibold tracking-tight">
                                {next.title}
                            </div>
                            <div className="mt-2 line-clamp-2 text-[12px] leading-snug text-white/60">
                                {next.moment!.narrative}
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3 text-[12px]">
                                <span className="text-kbc-sky">
                                    {next.moment!.horizon}
                                </span>
                                <span className="text-white/60 tabular-nums">
                                    {next.moment!.confidence}% sure
                                </span>
                            </div>
                        </button>
                    )}
                </div>
            </header>

            {/* ---------- timeline ---------- */}
            <Section
                eyebrow="Your next 12 months"
                title={`${moments.length} moments we see coming`}
                aside={
                    <span className="text-ink-3 text-[13px]">
                        Tap one to see why we think so
                    </span>
                }
            >
                <YearTimeline
                    items={items}
                    selectedId={active?.id}
                    onSelect={selectMoment}
                />
                {active?.moment && (
                    <div className="border-line mt-8 border-t pt-8">
                        <MomentDetail
                            view={view}
                            moment={active.moment}
                            n={activeN}
                        />
                    </div>
                )}
            </Section>

            {/* ---------- projection + what if ---------- */}
            <Section
                eyebrow="Your money, month by month"
                title="Where you could be next September"
                aside={
                    <div className="text-ink-3 flex items-center gap-5 text-[12px]">
                        <span className="flex items-center gap-2">
                            <span className="bg-kbc-navy h-[3px] w-5 rounded-full" />
                            {changed
                                ? 'With your changes'
                                : 'If nothing changes'}
                        </span>
                        {changed && (
                            <span className="flex items-center gap-2">
                                <span className="border-ink-3 w-5 border-t-2 border-dashed" />
                                As now
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <span className="border-kbc-navy text-kbc-navy flex size-4 items-center justify-center rounded-full border-2 text-[8px] font-bold">
                                1
                            </span>
                            Your moments
                        </span>
                    </div>
                }
            >
                <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-10">
                    <div>
                        <p
                            className={cn(
                                'mb-8 max-w-[760px] text-[21px] leading-snug tracking-tight',
                                tone,
                            )}
                        >
                            {headline}
                        </p>
                        <BalanceChart
                            points={points}
                            baseline={baseline}
                            items={items}
                            selectedId={active?.id}
                            onSelect={selectMoment}
                        />
                        <div className="text-ink-3 mt-6 text-[12px]">
                            Based on your average income and spending, your
                            moments and a typical year. Investments not
                            included.
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-[15px] font-semibold text-ink">
                                What if…
                            </div>
                            {changed && (
                                <button
                                    onClick={() => setScenario(NO_SCENARIO)}
                                    className="text-ink-3 flex items-center gap-1 text-[12px] hover:text-ink"
                                >
                                    <RotateCcw className="size-3" />
                                    Reset
                                </button>
                            )}
                        </div>
                        <WhatIf
                            scenario={scenario}
                            onChange={setScenario}
                            saveSteps={saveSteps}
                            purchase={purchase}
                            extra={extra}
                        />
                    </div>
                </div>
            </Section>

            {/* ---------- help ---------- */}
            <Section
                eyebrow="Help for these moments"
                title="What we'd suggest, in this order"
                aside={
                    <span className="text-ink-3 text-[13px]">
                        Ranked by how much it helps you, not us
                    </span>
                }
            >
                <HelpCards
                    view={view}
                    onSelectMoment={selectMoment}
                    onOpen={() => onOpenPersona(view.id)}
                />
            </Section>

            {/* ---------- private by design ---------- */}
            <footer className="text-ink-2 flex items-center gap-3 rounded-2xl px-2 text-[13px]">
                <span className="text-kbc-navy ring-line flex size-8 items-center justify-center rounded-full bg-white ring-1">
                    <Lock className="size-3.5" />
                </span>
                <span>
                    <span className="font-semibold text-ink">
                        Private by design.
                    </span>{' '}
                    Your data stays with KBC and is never sold. You choose what
                    we use, and it works the same way for each of KBC's 2.3
                    million customers.
                </span>
            </footer>
        </div>
    );
}
