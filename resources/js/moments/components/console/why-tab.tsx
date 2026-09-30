import {
    ArrowUp,
    Coins,
    HandHeart,
    Heart,
    PauseCircle,
    Shield,
    Sparkles,
} from 'lucide-react';
import { baseScore, WEIGHTS } from '../../engine';
import type {
    PersonaView,
    RankedRecommendation,
    Recommendation,
} from '../../types';
import { KindChip } from '../../ui';
import type { Fresh, Prefs } from './shared';
import { Card, EmptyNote, NewTag, SectionHeader, freshClass } from './shared';
import { cn } from '@/lib/utils';

const PARTS = [
    {
        key: 'relevance',
        label: 'Fits your situation',
        reason: 'Fits your situation',
        color: 'bg-kbc-navy',
    },
    {
        key: 'timing',
        label: 'Right timing',
        reason: 'The timing is now',
        color: 'bg-kbc-navy/45',
    },
    {
        key: 'customerValue',
        label: 'Good for you',
        reason: 'Helps you most',
        color: 'bg-k-nosale',
    },
    {
        key: 'kbcValue',
        label: 'Good for KBC',
        reason: '',
        color: 'bg-ink-3/60',
    },
] as const;

const stripes = (color: string) => ({
    background: `repeating-linear-gradient(135deg, var(--color-${color}) 0 2px, transparent 2px 4px)`,
});

const RATIO = Math.round((WEIGHTS.customerValue / WEIGHTS.kbcValue) * 10) / 10;

function honesty(rec: Recommendation): {
    label: string;
    icon: typeof Heart;
    cls: string;
} {
    switch (rec.kind) {
        case 'kbc':
            return {
                label: 'KBC earns from this',
                icon: Coins,
                cls: 'bg-mist text-ink-2',
            };
        case 'partner':
            return {
                label: `KBC earns a fee from ${rec.partner ?? 'this partner'}`,
                icon: Coins,
                cls: 'bg-mist text-ink-2',
            };
        case 'no_sale':
            return {
                label: 'Nothing to sell',
                icon: HandHeart,
                cls: 'bg-k-nosale/10 text-k-nosale',
            };
        case 'human':
            return {
                label: 'Free, no sales goal',
                icon: Heart,
                cls: 'bg-k-human/8 text-k-human',
            };
        case 'protect':
            return {
                label: 'Free, for your safety',
                icon: Shield,
                cls: 'bg-k-protect/10 text-k-protect',
            };
    }
}

function heldBackReason(reason: string): string {
    if (reason.startsWith('Sales paused')) {
        return "Things look tight right now, so we won't sell you anything.";
    }

    if (reason.startsWith('No third-party')) {
        return "To keep you safe, we don't show offers from other companies right now.";
    }

    if (reason.startsWith('Sensitive moment')) {
        return 'This is a difficult time. No offers from other companies for now.';
    }

    if (reason.startsWith('Customer said')) {
        return "You told us this wasn't relevant for you.";
    }

    if (reason.startsWith('The moment behind')) {
        return 'This no longer applies to you.';
    }

    return reason;
}

