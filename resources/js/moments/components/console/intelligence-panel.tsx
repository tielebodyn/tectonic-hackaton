import {
    AlertTriangle,
    BellRing,
    CheckCircle2,
    Eye,
    HeartHandshake,
    Lightbulb,
    RotateCcw,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { euro } from '../../engine';
import type { PersonaView } from '../../types';
import { Avatar } from '../../ui';
import { ChannelsTab } from './channels-tab';
import { DataTab } from './data-tab';
import { NoticedTab } from './noticed-tab';
import type { Fresh, Prefs } from './shared';
import { DEFAULT_PREFS, collectIds } from './shared';
import { WhyTab } from './why-tab';
import { cn } from '@/lib/utils';

const TABS = [
    {
        id: 'noticed',
        label: 'What we noticed',
        icon: Eye,
        prefixes: ['s:', 'm:'],
        aliases: ['understand'],
    },
    {
        id: 'why',
        label: 'Why this suggestion',
        icon: Lightbulb,
        prefixes: ['r:', 'x:'],
        aliases: ['decide'],
    },
    {
        id: 'channels',
        label: "Where you'll hear from us",
        icon: BellRing,
        prefixes: ['push:'],
        aliases: ['orchestrate'],
    },
    {
        id: 'data',
        label: 'Your data & controls',
        icon: SlidersHorizontal,
        prefixes: ['st:'],
        aliases: ['trust'],
    },
] as const;

type TabId = (typeof TABS)[number]['id'];

const params =
    typeof window === 'undefined'
        ? new URLSearchParams()
        : new URLSearchParams(window.location.search);
const tabParam = params.get('tab') ?? '';
const INITIAL_TAB: TabId =
    TABS.find(
        (t) =>
            t.id === tabParam ||
            (t.aliases as readonly string[]).includes(tabParam),
    )?.id ?? 'noticed';

type Track = {
    key: string;
    ids: Set<string>;
    ranks: Record<string, number>;
    prevRanks: Record<string, number> | null;
    fresh: Fresh;
    summary: string[];
};

function ranksOf(view: PersonaView): Record<string, number> {
    return Object.fromEntries(
        view.decision.ranked.map((r) => [r.rec.id, r.rank]),
    );
}

function keyOf(view: PersonaView): string {
    return `${view.firedEventIds.join(',')}|${view.dismissedIds.join(',')}`;
}

export function IntelligencePanel({
    view,
    onFire,
    onReset,
}: {
    view: PersonaView;
    onFire: (eventId: string) => void;
    onReset: () => void;
}) {
    const [tab, setTab] = useState<TabId>(INITIAL_TAB);
    const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
    const [track, setTrack] = useState<Track>(() => ({
        key: keyOf(view),
        ids: collectIds(view),
        ranks: ranksOf(view),
        prevRanks: null,
        fresh: new Set(),
        summary: [],
    }));

    // Diff against the previous view so a live event visibly ripples through every tab.
    const key = keyOf(view);

    if (track.key !== key) {
        const ids = collectIds(view);
        const fresh = new Set([...ids].filter((id) => !track.ids.has(id)));
        const count = (prefix: string) =>
            [...fresh].filter((id) => id.startsWith(prefix)).length;
        const noticed = count('s:');
        const moments = count('m:');
        const held = count('x:');
        const grew =
            view.firedEventIds.length + view.dismissedIds.length >
            track.key.split(/[|,]/).filter(Boolean).length;
        const summary = [
            noticed &&
                `${noticed} new thing${noticed === 1 ? '' : 's'} noticed`,
            moments && `${moments} new moment${moments === 1 ? '' : 's'} ahead`,
            'suggestions updated',
            held && `${held} offer${held === 1 ? '' : 's'} held back`,
        ].filter((s): s is string => Boolean(s));

        setTrack({
            key,
            ids,
            ranks: ranksOf(view),
            prevRanks: track.ranks,
            fresh,
            summary: grew ? summary : [],
        });

        if (!grew) {
            setPrefs(DEFAULT_PREFS);
        }
    }

    useEffect(() => {
        if (!track.fresh.size && !track.summary.length) {
            return;
        }

        const t = window.setTimeout(
            () =>
                setTrack((prev) => ({
                    ...prev,
                    fresh: new Set(),
                    prevRanks: null,
                    summary: [],
                })),
            5000,
        );

        return () => window.clearTimeout(t);
    }, [track.key]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex min-h-full flex-col bg-[#f7f9fb]">
            <DemoControls view={view} onFire={onFire} onReset={onReset} />

            <section className="bg-white px-6 pt-4 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-kbc-navy">
                        <Sparkles
                            className="size-3.5 text-kbc-sky"
                            strokeWidth={2.25}
                        />
                        What KBC understands about you
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
                        <span className="size-1.5 rounded-full bg-k-nosale" />
                        Updated just now
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-3.5">
                    <Avatar
                        initials={view.avatar.initials}
                        hue={view.avatar.hue}
                        size={46}
                    />
                    <div className="min-w-0">
                        <div className="text-[20px] leading-tight font-semibold tracking-tight text-ink">
                            Hi {view.firstName}.
                        </div>
                        <div className="mt-0.5 text-[13.5px] leading-snug text-ink-2">
                            {view.greeting}
                        </div>
                    </div>
                </div>

                <div className="mt-3.5 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                    <StateCard state={view.state} fresh={track.fresh} />
                    <MoneyCard view={view} />
                </div>
            </section>

            <nav className="sticky top-10 z-20 border-y border-line bg-white/95 px-6 py-2.5 backdrop-blur-md">
                <div className="grid grid-cols-4 gap-1 rounded-xl bg-mist p-1">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        const hot =
                            !active &&
                            [...track.fresh].some((id) =>
                                t.prefixes.some((p) => id.startsWith(p)),
                            );

                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={cn(
                                    'relative flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-all',
                                    active
                                        ? 'bg-white text-ink shadow-[0_1px_3px_rgba(16,24,40,0.1)]'
                                        : 'text-ink-2 hover:text-ink',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'size-3.5 shrink-0',
                                        active ? 'text-kbc-navy' : 'text-ink-3',
                                    )}
                                />
                                {t.label}
                                {hot && (
                                    <span className="absolute top-1 right-1 flex size-1.5">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-kbc-sky" />
                                        <span className="relative inline-flex size-1.5 rounded-full bg-kbc-sky" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {track.summary.length > 0 && (
                    <div className="mt-2 flex animate-in items-center gap-2 rounded-lg bg-kbc-sky/10 px-3 py-1.5 text-[12px] text-kbc-navy fade-in slide-in-from-top-1">
                        <span className="relative flex size-2 shrink-0">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-kbc-sky opacity-70" />
                            <span className="relative inline-flex size-2 rounded-full bg-kbc-sky" />
                        </span>
                        <span className="shrink-0 font-semibold">
                            Something changed, so we updated this for you.
                        </span>
                        <span className="truncate text-kbc-navy/70">
                            {track.summary.join(' · ')}
                        </span>
                    </div>
                )}
            </nav>

            <div className="flex-1 px-6 py-5">
                {tab === 'noticed' && (
                    <NoticedTab
                        view={view}
                        fresh={track.fresh}
                        prefs={prefs}
                        setPrefs={setPrefs}
                    />
                )}
                {tab === 'why' && (
                    <WhyTab
                        view={view}
                        fresh={track.fresh}
                        prevRanks={track.prevRanks}
                        prefs={prefs}
                    />
                )}
                {tab === 'channels' && (
                    <ChannelsTab
                        view={view}
                        prefs={prefs}
                        setPrefs={setPrefs}
                    />
                )}
                {tab === 'data' && (
                    <DataTab
                        view={view}
                        fresh={track.fresh}
                        prefs={prefs}
                        setPrefs={setPrefs}
                    />
                )}
            </div>

            <footer className="flex items-center gap-1.5 px-6 pb-5 text-[11.5px] text-ink-3">
                <ShieldCheck className="size-3.5" />
                Your data stays with KBC in the EU. We never sell it. You can
                change any of this, any time.
            </footer>
        </div>
    );
}

function StateCard({
    state,
    fresh,
}: {
    state: PersonaView['state'];
    fresh: Fresh;
}) {
    const lines: {
        id: string;
        icon: typeof Zap;
        title: string;
        body: string;
        tone: string;
    }[] = [];

    if (state.financialStress) {
        lines.push({
            id: 'st:stress',
            icon: AlertTriangle,
            title: 'Things look a bit tight right now',
            body: "So we've paused every offer. We'll only help you through the next weeks, and a person is ready if you want to talk.",
            tone: 'text-k-human',
        });
    }

    if (state.vulnerable) {
        lines.push({
            id: 'st:vulnerable',
            icon: ShieldCheck,
            title: "We're taking extra care of you",
            body: 'Unusual payments get an extra check, and you never see offers from other companies.',
            tone: 'text-k-protect',
        });
    }

    if (state.sensitiveMoment) {
        lines.push({
            id: `st:sensitive:${state.sensitiveMoment}`,
            icon: HeartHandshake,
            title: 'We know this is a difficult time',
            body: "We'll keep things simple and human. No offers from other companies for now.",
            tone: 'text-kbc-navy',
        });
    }

    if (!lines.length) {
        lines.push({
            id: 'st:stable',
            icon: CheckCircle2,
            title: 'Things look steady',
            body: "We'll only reach out when something really matters to you.",
            tone: 'text-k-nosale',
        });
    }

    return (
        <div className="flex flex-col justify-center space-y-2.5 rounded-2xl bg-mist/70 px-4 py-3">
            {lines.map((l) => {
                const Icon = l.icon;

                return (
                    <div
                        key={l.id}
                        className={cn(
                            'flex gap-2.5 rounded-lg',
                            fresh.has(l.id) &&
                                'animate-in duration-500 zoom-in-95 fade-in',
                        )}
                    >
                        <Icon
                            className={cn('mt-0.5 size-4 shrink-0', l.tone)}
                            strokeWidth={2.25}
                        />
                        <div className="min-w-0">
                            <div
                                className={cn(
                                    'text-[13px] font-semibold',
                                    l.tone,
                                )}
                            >
                                {l.title}
                                {fresh.has(l.id) && (
                                    <span className="ml-2 rounded bg-kbc-sky px-1 py-px align-middle text-[9px] font-bold tracking-[0.06em] text-white uppercase">
                                        New
                                    </span>
                                )}
                            </div>
                            <div className="mt-0.5 text-[12.5px] leading-snug text-ink-2">
                                {l.body}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function MoneyCard({ view }: { view: PersonaView }) {
    const left = view.monthly.incomeCents - view.monthly.spendCents;
    const rows = [
        {
            label: 'Coming in',
            value: euro(view.monthly.incomeCents),
            cls: 'text-ink',
        },
        {
            label: 'Going out',
            value: euro(view.monthly.spendCents),
            cls: 'text-ink',
        },
        {
            label: 'Left over',
            value: euro(left, { sign: true }),
            cls: left < 0 ? 'text-k-human' : 'text-k-nosale',
        },
    ];

    return (
        <div className="min-w-[180px] rounded-2xl border border-line px-4 py-2.5">
            <div className="text-[11.5px] font-medium text-ink-3">
                A usual month
            </div>
            <div className="mt-1 space-y-0.5">
                {rows.map((r) => (
                    <div
                        key={r.label}
                        className="flex items-baseline justify-between gap-4 text-[12.5px]"
                    >
                        <span className="text-ink-2">{r.label}</span>
                        <span
                            className={cn('font-semibold tabular-nums', r.cls)}
                        >
                            {r.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Presenter-only strip, deliberately styled apart from the product UI. */
function DemoControls({
    view,
    onFire,
    onReset,
}: {
    view: PersonaView;
    onFire: (eventId: string) => void;
    onReset: () => void;
}) {
    const dirty = view.firedEventIds.length > 0 || view.dismissedIds.length > 0;

    return (
        <div className="sticky top-0 z-30 flex h-10 items-center gap-2 bg-ink px-4 text-white">
            <span className="shrink-0 rounded border border-white/20 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-white/60 uppercase">
                Demo
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
                {view.events.length === 0 && (
                    <span className="text-[11.5px] text-white/40">
                        No live events for this customer
                    </span>
                )}
                {view.events.map((e) => {
                    const fired = view.firedEventIds.includes(e.id);

                    return (
                        <div key={e.id} className="group shrink-0">
                            <button
                                disabled={fired}
                                onClick={() => onFire(e.id)}
                                title={e.description}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium transition-colors',
                                    fired
                                        ? 'text-white/40'
                                        : 'bg-white/10 text-white hover:bg-kbc-sky/30 active:scale-[0.98]',
                                )}
                            >
                                {fired ? (
                                    <CheckCircle2
                                        className="size-3.5 text-k-nosale"
                                        strokeWidth={2.5}
                                    />
                                ) : (
                                    <Zap
                                        className="size-3.5 fill-kbc-sky text-kbc-sky"
                                        strokeWidth={2}
                                    />
                                )}
                                <span className="max-w-[240px] truncate">
                                    {e.label}
                                </span>
                                {fired && (
                                    <span className="font-mono text-[10px]">
                                        fired
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={onReset}
                disabled={!dirty}
                className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <RotateCcw className="size-3" />
                Reset
            </button>
        </div>
    );
}
