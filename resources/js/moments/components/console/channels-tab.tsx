import {
    BellOff,
    BellRing,
    Lock,
    MessageCircle,
    Moon,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import type { Channel, ChannelStep, PersonaView } from '../../types';
import { CHANNEL_STYLE, KindChip } from '../../ui';
import type { Prefs, SetPrefs } from './shared';
import { Card, EmptyNote, SectionHeader, Toggle } from './shared';
import { cn } from '@/lib/utils';

const CHANNEL_COPY: Record<Channel, { label: string; sub: string }> = {
    app: { label: 'KBC Mobile', sub: 'Always here when you open the app' },
    push: {
        label: 'Push notifications',
        sub: 'At most 1 a week, only when it matters',
    },
    kate: { label: 'Kate', sub: 'Our assistant can explain anything' },
    advisor: { label: 'An advisor', sub: 'A real person, only if you ask' },
    email: { label: 'Email', sub: 'A short summary, no newsletters' },
    branch: { label: 'Branch', sub: 'Book a visit if you prefer face to face' },
};

const TOGGLABLE: Channel[] = ['push', 'kate', 'advisor', 'email', 'branch'];

const iconFor = (c: Channel) =>
    c === 'push' ? BellRing : CHANNEL_STYLE[c].icon;

function inQuietHours(when: string): boolean {
    const m = when.match(/(\d{1,2}):(\d{2})/);

    if (!m) {
        return false;
    }

    const h = Number(m[1]);

    return h >= 21 || h < 8;
}

function phrase(step: ChannelStep): string {
    const label =
        step.channel === 'app'
            ? 'the app'
            : step.channel === 'push'
              ? 'a push'
              : CHANNEL_COPY[step.channel].label;
    const when = /^(If|When|After|Once|In|On|At|Only|Every)\b/.test(step.when)
        ? step.when[0].toLowerCase() + step.when.slice(1)
        : step.when;

    return `${label} ${when.toLowerCase() === 'now' ? 'today' : when}`;
}

export function ChannelsTab({
    view,
    prefs,
    setPrefs,
}: {
    view: PersonaView;
    prefs: Prefs;
    setPrefs: SetPrefs;
}) {
    const top = view.decision.ranked.slice(0, 3);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = top.find((r) => r.rec.id === selectedId) ?? top[0];
    const steps = selected?.rec.channels ?? [];
    const sentence = steps.map(phrase).join(', then ');

    return (
        <div className="space-y-6">
            <div>
                <SectionHeader
                    eyebrow="The plan"
                    aside="One conversation, wherever you are"
                />
                {top.length > 1 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {top.map((r) => (
                            <button
                                key={r.rec.id}
                                onClick={() => setSelectedId(r.rec.id)}
                                className={cn(
                                    'max-w-[240px] truncate rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                                    r.rec.id === selected?.rec.id
                                        ? 'border-kbc-navy bg-kbc-navy text-white'
                                        : 'border-line bg-white text-ink-2 hover:border-kbc-navy/30',
                                )}
                            >
                                {r.rec.title}
                            </button>
                        ))}
                    </div>
                )}

                {!selected ? (
                    <EmptyNote>
                        Nothing planned. We won't contact you unless something
                        matters.
                    </EmptyNote>
                ) : (
                    <Card className="px-4 py-4">
                        <div className="flex items-center gap-2">
                            <KindChip kind={selected.rec.kind} />
                            <span className="truncate text-[13.5px] font-semibold text-ink">
                                {selected.rec.title}
                            </span>
                        </div>
                        {sentence && (
                            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                                You'll see this in{' '}
                                <span className="font-medium text-ink">
                                    {sentence}
                                </span>
                                . You can stop it at any step.
                            </p>
                        )}

                        <ol className="relative mt-4 space-y-3">
                            <span className="absolute top-3 bottom-3 left-[15px] w-px bg-line" />
                            {steps.length === 0 && (
                                <li className="text-[12.5px] text-ink-3">
                                    Only shown in the app.
                                </li>
                            )}
                            {steps.map((s, i) => {
                                const Icon = iconFor(s.channel);
                                const off =
                                    s.channel !== 'app' &&
                                    !prefs.channels[s.channel];
                                const quiet =
                                    !off &&
                                    prefs.quietHours &&
                                    s.channel === 'push' &&
                                    inQuietHours(s.when);

                                return (
                                    <li
                                        key={`${s.channel}-${i}`}
                                        className="relative flex items-start gap-3"
                                    >
                                        <span
                                            className={cn(
                                                'relative z-10 flex size-[31px] shrink-0 items-center justify-center rounded-full border bg-white',
                                                off
                                                    ? 'border-line text-ink-3'
                                                    : 'border-kbc-navy/25 text-kbc-navy',
                                            )}
                                        >
                                            <Icon className="size-3.5" />
                                        </span>
                                        <div
                                            className={cn(
                                                'min-w-0 flex-1 pt-0.5',
                                                off && 'opacity-50',
                                            )}
                                        >
                                            <div className="flex items-baseline gap-2 text-[12.5px]">
                                                <span
                                                    className={cn(
                                                        'font-semibold text-ink',
                                                        off && 'line-through',
                                                    )}
                                                >
                                                    {
                                                        CHANNEL_COPY[s.channel]
                                                            .label
                                                    }
                                                </span>
                                                <span className="text-ink-3">
                                                    {quiet
                                                        ? '08:00, after quiet hours'
                                                        : s.when}
                                                </span>
                                            </div>
                                            <div className="mt-1 inline-block rounded-xl rounded-tl-sm bg-mist px-3 py-1.5 text-[12.5px] leading-snug text-ink-2">
                                                {s.message}
                                            </div>
                                            {off && (
                                                <div className="mt-1 flex items-center gap-1 text-[11.5px] text-ink-3">
                                                    <BellOff className="size-3" />{' '}
                                                    Skipped: you turned this off
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </Card>
                )}
            </div>

            <div>
                <SectionHeader
                    eyebrow="How it looks"
                    aside="The same message, in every place"
                />
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-[#dfe7ef] to-[#eef2f6] p-3">
                        <div className="mb-2 text-[11px] font-medium text-ink-3">
                            Push notification
                        </div>
                        <div className="rounded-xl bg-white/85 px-3 py-2.5 shadow-[0_2px_8px_rgba(16,24,40,0.08)] backdrop-blur">
                            <div className="flex items-center gap-1.5 text-[10.5px] text-ink-3">
                                <span className="flex size-4 items-center justify-center rounded bg-kbc-navy text-[7px] font-bold text-white">
                                    KBC
                                </span>
                                KBC Mobile
                                <span className="ml-auto">now</span>
                            </div>
                            <div className="mt-1 text-[12.5px] font-semibold text-ink">
                                {view.push.title}
                            </div>
                            <div className="text-[12px] leading-snug text-ink-2">
                                {view.push.body}
                            </div>
                        </div>
                        {!prefs.channels.push && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] text-ink-3">
                                <BellOff className="size-3" /> Off. You'll see
                                it in the app instead.
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-line bg-white p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
                            <MessageCircle className="size-3" /> Kate
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-kbc-sky/15 text-[10px] font-bold text-kbc-navy">
                                K
                            </span>
                            <div className="rounded-xl rounded-tl-sm bg-mist px-3 py-2 text-[12.5px] leading-snug text-ink">
                                {view.kateOpener}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-line bg-white p-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
                            <UserRound className="size-3" /> If you ask to talk
                            to someone
                        </div>
                        {view.advisorBrief ? (
                            <>
                                <div className="mt-1.5 text-[12.5px] text-ink-2">
                                    Your advisor sees this short note, so you
                                    don't have to explain everything again:
                                </div>
                                <div className="mt-2 rounded-xl border-l-2 border-k-human bg-k-human/[0.04] px-3 py-2 text-[12.5px] leading-snug text-ink">
                                    {view.advisorBrief}
                                </div>
                            </>
                        ) : (
                            <div className="mt-1.5 text-[12.5px] text-ink-2">
                                No advisor is involved right now. If you ask,
                                they'll only see what's on this screen.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <SectionHeader
                    eyebrow="Your choices"
                    aside="Changes apply right away"
                />
                <Card className="divide-y divide-line/70">
                    <div className="flex items-center gap-3 px-4 py-2.5">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-mist text-ink-2">
                            <Lock className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-ink">
                                {CHANNEL_COPY.app.label}
                            </div>
                            <div className="text-[11.5px] text-ink-3">
                                {CHANNEL_COPY.app.sub}
                            </div>
                        </div>
                        <span className="text-[11.5px] text-ink-3">
                            Always on
                        </span>
                    </div>
                    {TOGGLABLE.map((c) => {
                        const Icon = iconFor(c);

                        return (
                            <div
                                key={c}
                                className="flex items-center gap-3 px-4 py-2.5"
                            >
                                <span className="flex size-7 items-center justify-center rounded-lg bg-mist text-ink-2">
                                    <Icon className="size-3.5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[13px] font-medium text-ink">
                                        {CHANNEL_COPY[c].label}
                                    </div>
                                    <div className="text-[11.5px] text-ink-3">
                                        {CHANNEL_COPY[c].sub}
                                    </div>
                                </div>
                                <Toggle
                                    label={CHANNEL_COPY[c].label}
                                    on={prefs.channels[c]}
                                    onChange={(on) =>
                                        setPrefs((p) => ({
                                            ...p,
                                            channels: {
                                                ...p.channels,
                                                [c]: on,
                                            },
                                        }))
                                    }
                                />
                            </div>
                        );
                    })}
                    <div className="flex items-center gap-3 px-4 py-2.5">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-mist text-ink-2">
                            <Moon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-ink">
                                Quiet hours
                            </div>
                            <div className="text-[11.5px] text-ink-3 tabular-nums">
                                Nothing between 21:00 and 08:00
                            </div>
                        </div>
                        <Toggle
                            label="Quiet hours"
                            on={prefs.quietHours}
                            onChange={(on) =>
                                setPrefs((p) => ({ ...p, quietHours: on }))
                            }
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