function plainLog(line: string, view: PersonaView): string {
    let m = line.match(/^Scored (\d+) candidate actions for (\d+)/);

    if (m) {
        return `We looked at ${m[1]} ways to help with the ${m[2]} moments we see coming.`;
    }

    m = line.match(/^(\d+) action\(s\) removed after customer feedback/);

    if (m) {
        return `You told us ${m[1] === '1' ? 'one suggestion wasn’t' : `${m[1]} suggestions weren’t`} relevant, so we dropped ${m[1] === '1' ? 'it' : 'them'} and will show fewer like ${m[1] === '1' ? 'it' : 'them'}.`;
    }

    if (line.startsWith('Guardrail: financial stress')) {
        return 'Money looks tight, so we paused every offer and put a real person first.';
    }

    if (line.startsWith('Guardrail: vulnerability')) {
        return 'We are taking extra care: your safety comes first and offers from other companies are off.';
    }

    if (line.startsWith('Diversity rule')) {
        return 'We never show you more than one offer among your top three suggestions.';
    }

    if (line.startsWith('Trust rule: at least one')) {
        return 'At least one suggestion sells you nothing at all.';
    }

    if (line.startsWith('Trust rule: no')) {
        return 'Nothing without a sales goal fitted, so the app shows you a simple overview instead.';
    }

    m = line.match(/^Next best action: "(.+)" \(score/);

    if (m) {
        return `That makes “${m[1]}” our top suggestion for you${view.firstName ? `, ${view.firstName}` : ''}.`;
    }

    return line;
}

export function WhyTab({
    view,
    fresh,
    prevRanks,
    prefs,
}: {
    view: PersonaView;
    fresh: Fresh;
    prevRanks: Record<string, number> | null;
    prefs: Prefs;
}) {
    const selling = (r: RankedRecommendation) =>
        r.rec.kind === 'kbc' || r.rec.kind === 'partner';
    const shown = prefs.pauseOffers
        ? view.decision.ranked.filter((r) => !selling(r))
        : view.decision.ranked;
    const paused = prefs.pauseOffers
        ? view.decision.ranked.filter(selling)
        : [];
    const held = [
        ...paused.map((r) => ({
            rec: r.rec,
            reason: 'You paused all offers. You can turn them back on any time.',
        })),
        ...view.decision.suppressed.map((s) => ({
            rec: s.rec,
            reason: heldBackReason(s.reason),
        })),
    ];
    const care = view.state.vulnerable ? 'k-protect' : 'k-human';
    const top = shown.slice(0, 3);
    const rest = shown.slice(3);

    const steps = view.decision.log.map((l) => plainLog(l, view));

    if (view.state.sensitiveMoment) {
        steps.splice(
            1,
            0,
            'Because this is a difficult time, offers from other companies are off.',
        );
    }

    if (prefs.pauseOffers) {
        steps.splice(
            1,
            0,
            'You paused all offers, so only help and safety suggestions remain.',
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <SectionHeader
                    eyebrow="Suggested for you"
                    aside="These are the ones in your app"
                />
                <Legend care={care} />
                <div className="mt-3 space-y-2.5">
                    {top.length === 0 && (
                        <EmptyNote>
                            No suggestions right now. We'll let you know when
                            something matters.
                        </EmptyNote>
                    )}
                    {top.map((r, i) => (
                        <SuggestionCard
                            key={r.rec.id}
                            ranked={r}
                            position={i + 1}
                            view={view}
                            isFresh={fresh.has(`r:${r.rec.id}`)}
                            moved={
                                prevRanks
                                    ? (prevRanks[r.rec.id] ?? 99) - r.rank
                                    : 0
                            }
                        />
                    ))}
                </div>
                {rest.length > 0 && (
                    <div className="mt-3">
                        <div className="mb-1.5 text-[12px] font-medium text-ink-3">
                            Also considered, but less useful now
                        </div>
                        <Card className="divide-y divide-line/70">
                            {rest.map((r) => (
                                <div
                                    key={r.rec.id}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-2.5',
                                        freshClass(fresh.has(`r:${r.rec.id}`)),
                                    )}
                                >
                                    <KindChip kind={r.rec.kind} />
                                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">
                                        {r.rec.title}
                                    </span>
                                    <Breakdown
                                        rec={r.rec}
                                        score={r.score}
                                        care={care}
                                        className="w-40"
                                    />
                                </div>
                            ))}
                        </Card>
                    </div>
                )}
            </div>

            <div>
                <SectionHeader
                    eyebrow="Offers we're holding back"
                    aside={
                        held.length
                            ? `${held.length} not shown to you`
                            : undefined
                    }
                />
                {held.length === 0 ? (
                    <EmptyNote>
                        Nothing held back. Every suggestion passed our checks
                        for you.
                    </EmptyNote>
                ) : (
                    <Card className="overflow-hidden border-k-human/20">
                        <div className="flex items-start gap-2.5 bg-k-human/[0.045] px-4 py-3 text-[12.5px] leading-snug text-ink-2">
                            <PauseCircle className="mt-0.5 size-4 shrink-0 text-k-human" />
                            <span>
                                <b className="font-semibold text-ink">
                                    We could have shown you these. We chose not
                                    to.
                                </b>{' '}
                                Here's why, in plain words.
                            </span>
                        </div>
                        <div className="divide-y divide-line/70">
                            {held.map((h) => (
                                <div
                                    key={h.rec.id}
                                    className={cn(
                                        'flex items-start gap-3 px-4 py-3',
                                        freshClass(fresh.has(`x:${h.rec.id}`)),
                                    )}
                                >
                                    <KindChip
                                        kind={h.rec.kind}
                                        className="mt-0.5 opacity-60"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-[13px] font-medium text-ink-3 line-through decoration-ink-3/70">
                                                {h.rec.title}
                                            </span>
                                            <NewTag
                                                show={fresh.has(
                                                    `x:${h.rec.id}`,
                                                )}
                                            />
                                        </div>
                                        <div className="mt-0.5 text-[12.5px] leading-snug text-ink">
                                            {h.reason}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            <div>
                <SectionHeader eyebrow="How we decided" />
                <Card className="px-4 py-3.5">
                    <ol className="relative space-y-2.5">
                        <span className="absolute top-2 bottom-2 left-[9px] w-px bg-line" />
                        {steps.map((s, i) => (
                            <li
                                key={`${i}-${s}`}
                                className="relative flex items-start gap-3 text-[12.5px] leading-snug text-ink-2"
                            >
                                <span className="relative z-10 flex size-[19px] shrink-0 items-center justify-center rounded-full border border-line bg-white text-[10px] font-semibold text-ink-3 tabular-nums">
                                    {i + 1}
                                </span>
                                <span
                                    className={cn(
                                        'pt-px',
                                        i === steps.length - 1 &&
                                            'font-medium text-ink',
                                    )}
                                >
                                    {s}
                                </span>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-3.5 flex items-center gap-2 border-t border-line/70 pt-3 text-[12px] text-ink-3">
                        <Sparkles className="size-3.5 text-kbc-sky" />
                        Fixed, checkable rules made these choices. AI only
                        helped write the words.
                    </div>
                </Card>
            </div>
        </div>
    );
}

function Legend({ care }: { care: string }) {
    return (
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11.5px] text-ink-2">
            {PARTS.map((p) => (
                <span key={p.key} className="flex items-center gap-1.5">
                    <span className={cn('size-2 rounded-sm', p.color)} />
                    {p.label}
                </span>
            ))}
            <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm" style={stripes(care)} />
                Extra care
            </span>
            <span className="ml-auto rounded-full bg-k-nosale/10 px-2 py-0.5 font-medium text-k-nosale">
                What's good for you counts {RATIO}× more than what's good for
                KBC
            </span>
        </div>
    );
}

function Breakdown({
    rec,
    score,
    care,
    className,
}: {
    rec: Recommendation;
    score: number;
    care: string;
    className?: string;
}) {
    const boost = Math.max(0, score - baseScore(rec));

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-mist">
                {PARTS.map((p) => (
                    <div
                        key={p.key}
                        className={cn(
                            'h-full transition-[width] duration-700',
                            p.color,
                        )}
                        style={{
                            width: `${rec.scores[p.key] * WEIGHTS[p.key]}%`,
                        }}
                        title={`${p.label}: ${rec.scores[p.key]}/100`}
                    />
                ))}
                {boost > 0 && (
                    <div
                        className="h-full"
                        style={{ ...stripes(care), width: `${boost}%` }}
                        title={`Extra care: +${boost}`}
                    />
                )}
            </div>
        </div>
    );
}

function SuggestionCard({
    ranked,
    position,
    view,
    isFresh,
    moved,
}: {
    ranked: RankedRecommendation;
    position: number;
    view: PersonaView;
    isFresh: boolean;
    moved: number;
}) {
    const { rec, score } = ranked;
    const moment = view.moments.find((m) => m.id === rec.momentId);
    const h = honesty(rec);
    const HIcon = h.icon;
    const boost = Math.max(0, score - baseScore(rec));
    const reasons = PARTS.filter((p) => p.reason && rec.scores[p.key] >= 65)
        .sort((a, b) => rec.scores[b.key] - rec.scores[a.key])
        .map((p): string => p.reason);

    if (boost > 0) {
        reasons.unshift(
            view.state.financialStress
                ? 'A person first, while money is tight'
                : 'Your safety comes first',
        );
    }

    if (!reasons.length) {
        reasons.push('Fits your situation');
    }

    return (
        <Card
            className={cn(
                'px-4 py-3.5',
                position === 1 && 'border-kbc-navy/30',
                freshClass(isFresh),
            )}
        >
            <div className="flex items-start gap-3">
                <span
                    className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums',
                        position === 1
                            ? 'bg-kbc-navy text-white'
                            : 'bg-mist text-ink-2',
                    )}
                >
                    {position}
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <KindChip kind={rec.kind} />
                        {position === 1 && (
                            <span className="text-[11.5px] font-semibold text-kbc-navy">
                                Our top suggestion
                            </span>
                        )}
                        <NewTag show={isFresh} />
                        {moved > 0 && moved < 90 && (
                            <span className="flex animate-in items-center gap-0.5 text-[11px] font-medium text-kbc-sky fade-in">
                                <ArrowUp className="size-3" strokeWidth={2.5} />
                                moved up
                            </span>
                        )}
                        <span
                            className={cn(
                                'ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                                h.cls,
                            )}
                        >
                            <HIcon className="size-3" />
                            {h.label}
                        </span>
                    </div>
                    <div className="mt-1.5 text-[14px] leading-snug font-semibold tracking-tight text-ink">
                        {rec.title}
                    </div>
                    <div className="mt-0.5 text-[12.5px] leading-snug text-ink-2">
                        {rec.body}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {reasons.map((r) => (
                            <span
                                key={r}
                                className="rounded-md border border-line bg-white px-1.5 py-0.5 text-[11.5px] text-ink-2"
                            >
                                ✓ {r}
                            </span>
                        ))}
                        {rec.valueToCustomer && (
                            <span className="rounded-md bg-k-nosale/8 px-1.5 py-0.5 text-[11.5px] font-medium text-k-nosale">
                                {rec.valueToCustomer}
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                        <Breakdown
                            rec={rec}
                            score={score}
                            care={
                                view.state.vulnerable ? 'k-protect' : 'k-human'
                            }
                            className="flex-1"
                        />
                        {moment && (
                            <span className="max-w-[45%] truncate text-[11.5px] text-ink-3">
                                For: {moment.title}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
