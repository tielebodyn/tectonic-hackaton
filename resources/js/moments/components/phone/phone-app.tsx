import {
    ArrowLeftRight,
    Bell,
    Bot,
    Ellipsis,
    HeartHandshake,
    House,
    Send,
    ShieldCheck,
    Sparkles,
    Wallet,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PersonaView } from '../../types';
import { euro } from '../../engine';
import { CompactCard, HeroCard } from './action-card';
import { PhoneFrame } from './phone-frame';
import { ComingUp, KateBubble, RecentTransactions } from './phone-sections';
import { WhySheet } from './why-sheet';
import { cn } from '@/lib/utils';

/** Deep links for the demo/screenshots: ?sheet=<recId> opens the explain sheet, ?kate=1 opens Kate. */
const params =
    typeof window === 'undefined'
        ? new URLSearchParams()
        : new URLSearchParams(window.location.search);

export function PhoneApp({
    view,
    onDismiss,
}: {
    view: PersonaView;
    onDismiss: (recId: string) => void;
}) {
    const [openRecId, setOpenRecId] = useState<string | null>(
        params.get('sheet'),
    );
    const [toast, setToast] = useState<string | null>(null);
    const scroller = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    // ?scroll=600 for screenshots of the lower part of the feed.
    useEffect(() => {
        if (scroller.current && params.get('scroll')) {
            scroller.current.scrollTop = Number(params.get('scroll'));
            setScrolled(scroller.current.scrollTop > 230);
        }
    }, []);

    const top = view.decision.ranked.slice(0, 3);
    const openItem = view.decision.ranked.find((r) => r.rec.id === openRecId);
    const momentOf = (id: string) => view.moments.find((m) => m.id === id);
    const soft = Boolean(view.state.sensitiveMoment);

    // Everything a fired live event added, so the phone can mark it as new.
    const fired = view.events.filter((e) => view.firedEventIds.includes(e.id));
    const newRecIds = new Set(
        fired.flatMap(
            (e) => e.effect.addRecommendations?.map((r) => r.id) ?? [],
        ),
    );
    const newMomentIds = new Set(
        fired.flatMap((e) => e.effect.addMoments?.map((m) => m.id) ?? []),
    );
    const newTxIds = new Set(
        fired.flatMap((e) => (e.transaction ? [e.transaction.id] : [])),
    );

    const primary = view.accounts[0];
    const others = view.accounts.slice(1);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const t = setTimeout(() => setToast(null), 2600);

        return () => clearTimeout(t);
    }, [toast]);

    const dismiss = (recId: string) => {
        setOpenRecId(null);
        onDismiss(recId);
        setToast("Thanks — we'll show fewer of these");
    };

    return (
        <PhoneFrame statusTone={scrolled ? 'dark' : 'light'}>
            <div
                ref={scroller}
                onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 230)}
                className="absolute inset-0 [scrollbar-width:none] overflow-y-auto overscroll-contain"
            >
                {/* ---------- navy header ---------- */}
                <header className="relative bg-kbc-navy px-5 pt-[56px] pb-9 text-white">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                            background:
                                'radial-gradient(120% 70% at 100% 0%, rgba(0,174,239,0.28) 0%, transparent 60%), radial-gradient(80% 60% at 0% 100%, rgba(10,74,128,0.9) 0%, transparent 70%)',
                        }}
                    />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 items-center rounded-[8px] bg-white px-1.5 text-[12px] font-extrabold tracking-tight text-kbc-navy">
                                    KBC
                                </span>
                                <span className="text-[13px] font-medium text-white/70">
                                    Mobile
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex size-8 items-center justify-center rounded-full bg-white/10">
                                    <Bell className="size-4" />
                                    {view.push && (
                                        <span className="absolute top-1.5 right-2 size-1.5 rounded-full bg-kbc-sky" />
                                    )}
                                </span>
                                <span
                                    className="flex size-8 items-center justify-center rounded-full text-[11px] font-semibold"
                                    style={{
                                        background: `oklch(0.9 0.05 ${view.avatar.hue})`,
                                        color: `oklch(0.35 0.1 ${view.avatar.hue})`,
                                    }}
                                >
                                    {view.avatar.initials}
                                </span>
                            </div>
                        </div>

                        <p
                            key={view.greeting}
                            className="mt-4 animate-in text-[15px] leading-snug text-white/85 duration-500 fade-in"
                        >
                            {view.greeting}
                        </p>

                        {primary && (
                            <div className="mt-5">
                                <div className="flex items-center gap-1.5 text-[12px] text-white/60">
                                    <span className="font-medium text-white/80">
                                        {primary.label}
                                    </span>
                                    <span>·</span>
                                    <span className="tabular-nums">
                                        {primary.iban}
                                    </span>
                                </div>
                                <div
                                    key={primary.balanceCents}
                                    className="mt-1 animate-in text-[38px] leading-none font-semibold tracking-tight tabular-nums duration-500 fade-in"
                                >
                                    <Balance cents={primary.balanceCents} />
                                </div>
                            </div>
                        )}

                        {others.length > 0 && (
                            <div className="-mx-5 mt-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5">
                                {others.map((a) => (
                                    <div
                                        key={a.iban + a.label}
                                        className="min-w-[128px] shrink-0 rounded-[14px] border border-white/10 bg-white/[0.08] px-3 py-2"
                                    >
                                        <div className="truncate text-[11px] text-white/60">
                                            {a.label}
                                        </div>
                                        <div className="mt-0.5 text-[14px] font-semibold tabular-nums">
                                            {euro(a.balanceCents)}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex shrink-0 items-center gap-1.5 rounded-[14px] border border-dashed border-white/15 px-3 text-[12px] text-white/60">
                                    <Send className="size-3.5" />
                                    Transfer
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* ---------- body ---------- */}
                <div className="relative -mt-5 space-y-6 rounded-t-[26px] bg-mist px-3.5 pt-3 pb-[160px]">
                    <section className="space-y-2.5">
                        {view.state.vulnerable && (
                            <div className="flex animate-in gap-3 rounded-[18px] border border-k-protect/25 bg-k-protect/10 p-3.5 duration-500 fade-in slide-in-from-top-2">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-k-protect text-white">
                                    <ShieldCheck
                                        className="size-4"
                                        strokeWidth={2.25}
                                    />
                                </span>
                                <div className="text-[12.5px] leading-snug text-ink">
                                    <div className="font-semibold">
                                        We're keeping an extra eye out for you
                                    </div>
                                    <div className="mt-0.5 text-ink-2">
                                        Something unusual is going on. No offers
                                        for now — your safety comes first.
                                    </div>
                                </div>
                            </div>
                        )}
                        {view.state.financialStress && (
                            <div className="flex animate-in gap-3 rounded-[18px] border border-kbc-navy/10 bg-white p-3.5 duration-500 fade-in slide-in-from-top-2">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-kbc-navy/[0.07] text-kbc-navy">
                                    <HeartHandshake
                                        className="size-4"
                                        strokeWidth={2.25}
                                    />
                                </span>
                                <div className="text-[12.5px] leading-snug text-ink">
                                    <div className="font-semibold">
                                        We've paused offers for now
                                    </div>
                                    <div className="mt-0.5 text-ink-2">
                                        Things look tight. Want to talk to
                                        someone?
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-baseline justify-between px-1 pt-1">
                            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
                                For you, right now
                            </h2>
                            <span className="flex items-center gap-1 text-[11px] text-ink-3">
                                <Sparkles className="size-3 text-kbc-sky" />
                                Based on your accounts
                            </span>
                        </div>

                        {top.length === 0 ? (
                            <div className="rounded-[20px] border border-line bg-white p-5 text-center">
                                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-k-nosale/10 text-k-nosale">
                                    <ShieldCheck className="size-5" />
                                </div>
                                <div className="mt-2.5 text-[14px] font-semibold text-ink">
                                    All calm
                                </div>
                                <div className="mt-0.5 text-[12.5px] text-ink-2">
                                    Nothing needs your attention right now.
                                    We'll let you know when it does.
                                </div>
                            </div>
                        ) : (
                            top.map((item, i) => {
                                const Card = i === 0 ? HeroCard : CompactCard;

                                return (
                                    <Card
                                        key={item.rec.id}
                                        item={item}
                                        moment={momentOf(item.rec.momentId)}
                                        soft={soft}
                                        isNew={newRecIds.has(item.rec.id)}
                                        onOpen={() => setOpenRecId(item.rec.id)}
                                    />
                                );
                            })
                        )}
                    </section>

                    <ComingUp moments={view.moments} newIds={newMomentIds} />
                    <RecentTransactions
                        transactions={view.transactions}
                        newIds={newTxIds}
                    />

                    <div className="px-2 text-center text-[10.5px] leading-relaxed text-ink-3">
                        Personalised for you by KBC. You decide what we may use.
                    </div>
                </div>
            </div>

            {/* frosted strip behind the status bar once the navy header has scrolled away */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 z-30 h-[54px] border-b border-line/70 bg-mist/80 backdrop-blur-xl transition-opacity duration-200',
                    scrolled ? 'opacity-100' : 'opacity-0',
                )}
            />

            <KateBubble
                opener={view.kateOpener}
                firstName={view.firstName}
                defaultOpen={params.get('kate') === '1'}
            />
            <TabBar />

            {view.push && (
                <PushBanner
                    key={`${view.push.title}|${view.push.body}`}
                    push={view.push}
                />
            )}

            {toast && (
                <div className="absolute inset-x-0 bottom-[150px] z-[60] flex justify-center">
                    <div className="animate-in rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg duration-300 fade-in slide-in-from-bottom-2">
                        {toast}
                    </div>
                </div>
            )}

            {openItem && (
                <WhySheet
                    key={openItem.rec.id}
                    item={openItem}
                    moment={momentOf(openItem.rec.momentId)}
                    signals={(momentOf(openItem.rec.momentId)?.signalIds ?? [])
                        .map((id) => view.signals.find((s) => s.id === id))
                        .filter((s) => s !== undefined)}
                    soft={soft}
                    onClose={() => setOpenRecId(null)}
                    onDismiss={() => dismiss(openItem.rec.id)}
                />
            )}
        </PhoneFrame>
    );
}

function Balance({ cents }: { cents: number }) {
    const str = euro(cents, { decimals: true });
    const [whole, dec] = str.split(',');

    return (
        <>
            {whole}
            {dec !== undefined && (
                <span className="text-[24px] text-white/60">,{dec}</span>
            )}
        </>
    );
}

function TabBar() {
    const tabs = [
        { icon: House, label: 'Home', active: true },
        { icon: Wallet, label: 'Accounts' },
        { icon: ArrowLeftRight, label: 'Payments' },
        { icon: Bot, label: 'Kate' },
        { icon: Ellipsis, label: 'More' },
    ];

    return (
        <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-line/80 bg-white/90 pt-2 pb-6 backdrop-blur-xl">
            <ul className="flex justify-around">
                {tabs.map(({ icon: Icon, label, active }) => (
                    <li
                        key={label}
                        className={cn(
                            'flex w-14 flex-col items-center gap-0.5 text-[10px] font-medium',
                            active ? 'text-kbc-navy' : 'text-ink-3',
                        )}
                    >
                        <Icon
                            className="size-[22px]"
                            strokeWidth={active ? 2.25 : 1.75}
                        />
                        {label}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

/** iOS-style notification. Remounted (via key) whenever the push content changes, so it slides in again. */
function PushBanner({ push }: { push: { title: string; body: string } }) {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const inT = setTimeout(() => setShown(true), 450);
        const outT =
            params.get('push') === 'hold'
                ? undefined
                : setTimeout(() => setShown(false), 5600);

        return () => {
            clearTimeout(inT);
            clearTimeout(outT);
        };
    }, []);

    return (
        <button
            onClick={() => setShown(false)}
            className={cn(
                'absolute inset-x-2.5 top-[52px] z-[45] rounded-[24px] border border-white/60 bg-white/75 p-3 text-left shadow-[0_12px_40px_-10px_rgba(11,31,51,0.45)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]',
                shown
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-[140%] opacity-0',
            )}
        >
            <div className="flex gap-3">
                <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-kbc-navy text-[11px] font-extrabold tracking-tight text-white">
                    KBC
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2 text-[11.5px] text-ink-2/80">
                        <span className="font-medium tracking-wide uppercase">
                            KBC Mobile
                        </span>
                        <span className="shrink-0">now</span>
                    </div>
                    <div className="truncate text-[13.5px] font-semibold text-ink">
                        {push.title}
                    </div>
                    <div className="line-clamp-2 text-[13px] leading-snug text-ink/85">
                        {push.body}
                    </div>
                </div>
            </div>
        </button>
    );
}
