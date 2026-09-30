import {
    Ban,
    Check,
    Download,
    Eraser,
    FileSearch,
    HandMetal,
    MessageSquareX,
    PauseCircle,
    PenLine,
    Server,
    Share2,
    ShieldCheck,
    Timer,
} from 'lucide-react';
import { useState } from 'react';
import type { PersonaView, SignalSource } from '../../types';
import { SOURCE_STYLE } from '../../ui';
import type { Fresh, Prefs, SetPrefs } from './shared';
import { Card, SOURCE_COPY, SectionHeader, Toggle } from './shared';
import { cn } from '@/lib/utils';

const SOURCES: SignalSource[] = [
    'transactions',
    'app_behaviour',
    'products',
    'life_event',
    'kate',
    'external',
];

const NEVER = [
    'Health data',
    'Your contacts',
    'Location history',
    'Social media',
    'Messages outside Kate',
];

const RIGHTS = [
    {
        icon: FileSearch,
        title: 'See it all',
        body: 'Everything on this screen, and a full copy on request.',
    },
    { icon: PenLine, title: 'Correct it', body: 'Tap "Not me" and we fix it.' },
    {
        icon: HandMetal,
        title: 'Say no',
        body: 'Stop personal suggestions at any time.',
    },
    {
        icon: Eraser,
        title: 'Delete it',
        body: 'We erase what we learned, not your bank records.',
    },
    {
        icon: Share2,
        title: 'Take it with you',
        body: 'Download it in a readable format.',
    },
];

