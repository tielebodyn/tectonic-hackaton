import {
    ArrowRight,
    Check,
    ChevronRight,
    EyeOff,
    Scale,
    SlidersHorizontal,
    ThumbsDown,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { Moment, RankedRecommendation, Signal } from '../../types';
import { euro } from '../../engine';
import { KindChip, Meter, SOURCE_STYLE } from '../../ui';
import { KIND_SOLID } from './action-card';
import { cn } from '@/lib/utils';

/** What the engine never looks at. Shown in the sheet so privacy is visible, not buried in a policy. */
const NOT_USED =
    'We never use health data, your contacts, your location or what you buy at the pharmacy.';

export function WhySheet({
    item,
    moment,
    signals,
    soft,
    onClose,
    onDismiss,
}: {
    item: RankedRecommendation;
    moment?: Moment;
    signals: Signal[];
    soft: boolean;
    onClose: () => void;
    onDismiss: () => void;
}) {
    const { rec } = item;
    const sells = rec.kind === 'kbc' || rec.kind === 'partner';
    const muted = soft && sells;
    const [corrected, setCorrected] = useState<string[]>([]);

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <button
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 animate-in bg-ink/35 backdrop-blur-[2px] duration-300 fade-in"
            />
            <div className="relative flex max-h-[88%] animate-in flex-col rounded-t-[30px] bg-white duration-300 ease-out slide-in-from-bottom">
                <div className="bg-line mx-auto mt-2 h-1 w-9 shrink-0 rounded-full" />
                <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-3 pb-3">
                    <div className="min-w-0">
                        <div className="text-[18px] font-semibold tracking-tight text-ink">
                            Why am I seeing this?
                        </div>
                        <div className="text-ink-2 mt-1 flex items-center gap-1.5 text-[12.5px]">
                            <KindChip kind={rec.kind} />
                            <span className="truncate">{rec.title}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-mist text-ink-2 flex size-8 shrink-0 items-center justify-center rounded-full"
                    >
                        <X className="size-4" strokeWidth={2.5} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-4">
                    {moment ? (
                        <div className="bg-mist rounded-[18px] p-4">
                            <div className="flex items-baseline justify-between gap-3">
                                <div className="text-ink-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                    What we think is coming
                                </div>
                                <div className="text-ink-2 shrink-0 text-[11px]">
                                    {moment.horizon}
                                </div>
                            </div>
                            <div className="mt-1.5 text-[15px] leading-snug font-semibold text-ink">
                                {moment.title}
                            </div>
                            <p className="text-ink-2 mt-1 text-[13px] leading-relaxed">
                                {moment.narrative}
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                                <Meter
                                    value={moment.confidence}
                                    className="h-2 bg-white"
                                    tone="bg-kbc-sky"
                                />
                                <span className="shrink-0 text-[13px] font-semibold text-ink tabular-nums">
                                    {moment.confidence}% sure
                                </span>
                            </div>
                            {moment.impactCents !== undefined &&
                                moment.impactCents !== 0 && (
                                    <div className="text-ink-2 mt-2 text-[12px]">
                                        Effect on your money:{' '}
                                        <span
                                            className={cn(
                                                'font-semibold tabular-nums',
                                                moment.impactCents > 0
                                                    ? 'text-k-nosale'
                                                    : 'text-ink',
                                            )}
                                        >
                                            {euro(moment.impactCents, {
                                                sign: true,
                                            })}
                                        </span>
                                    </div>
                                )}
                        </div>
                    ) : null}

                    {signals.length > 0 && (
                        <div>
                            <div className="text-ink-3 mb-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                What we noticed
                            </div>
                            <ul className="space-y-2">
                                {signals.map((s) => {
                                    const src = SOURCE_STYLE[s.source];
                                    const Icon = src.icon;

                                    return (
                                        <li
                                            key={s.id}
                                            className="border-line flex gap-3 rounded-[14px] border p-3"
                                        >
                                            <div className="bg-kbc-navy/[0.06] text-kbc-navy flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                                                <Icon
                                                    className="size-4"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[13px] leading-snug font-medium text-ink">
                                                    {s.label}
                                                </div>
                                                <div className="text-ink-2 mt-0.5 text-[12px] leading-snug">
                                                    {s.detail}
                                                </div>
                                                <div className="text-ink-3 mt-1.5 flex items-center gap-1.5 text-[10.5px]">
                                                    <span>{src.label}</span>
                                                    <span>·</span>
                                                    <span className="truncate">
                                                        noticed {s.observedAt}
                                                    </span>
                                                    {corrected.includes(
                                                        s.id,
                                                    ) ? (
                                                        <span className="text-k-nosale ml-auto flex shrink-0 animate-in items-center gap-1 font-medium duration-300 fade-in">
                                                            <Check
                                                                className="size-3"
                                                                strokeWidth={
                                                                    2.75
                                                                }
                                                            />
                                                            Thanks, noted
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                setCorrected(
                                                                    (c) => [
                                                                        ...c,
                                                                        s.id,
                                                                    ],
                                                                )
                                                            }
                                                            className="border-line text-ink-2 hover:bg-mist ml-auto shrink-0 rounded-full border px-2 py-0.5 font-medium"
                                                        >
                                                            Not me
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div className="bg-k-nosale/8 text-ink-2 flex gap-2.5 rounded-[14px] p-3 text-[12px] leading-snug">
                        <EyeOff className="text-k-nosale mt-0.5 size-4 shrink-0" />
                        <div>
                            <span className="font-semibold text-ink">
                                What we did not use.{' '}
                            </span>
                            {NOT_USED}
                        </div>
                    </div>

                    <div className="text-ink-3 flex gap-2.5 px-1 text-[11.5px] leading-snug">
                        <Scale className="mt-0.5 size-3.5 shrink-0" />
                        <div>
                            {sells
                                ? rec.kind === 'partner'
                                    ? `This is an offer from ${rec.partner ?? 'a partner'}. KBC may earn a fee if you take it. Offers never come before help you need.`
                                    : 'This is a KBC product. Offers never come before help you need, and you can always say no.'
                                : 'Nothing to sell here. We show this because it may help you.'}
                        </div>
                    </div>

                    <button className="border-line text-kbc-navy-2 flex w-full items-center gap-2 rounded-[14px] border px-3 py-2.5 text-left text-[12.5px] font-medium">
                        <SlidersHorizontal className="size-4" />
                        <span className="flex-1">Manage what KBC may use</span>
                        <ChevronRight className="text-ink-3 size-4" />
                    </button>
                </div>

                <div className="border-line shrink-0 space-y-2 border-t px-5 pt-3 pb-7">
                    <button
                        onClick={onClose}
                        className={cn(
                            'flex h-12 w-full items-center justify-center gap-1.5 rounded-[15px] text-[15px] font-semibold',
                            muted
                                ? 'bg-kbc-navy text-white'
                                : cn(KIND_SOLID[rec.kind], 'text-white'),
                        )}
                    >
                        {rec.cta}
                        <ArrowRight className="size-4" strokeWidth={2.25} />
                    </button>
                    <button
                        onClick={onDismiss}
                        className="text-ink-2 hover:bg-mist flex h-11 w-full items-center justify-center gap-1.5 rounded-[15px] text-[14px] font-medium"
                    >
                        <ThumbsDown className="size-4" />
                        Not relevant for me
                    </button>
                </div>
            </div>
        </div>
    );
}
