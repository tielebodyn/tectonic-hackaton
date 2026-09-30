import {
    ArrowLeftRight,
    Baby,
    Banknote,
    Bot,
    Briefcase,
    CalendarClock,
    ChevronRight,
    CircleDashed,
    HeartPulse,
    House,
    Landmark,
    PiggyBank,
    Repeat,
    Send,
    ShieldCheck,
    ShoppingBag,
    ShoppingBasket,
    Ticket,
    TrainFront,
    TrendingUp,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import type { Moment, Transaction, TxCategory } from '../../types';
import { euro } from '../../engine';
import { cn } from '@/lib/utils';

export function SectionTitle({
    children,
    action,
}: {
    children: React.ReactNode;
    action?: string;
}) {
    return (
        <div className="mb-2.5 flex items-baseline justify-between px-1">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
                {children}
            </h2>
            {action && (
                <span className="flex items-center text-[12px] font-medium text-kbc-navy-2">
                    {action}
                    <ChevronRight className="size-3.5" />
                </span>
            )}
        </div>
    );
}

/* ---------- Coming up ---------- */

export function ComingUp({
    moments,
    newIds,
}: {
    moments: Moment[];
    newIds: Set<string>;
}) {
    const sorted = [...moments].sort((a, b) => a.daysAhead - b.daysAhead);

    if (!sorted.length) {
        return null;
    }

    return (
        <section>
            <SectionTitle>Coming up</SectionTitle>
            <div className="rounded-[20px] border border-line bg-white px-4 py-1">
                {sorted.map((m, i) => (
                    <div
                        key={m.id}
                        className="relative flex animate-in gap-3 py-3 duration-500 fade-in slide-in-from-top-2"
                    >
                        {/* rail */}
                        <div className="relative flex w-3 shrink-0 justify-center">
                            {i > 0 && (
                                <span className="absolute -top-3 h-[18px] w-px bg-line" />
                            )}
                            {i < sorted.length - 1 && (
                                <span className="absolute top-[18px] -bottom-3 w-px bg-line" />
                            )}
                            <span
                                className={cn(
                                    'relative mt-[5px] size-2.5 rounded-full border-2',
                                    m.daysAhead <= 7
                                        ? 'border-kbc-sky bg-kbc-sky'
                                        : 'border-ink-3/60 bg-white',
                                )}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
                                <span
                                    className={cn(
                                        'font-medium',
                                        m.daysAhead <= 7 && 'text-[#0086bb]',
                                    )}
                                >
                                    {m.horizon}
                                </span>
                                {newIds.has(m.id) && (
                                    <span className="rounded-full bg-kbc-sky/12 px-1.5 text-[10px] font-semibold text-[#0086bb] uppercase">
                                        New
                                    </span>
                                )}
                            </div>
                            <div className="mt-0.5 text-[13.5px] leading-snug font-medium text-ink">
                                {m.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[11.5px] text-ink-2">
                                <span className="flex items-center gap-1.5 tabular-nums">
                                    <span className="relative h-1 w-8 overflow-hidden rounded-full bg-mist">
                                        <span
                                            className="absolute inset-y-0 left-0 rounded-full bg-kbc-navy/70"
                                            style={{
                                                width: `${m.confidence}%`,
                                            }}
                                        />
                                    </span>
                                    {m.confidence}% sure
                                </span>
                                {m.impactCents !== undefined &&
                                    m.impactCents !== 0 && (
                                        <>
                                            <span className="text-ink-3">
                                                ·
                                            </span>
                                            <span
                                                className={cn(
                                                    'font-medium tabular-nums',
                                                    m.impactCents > 0
                                                        ? 'text-k-nosale'
                                                        : 'text-ink',
                                                )}
                                            >
                                                {euro(m.impactCents, {
                                                    sign: true,
                                                })}
                                            </span>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------- Recent transactions ---------- */

const CATEGORY_ICON: Record<TxCategory, typeof House> = {
    income: Banknote,
    housing: House,
    groceries: ShoppingBasket,
    subscriptions: Repeat,
    utilities: Zap,
    insurance: ShieldCheck,
    transport: TrainFront,
    shopping: ShoppingBag,
    savings: PiggyBank,
    investing: TrendingUp,
    bnpl: CalendarClock,
    tax: Landmark,
    childcare: Baby,
    health: HeartPulse,
    leisure: Ticket,
    transfer: ArrowLeftRight,
    business: Briefcase,
    other: CircleDashed,
};

export function RecentTransactions({
    transactions,
    newIds,
}: {
    transactions: Transaction[];
    newIds: Set<string>;
}) {
    if (!transactions.length) {
        return null;
    }

    return (
        <section>
            <SectionTitle action="All">Recent</SectionTitle>
            <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
                {transactions.slice(0, 10).map((tx) => {
                    const Icon = CATEGORY_ICON[tx.category] ?? CircleDashed;
                    const income = tx.amountCents > 0;
                    const fresh = newIds.has(tx.id);

                    return (
                        <li
                            key={tx.id}
                            className={cn(
                                'flex animate-in items-center gap-3 px-3.5 py-2.5 duration-500 fade-in slide-in-from-top-2',
                                fresh && 'bg-kbc-sky/[0.06]',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-full',
                                    income
                                        ? 'bg-k-nosale/10 text-k-nosale'
                                        : 'bg-mist text-ink-2',
                                )}
                            >
                                <Icon className="size-4" strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[13.5px] font-medium text-ink">
                                    {tx.label}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
                                    <span className="shrink-0">
                                        {fresh ? 'Just now' : tx.date}
                                    </span>
                                    {tx.flag && (
                                        <span className="truncate rounded-md bg-kbc-sky/10 px-1.5 py-px text-[10.5px] font-medium text-[#0079a8]">
                                            noticed: {tx.flag}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className={cn(
                                    'shrink-0 text-[13.5px] font-semibold tabular-nums',
                                    income ? 'text-k-nosale' : 'text-ink',
                                )}
                            >
                                {euro(tx.amountCents, {
                                    sign: true,
                                    decimals: true,
                                })}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

/* ---------- Kate ---------- */

export function KateBubble({
    opener,
    firstName,
    defaultOpen,
}: {
    opener: string;
    firstName: string;
    defaultOpen: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    if (!opener) {
        return null;
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="absolute inset-x-2.5 bottom-[86px] z-30 flex animate-in items-center gap-2.5 rounded-[18px] border border-white/70 bg-white/80 py-2 pr-2 pl-2 text-left shadow-[0_10px_30px_-12px_rgba(11,31,51,0.35)] backdrop-blur-xl backdrop-saturate-150 duration-500 fade-in slide-in-from-bottom-2"
            >
                <span className="relative">
                    <KateAvatar size={32} />
                    <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-k-human ring-2 ring-white" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-ink">
                        Kate
                    </span>
                    <span className="block truncate text-[12px] text-ink-2">
                        {opener}
                    </span>
                </span>
                <span className="shrink-0 rounded-full bg-kbc-navy px-3 py-1.5 text-[11.5px] font-semibold text-white">
                    Reply
                </span>
            </button>
        );
    }

    return (
        <div className="absolute inset-x-2.5 bottom-[86px] z-30 animate-in rounded-[22px] border border-line bg-white p-3.5 shadow-[0_16px_40px_-12px_rgba(11,31,51,0.3)] duration-300 zoom-in-95 fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
                <KateAvatar />
                <div className="flex-1 leading-tight">
                    <div className="text-[13px] font-semibold text-ink">
                        Kate
                    </div>
                    <div className="text-[10.5px] text-ink-3">
                        Your KBC assistant
                    </div>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    className="flex size-7 items-center justify-center rounded-full bg-mist text-ink-2"
                >
                    <X className="size-3.5" strokeWidth={2.5} />
                </button>
            </div>
            <div className="mt-3 rounded-[16px] rounded-tl-[6px] bg-mist px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
                {opener}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
                {['Yes, show me', 'Later', 'Talk to a person'].map((q) => (
                    <span
                        key={q}
                        className="rounded-full border border-line px-2.5 py-1 text-[11.5px] font-medium text-kbc-navy-2"
                    >
                        {q}
                    </span>
                ))}
            </div>
            <div className="mt-2.5 flex items-center gap-2 rounded-full border border-line py-1.5 pr-1.5 pl-3.5 text-[12.5px] text-ink-3">
                <span className="flex-1">Message Kate, {firstName}…</span>
                <span className="flex size-7 items-center justify-center rounded-full bg-kbc-navy text-white">
                    <Send className="size-3.5" />
                </span>
            </div>
        </div>
    );
}

export function KateAvatar({ size = 30 }: { size?: number }) {
    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-kbc-sky to-kbc-navy-2 text-white"
            style={{ width: size, height: size }}
        >
            <Bot className="size-4" strokeWidth={2.25} />
        </span>
    );
}