export function DataTab({
    view,
    fresh,
    prefs,
    setPrefs,
}: {
    view: PersonaView;
    fresh: Fresh;
    prefs: Prefs;
    setPrefs: SetPrefs;
}) {
    const [downloaded, setDownloaded] = useState(false);

    const promises = [
        {
            id: 'st:stress',
            title: 'When money is tight, we stop selling',
            body: 'No offers at all, and a person is ready to help.',
            active: view.state.financialStress,
        },
        {
            id: 'st:vulnerable',
            title: 'Extra care when you might be at risk',
            body: 'Safety first, and no offers from other companies.',
            active: view.state.vulnerable,
        },
        {
            id: `st:sensitive:${view.state.sensitiveMoment ?? ''}`,
            title: 'Gentle in difficult moments',
            body: 'No offers from other companies while life is hard.',
            active: Boolean(view.state.sensitiveMoment),
        },
        {
            id: 'always-1',
            title: 'Always one suggestion that sells nothing',
            body: 'Just help, every time.',
            active: true,
        },
        {
            id: 'always-2',
            title: 'Rules decide, not AI',
            body: 'AI only writes the words. A person can always review.',
            active: true,
        },
    ];

    const dismissed = view.dismissedIds
        .map(
            (id) =>
                view.recommendations.find((r) => r.id === id) ??
                view.decision.suppressed.find((s) => s.rec.id === id)?.rec,
        )
        .filter((r) => r !== undefined);
    const notMe = view.signals.filter((s) => prefs.notMe.includes(s.id));

    const download = () => {
        const data = {
            about: `What KBC understands about ${view.name}`,
            generated: new Date().toISOString(),
            whatWeNoticed: view.signals.map((s) => ({
                what: s.label,
                detail: s.detail,
                from: SOURCE_COPY[s.source].label,
                when: s.observedAt,
                yourAnswer: prefs.notMe.includes(s.id)
                    ? 'not me'
                    : prefs.confirmed.includes(s.id)
                      ? 'correct'
                      : null,
            })),
            whatWeThinkIsComing: view.moments.map((m) => ({
                moment: m.title,
                horizon: m.horizon,
                confidence: m.confidence,
            })),
            suggestions: view.decision.ranked.map((r) => ({
                title: r.rec.title,
                kind: r.rec.kind,
            })),
            heldBack: view.decision.suppressed.map((s) => ({
                title: s.rec.title,
                reason: s.reason,
            })),
            yourSettings: prefs,
        };
        const url = URL.createObjectURL(
            new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            }),
        );
        const a = document.createElement('a');
        a.href = url;
        a.download = `kbc-what-we-know-${view.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
    };

    return (
        <div className="space-y-6">
            <Card
                className={cn(
                    'flex items-center gap-3.5 px-4 py-3.5 transition-colors',
                    prefs.pauseOffers &&
                        'border-kbc-navy/30 bg-kbc-navy/[0.03]',
                )}
            >
                <span className="bg-kbc-navy/8 text-kbc-navy flex size-9 items-center justify-center rounded-xl">
                    <PauseCircle className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-ink">
                        Pause all offers
                    </div>
                    <div className="text-ink-2 text-[12.5px]">
                        {prefs.pauseOffers
                            ? 'Paused. You still get help, safety alerts and a person when you need one.'
                            : 'No products, no partner deals. Help and safety alerts stay on.'}
                    </div>
                </div>
                <Toggle
                    label="Pause all offers"
                    on={prefs.pauseOffers}
                    onChange={(on) =>
                        setPrefs((p) => ({ ...p, pauseOffers: on }))
                    }
                />
            </Card>

            <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-start gap-4">
                <div>
                    <SectionHeader
                        eyebrow="What we use"
                        aside="Turn any of it off"
                    />
                    <Card className="divide-line/70 divide-y">
                        {SOURCES.map((source) => {
                            const Icon = SOURCE_STYLE[source].icon;
                            const used = view.signals.filter(
                                (s) => s.source === source,
                            ).length;
                            const on = prefs.sources[source];

                            return (
                                <div
                                    key={source}
                                    className="flex items-center gap-3 px-4 py-2.5"
                                >
                                    <span
                                        className={cn(
                                            'flex size-7 shrink-0 items-center justify-center rounded-lg',
                                            on
                                                ? 'bg-mist text-ink-2'
                                                : 'bg-mist/50 text-ink-3',
                                        )}
                                    >
                                        <Icon className="size-3.5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className={cn(
                                                    'text-[13px] font-medium',
                                                    on
                                                        ? 'text-ink'
                                                        : 'text-ink-3',
                                                )}
                                            >
                                                {SOURCE_COPY[source].label}
                                            </span>
                                            <span className="text-ink-3 text-[11px] tabular-nums">
                                                {used
                                                    ? `${used} thing${used === 1 ? '' : 's'} noticed`
                                                    : 'not used for you'}
                                            </span>
                                        </div>
                                        <div className="text-ink-3 truncate text-[11.5px]">
                                            {SOURCE_COPY[source].explain}
                                        </div>
                                    </div>
                                    <Toggle
                                        label={SOURCE_COPY[source].label}
                                        on={on}
                                        onChange={(v) =>
                                            setPrefs((p) => ({
                                                ...p,
                                                sources: {
                                                    ...p.sources,
                                                    [source]: v,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                            );
                        })}
                    </Card>
                </div>

                <div className="space-y-4">
                    <div>
                        <SectionHeader eyebrow="What we never use" />
                        <Card className="px-4 py-3">
                            <ul className="space-y-1.5">
                                {NEVER.map((n) => (
                                    <li
                                        key={n}
                                        className="text-ink-2 flex items-center gap-2 text-[12.5px]"
                                    >
                                        <Ban className="text-ink-3 size-3.5" />
                                        {n}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                    <div>
                        <SectionHeader eyebrow="Where it lives" />
                        <Card className="text-ink-2 space-y-2 px-4 py-3 text-[12.5px]">
                            <div className="flex items-center gap-2">
                                <Server className="text-ink-3 size-3.5" /> On
                                KBC's own servers, in the EU
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer className="text-ink-3 size-3.5" /> Kept
                                for 13 months at most
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-ink-3 size-3.5" />{' '}
                                Never sold, never shared for ads
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <div>
                <SectionHeader eyebrow="Promises we keep" />
                <Card className="divide-line/70 divide-y">
                    {promises.map((p) => (
                        <div
                            key={p.id}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2.5',
                                fresh.has(p.id) &&
                                    'bg-kbc-sky/[0.07] animate-in fade-in',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-5 shrink-0 items-center justify-center rounded-full',
                                    p.active
                                        ? 'bg-k-nosale text-white'
                                        : 'border-line border text-transparent',
                                )}
                            >
                                <Check className="size-3" strokeWidth={3} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-[13px] font-medium text-ink">
                                    {p.title}
                                </div>
                                <div className="text-ink-3 text-[11.5px]">
                                    {p.body}
                                </div>
                            </div>
                            <span
                                className={cn(
                                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                                    p.id.startsWith('always')
                                        ? 'bg-mist text-ink-2'
                                        : p.active
                                          ? 'bg-k-nosale/10 text-k-nosale'
                                          : 'text-ink-3',
                                )}
                            >
                                {p.id.startsWith('always')
                                    ? 'Always'
                                    : p.active
                                      ? 'Active for you now'
                                      : 'Ready if needed'}
                            </span>
                        </div>
                    ))}
                </Card>
            </div>

            <div>
                <SectionHeader eyebrow="What you told us" />
                {dismissed.length === 0 && notMe.length === 0 ? (
                    <div className="border-line text-ink-2 flex items-start gap-2.5 rounded-2xl border border-dashed px-4 py-3.5 text-[12.5px]">
                        <MessageSquareX className="text-ink-3 mt-0.5 size-4 shrink-0" />
                        <span>
                            Nothing yet. Tap{' '}
                            <b className="font-medium text-ink">
                                "Not relevant"
                            </b>{' '}
                            on any card in the app, or{' '}
                            <b className="font-medium text-ink">"Not me"</b> on
                            something we noticed. We learn from it right away.
                        </span>
                    </div>
                ) : (
                    <Card className="divide-line/70 divide-y">
                        {dismissed.map((r) => (
                            <div
                                key={r.id}
                                className="animate-in px-4 py-2.5 fade-in"
                            >
                                <div className="text-[13px] text-ink">
                                    You said{' '}
                                    <span className="font-medium">
                                        “{r.title}”
                                    </span>{' '}
                                    wasn't relevant.
                                </div>
                                <div className="text-ink-3 text-[11.5px]">
                                    Removed. You'll see fewer suggestions like
                                    this, and so will 1,240 people in a similar
                                    spot.
                                </div>
                            </div>
                        ))}
                        {notMe.map((s) => (
                            <div
                                key={s.id}
                                className="animate-in px-4 py-2.5 fade-in"
                            >
                                <div className="text-[13px] text-ink">
                                    You said{' '}
                                    <span className="font-medium">
                                        “{s.label}”
                                    </span>{' '}
                                    wasn't you.
                                </div>
                                <div className="text-ink-3 text-[11.5px]">
                                    We've stopped using it for your suggestions.
                                </div>
                            </div>
                        ))}
                    </Card>
                )}
            </div>

            <div>
                <SectionHeader
                    eyebrow="Your rights, in plain words"
                    aside="Under European privacy law (GDPR)"
                />
                <div className="grid grid-cols-5 gap-2">
                    {RIGHTS.map((r) => {
                        const Icon = r.icon;

                        return (
                            <div
                                key={r.title}
                                className="border-line rounded-2xl border bg-white px-3 py-3"
                            >
                                <Icon className="text-kbc-navy size-4" />
                                <div className="mt-2 text-[12.5px] font-semibold text-ink">
                                    {r.title}
                                </div>
                                <div className="text-ink-3 mt-0.5 text-[11.5px] leading-snug">
                                    {r.body}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={download}
                    className="bg-kbc-navy hover:bg-kbc-navy-2 mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition-colors"
                >
                    {downloaded ? (
                        <Check className="size-4" />
                    ) : (
                        <Download className="size-4" />
                    )}
                    {downloaded
                        ? 'Downloaded. This is everything we used.'
                        : 'Download what KBC knows about me'}
                </button>
            </div>
        </div>
    );
}
