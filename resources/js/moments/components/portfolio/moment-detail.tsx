import { Check, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import type { Moment, PersonaView } from '../../types';
import { SOURCE_STYLE } from '../../ui';
import { short } from '../../data/portfolio';
import { cn } from '@/lib/utils';

/** The "why we think so" for one moment: plain words, the signals behind it, and a way to say "no". */
export function MomentDetail({
    view,
    moment,
    n,
}: {
    view: PersonaView;
    moment: Moment;
    n: number;
}) {
    const [feedback, setFeedback] = useState<Record<string, 'yes' | 'no'>>({});
    const signals = view.signals.filter((s) => moment.signalIds.includes(s.id));
    const helps = view.decision.ranked.filter(
        (r) => r.rec.momentId === moment.id,
    ).length;
    const answer = feedback[moment.id];

    return (
        <div
            key={moment.id}
            className="grid animate-in grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 duration-300 fade-in slide-in-from-bottom-1"
        >
            <div>
                <div className="text-ink-3 flex items-center gap-2 text-[13px]">
                    <span className="bg-kbc-navy flex size-5 items-center justify-center rounded-full text-[11px] font-semibold text-white">
                        {n}
                    </span>
                    {moment.daysAhead <= 7 ? 'Right now' : moment.horizon}
                    {moment.impactCents ? (
                        <span
                            className={cn(
                                'rounded-full px-2 py-0.5 text-[12px] font-medium tabular-nums',
                                moment.impactCents > 0
                                    ? 'bg-k-nosale/10 text-k-nosale'
                                    : 'bg-k-human/10 text-k-human',
                            )}
                        >
                            {moment.impactCents > 0 ? '+' : ''}
                            {short(moment.impactCents)} for you
                        </span>
                    ) : null}
                </div>
                <h3 className="mt-3 text-[26px] leading-tight font-semibold tracking-tight text-ink">
                    {moment.title}
                </h3>
                <p className="text-ink-2 mt-3 text-[16px] leading-relaxed">
                    {moment.narrative}
                </p>

                <div className="mt-6 flex items-center gap-5">
                    <div className="relative size-16 shrink-0">
                        <svg
                            viewBox="0 0 36 36"
                            className="size-full -rotate-90"
                        >
                            <circle
                                cx="18"
                                cy="18"
                                r="15.5"
                                fill="none"
                                stroke="#f2f5f8"
                                strokeWidth="3.5"
                            />
                            <circle
                                cx="18"
                                cy="18"
                                r="15.5"
                                fill="none"
                                stroke="#003665"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeDasharray={`${(moment.confidence / 100) * 97.4} 97.4`}
                                className="transition-[stroke-dasharray] duration-500"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold tabular-nums">
                            {moment.confidence}%
                        </span>
                    </div>
                    <div className="text-ink-2 text-[14px] leading-snug">
                        <span className="font-semibold text-ink">
                            {moment.confidence}% sure
                        </span>
                        , based on {signals.length}{' '}
                        {signals.length === 1 ? 'thing' : 'things'} we noticed.
                        <br />
                        We could be wrong. If we are, tell us and we'll stop.
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                    {answer ? (
                        <span className="bg-mist text-ink-2 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px]">
                            <Check className="text-k-nosale size-3.5" />
                            {answer === 'yes'
                                ? 'Thanks, noted.'
                                : "Got it. We won't bring this up again."}
                        </span>
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    setFeedback((f) => ({
                                        ...f,
                                        [moment.id]: 'yes',
                                    }))
                                }
                                className="border-line hover:bg-mist inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[13px] font-medium text-ink"
                            >
                                <Check className="size-3.5" />
                                That's right
                            </button>
                            <button
                                onClick={() =>
                                    setFeedback((f) => ({
                                        ...f,
                                        [moment.id]: 'no',
                                    }))
                                }
                                className="border-line text-ink-2 hover:bg-mist inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[13px] font-medium"
                            >
                                <ThumbsDown className="size-3.5" />
                                Not for me
                            </button>
                        </>
                    )}
                    {helps > 0 && (
                        <span className="text-ink-3 ml-2 text-[13px]">
                            {helps} {helps === 1 ? 'way' : 'ways'} we can help,
                            below
                        </span>
                    )}
                </div>
            </div>

            <div>
                <div className="text-ink-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                    Why we think so
                </div>
                <ul className="divide-line mt-3 divide-y">
                    {signals.map((s) => {
                        const src = SOURCE_STYLE[s.source];
                        const Icon = src.icon;

                        return (
                            <li
                                key={s.id}
                                className="flex gap-3.5 py-3.5 first:pt-1"
                            >
                                <span className="bg-kbc-sky/10 text-kbc-navy flex size-9 shrink-0 items-center justify-center rounded-xl">
                                    <Icon className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="text-[14px] font-semibold text-ink">
                                            {s.label}
                                        </span>
                                        <span className="text-ink-3 shrink-0 text-[12px]">
                                            {s.observedAt}
                                        </span>
                                    </div>
                                    <p className="text-ink-2 mt-0.5 text-[13px] leading-relaxed">
                                        {s.detail}
                                    </p>
                                    <div className="text-ink-3 mt-1.5 flex items-center gap-2 text-[11px]">
                                        {src.label}
                                        <span className="flex gap-0.5">
                                            {[0.2, 0.4, 0.6, 0.8, 1].map(
                                                (t) => (
                                                    <span
                                                        key={t}
                                                        className={cn(
                                                            'h-1.5 w-2.5 rounded-full',
                                                            s.strength >=
                                                                t - 0.1
                                                                ? 'bg-kbc-navy/70'
                                                                : 'bg-line',
                                                        )}
                                                    />
                                                ),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    {!signals.length && (
                        <li className="text-ink-3 py-3 text-[13px]">
                            No signals linked yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
