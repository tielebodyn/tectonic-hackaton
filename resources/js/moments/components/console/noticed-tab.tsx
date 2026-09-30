import { Check, Clock, EyeOff, Users, X } from 'lucide-react';
import { useState } from 'react';
import { compact, euro } from '../../engine';
import type { Moment, PersonaView, Signal, SignalSource } from '../../types';
import { SOURCE_STYLE } from '../../ui';
import type { Fresh, Prefs, SetPrefs } from './shared';
import {
    Card,
    EmptyNote,
    NewTag,
    SOURCE_COPY,
    SectionHeader,
    freshClass,
    sureness,
} from './shared';
import { cn } from '@/lib/utils';

const SOURCE_ORDER: SignalSource[] = [
    'transactions',
    'app_behaviour',
    'kate',
    'life_event',
    'products',
    'external',
];

export function NoticedTab({
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
    const [pinned, setPinned] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);

    const moments = [...view.moments].sort(
        (a, b) => b.confidence - a.confidence,
    );
    const freshMoment = moments.find((m) => fresh.has(`m:${m.id}`))?.id;
    const activeId =
        hovered ??
        freshMoment ??
        (pinned && moments.some((m) => m.id === pinned) ? pinned : null) ??
        moments[0]?.id ??
        null;
    const active = moments.find((m) => m.id === activeId) ?? null;
    const linked = new Set(active?.signalIds ?? []);

    const groups = SOURCE_ORDER.map((source) => ({
        source,
        signals: view.signals.filter((s) => s.source === source),
    })).filter((g) => g.signals.length > 0);

    return (
        <div className="space-y-4">
            <p className="text-[13px] leading-relaxed text-ink-2">
                We noticed{' '}
                <b className="font-semibold text-ink">
                    {view.signals.length} things
                </b>{' '}
                in your banking. Together they point to{' '}
                <b className="font-semibold text-ink">
                    {view.moments.length} moments
                </b>{' '}
                coming up for you. Tap a moment to see what it's based on.
            </p>

            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start gap-5">
                <div>
                    <SectionHeader eyebrow="What's coming up" />
                    <div className="space-y-2.5">
                        {moments.length === 0 && (
                            <EmptyNote>
                                Nothing coming up that needs your attention.
                            </EmptyNote>
                        )}
                        {moments.map((m) => (
                            <MomentCard
                                key={m.id}
                                moment={m}
                                signals={view.signals}
                                active={m.id === activeId}
                                isFresh={fresh.has(`m:${m.id}`)}
                                onSelect={() => setPinned(m.id)}
                                onHover={(on) => setHovered(on ? m.id : null)}
                            />
                        ))}
                    </div>

                    <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-white/60 px-3.5 py-3 text-[12px] leading-snug text-ink-2 ring-1 ring-line">
                        <Users className="mt-0.5 size-3.5 shrink-0 text-kbc-sky" />
                        <div>
                            <span className="font-semibold text-ink">
                                You're not alone.
                            </span>{' '}
                            <span className="tabular-nums">
                                {compact(view.cohort.size)}
                            </span>{' '}
                            KBC customers are going through something similar
                            right now.
                        </div>
                    </div>
                </div>

                <div>
                    <SectionHeader
                        eyebrow="Because we noticed"
                        aside={
                            active
                                ? `${linked.size} of ${view.signals.length} used for this moment`
                                : undefined
                        }
                    />
                    <div className="space-y-3">
                        {groups.length === 0 && (
                            <EmptyNote>
                                We haven't noticed anything yet.
                            </EmptyNote>
                        )}
                        {groups.map((g) => {
                            const Icon = SOURCE_STYLE[g.source].icon;
                            const off = !prefs.sources[g.source];

                            return (
                                <Card
                                    key={g.source}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-2 border-b border-line/70 px-3.5 py-2">
                                        <Icon className="size-3.5 text-ink-3" />
                                        <span className="text-[12px] font-semibold text-ink">
                                            {SOURCE_COPY[g.source].label}
                                        </span>
                                        {off && (
                                            <span className="ml-auto flex items-center gap-1 text-[11px] text-ink-3">
                                                <EyeOff className="size-3" />
                                                You turned this off
                                            </span>
                                        )}
                                    </div>
                                    <div className="divide-y divide-line/70">
                                        {g.signals.map((s) => (
                                            <SignalRow
                                                key={s.id}
                                                signal={s}
                                                off={off}
                                                dim={
                                                    active !== null &&
                                                    !linked.has(s.id)
                                                }
                                                highlight={linked.has(s.id)}
                                                isFresh={fresh.has(`s:${s.id}`)}
                                                prefs={prefs}
                                                setPrefs={setPrefs}
                                            />
                                        ))}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MomentCard({
    moment,
    signals,
    active,
    isFresh,
    onSelect,
    onHover,
}: {
    moment: Moment;
    signals: Signal[];
    active: boolean;
    isFresh: boolean;
    onSelect: () => void;
    onHover: (on: boolean) => void;
}) {
    const basis = signals.filter((s) => moment.signalIds.includes(s.id));

    return (
        <button
            onClick={onSelect}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            className={cn(
                'block w-full rounded-2xl border bg-white px-4 py-3.5 text-left transition-all',
                active
                    ? 'border-kbc-navy/40 shadow-[0_2px_10px_rgba(0,54,101,0.08)]'
                    : 'border-line hover:border-kbc-navy/25',
                freshClass(isFresh),
            )}
        >
            <div className="flex items-center gap-2 text-[11.5px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 font-medium text-ink-2">
                    <Clock className="size-3" />
                    {moment.horizon}
                </span>
                <span className="font-medium text-kbc-navy">
                    {sureness(moment.confidence)}
                </span>
                <NewTag show={isFresh} />
                <span className="ml-auto flex items-center gap-1.5 text-ink-3 tabular-nums">
                    <span className="flex h-3 items-end gap-[2px]">
                        {[20, 40, 60, 80, 95].map((t, i) => (
                            <span
                                key={t}
                                className={cn(
                                    'w-[3px] rounded-sm',
                                    moment.confidence >= t
                                        ? 'bg-kbc-sky'
                                        : 'bg-line',
                                )}
                                style={{ height: `${40 + i * 15}%` }}
                            />
                        ))}
                    </span>
                    {moment.confidence}%
                </span>
            </div>
            <div className="mt-2 text-[14px] leading-snug font-semibold tracking-tight text-ink">
                {moment.title}
            </div>
            <div className="mt-1 text-[12.5px] leading-snug text-ink-2">
                {moment.narrative}
            </div>

            {moment.impactCents !== undefined && moment.impactCents !== 0 && (
                <div
                    className={cn(
                        'mt-2.5 inline-flex rounded-md px-1.5 py-0.5 text-[12px] font-semibold tabular-nums',
                        moment.impactCents > 0
                            ? 'bg-k-nosale/8 text-k-nosale'
                            : 'bg-k-human/8 text-k-human',
                    )}
                >
                    {moment.impactCents > 0
                        ? `Worth ${euro(moment.impactCents)} to you`
                        : `Could cost you ${euro(Math.abs(moment.impactCents))}`}
                </div>
            )}

            {active && basis.length > 0 && (
                <div className="mt-3 animate-in border-t border-line/70 pt-2.5 fade-in">
                    <div className="text-[11px] font-medium text-ink-3">
                        Based on
                    </div>
                    <ul className="mt-1 space-y-0.5">
                        {basis.map((s) => (
                            <li
                                key={s.id}
                                className="flex items-center gap-1.5 text-[12px] text-ink-2"
                            >
                                <span className="size-1 shrink-0 rounded-full bg-kbc-sky" />
                                <span className="truncate">{s.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </button>
    );
}

function Strength({ value }: { value: number }) {
    const level = value >= 0.75 ? 3 : value >= 0.45 ? 2 : 1;
    const word = ['', 'Weak hint', 'Clear hint', 'Strong hint'][level];

    return (
        <span className="flex items-center gap-1" title={word}>
            {[1, 2, 3].map((i) => (
                <span
                    key={i}
                    className={cn(
                        'size-1.5 rounded-full',
                        i <= level ? 'bg-kbc-navy' : 'bg-line',
                    )}
                />
            ))}
        </span>
    );
}

function SignalRow({
    signal,
    off,
    dim,
    highlight,
    isFresh,
    prefs,
    setPrefs,
}: {
    signal: Signal;
    off: boolean;
    dim: boolean;
    highlight: boolean;
    isFresh: boolean;
    prefs: Prefs;
    setPrefs: SetPrefs;
}) {
    const notMe = prefs.notMe.includes(signal.id);
    const confirmed = prefs.confirmed.includes(signal.id);

    const answer = (kind: 'confirmed' | 'notMe') =>
        setPrefs((p) => ({
            ...p,
            confirmed:
                kind === 'confirmed'
                    ? [...p.confirmed, signal.id]
                    : p.confirmed.filter((id) => id !== signal.id),
            notMe:
                kind === 'notMe'
                    ? [...p.notMe, signal.id]
                    : p.notMe.filter((id) => id !== signal.id),
        }));

    const undo = () =>
        setPrefs((p) => ({
            ...p,
            confirmed: p.confirmed.filter((id) => id !== signal.id),
            notMe: p.notMe.filter((id) => id !== signal.id),
        }));

    return (
        <div
            className={cn(
                'relative px-3.5 py-2.5 transition-opacity duration-300',
                dim && 'opacity-40',
                highlight && !isFresh && 'bg-kbc-sky/[0.045]',
                freshClass(isFresh),
            )}
        >
            {highlight && (
                <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-kbc-sky" />
            )}
            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        'text-[13px] leading-snug font-medium text-ink',
                        (notMe || off) &&
                            'text-ink-3 line-through decoration-ink-3/60',
                    )}
                >
                    {signal.label}
                </span>
                <NewTag show={isFresh} />
            </div>
            <div className="mt-0.5 text-[12px] leading-snug text-ink-3">
                {signal.detail}
            </div>
            <div className="mt-1.5 flex min-h-[20px] items-center gap-2 text-[11px] text-ink-3">
                <Strength value={signal.strength} />
                <span>{signal.observedAt}</span>
                <div className="ml-auto flex items-center gap-1">
                    {notMe ? (
                        <>
                            <span>We won't use this.</span>
                            <button
                                onClick={undo}
                                className="font-medium text-kbc-navy hover:underline"
                            >
                                Undo
                            </button>
                        </>
                    ) : confirmed ? (
                        <button
                            onClick={undo}
                            className="flex items-center gap-1 font-medium text-k-nosale"
                        >
                            <Check className="size-3" strokeWidth={3} />
                            Thanks for confirming
                        </button>
                    ) : (
                        !off && (
                            <>
                                <span className="mr-0.5">Is this right?</span>
                                <button
                                    onClick={() => answer('confirmed')}
                                    className="rounded-md border border-line bg-white px-1.5 py-px font-medium text-ink-2 hover:border-k-nosale/50 hover:text-k-nosale"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => answer('notMe')}
                                    className="flex items-center gap-0.5 rounded-md border border-line bg-white px-1.5 py-px font-medium text-ink-2 hover:border-k-human/50 hover:text-k-human"
                                >
                                    <X className="size-2.5" strokeWidth={3} />
                                    Not me
                                </button>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
