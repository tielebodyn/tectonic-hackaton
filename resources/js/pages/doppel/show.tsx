import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, Home, Sparkles, User, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DemoBar from '@/components/doppel/DemoBar';
import DiaryCard from '@/components/doppel/DiaryCard';
import Doppel from '@/components/doppel/Doppel';
import ForkView from '@/components/doppel/ForkView';
import SpeechBubble from '@/components/doppel/SpeechBubble';
import WhyDrawer from '@/components/doppel/WhyDrawer';
import type { Card, FaceMood, ShowProps } from '@/components/doppel/types';
import { euro, faceFor, shortDate } from '@/components/doppel/types';
import { events, feedback } from '@/routes/doppel';

const moodColor: Record<FaceMood, string> = {
    relaxed: 'var(--color-mood-relaxed)',
    thinking: 'var(--color-mood-thinking)',
    worried: 'var(--color-mood-worried)',
    relieved: 'var(--color-mood-relieved)',
    paused: 'var(--color-mood-paused)',
};

const moodLabel: Record<FaceMood, string> = {
    relaxed: 'Alles rustig',
    thinking: 'Aan het nadenken',
    worried: 'Maakt zich zorgen',
    relieved: 'Opgelucht',
    paused: 'Even gepauzeerd',
};

const tabs = [
    { icon: Home, label: 'Home', active: true },
    { icon: BookOpen, label: 'Dagboek', active: false },
    { icon: Sparkles, label: 'Acties', active: false },
    { icon: User, label: 'Profiel', active: false },
];

export default function DoppelShow(props: ShowProps) {
    const { customer, balance_cents, today, scenario, opener, cards, demo } =
        props;
    const { flash } = usePage<{ flash: { status: string | null } }>().props;

    const [phase, setPhase] = useState<'idle' | 'banner' | 'thinking'>('idle');
    const [whyCard, setWhyCard] = useState<Card | null>(null);
    const [whyOpen, setWhyOpen] = useState(false);
    const [leaving, setLeaving] = useState<number | null>(null);
    const [hidden, setHidden] = useState<number[]>([]);
    const [nod, setNod] = useState(false);
    const [note, setNote] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.status) toast(flash.status);
    }, [flash?.status]);

    const mood: FaceMood =
        phase === 'thinking' ? 'thinking' : faceFor[customer.mood];
    const firstName = customer.display_name.split(' ')[0];
    const visibleCards = cards.filter(
        (c) => c.id === null || !hidden.includes(c.id),
    );
    const impact = cards.reduce(
        (sum, c) => sum + Math.min(0, c.impact_cents ?? 0),
        0,
    );

    // Demomoment: banner binnen, Doppel denkt, dan de nieuwe staat via de backend.
    function simulateTransaction() {
        setPhase('banner');
        window.setTimeout(() => setPhase('thinking'), 500);
        window.setTimeout(() => {
            router.post(
                events.url('karim_invoice_paid'),
                {},
                { preserveScroll: true, onFinish: () => setPhase('idle') },
            );
        }, 1500);
    }

    function openWhy(card: Card) {
        setWhyCard(card);
        setWhyOpen(true);
    }

    // "Zo ben ik niet": kaart schrompelt, Doppel knikt, één regel, dan de post.
    function dismiss(card: Card) {
        if (card.id === null) return;
        const id = card.id;
        setWhyOpen(false);
        setLeaving(id);
        setNod(true);
        window.setTimeout(() => {
            setLeaving(null);
            setHidden((h) => [...h, id]);
            setNod(false);
            setNote('Oké, geschrapt.');
            router.post(
                feedback.url(),
                { prediction_id: id },
                {
                    preserveScroll: true,
                    onFinish: () => setHidden((h) => h.filter((x) => x !== id)),
                },
            );
            window.setTimeout(() => setNote(null), 2500);
        }, 380);
    }

    return (
        <div className="doppel min-h-dvh bg-[#eef1f6] text-ink sm:px-4 sm:py-6">
            <Head title="Mijn Doppel" />

            {demo.enabled && (
                <DemoBar
                    personaKey={customer.persona_key}
                    canSimulate={
                        customer.persona_key === 'karim' &&
                        demo.events.includes('karim_invoice_paid')
                    }
                    simulating={phase !== 'idle'}
                    onSimulate={simulateTransaction}
                />
            )}

            {/* Telefoonframe: full-bleed op mobiel, 390px gecentreerd op groter scherm. */}
            <main
                className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-white sm:min-h-[844px] sm:rounded-[40px] sm:border sm:border-ink/6 sm:shadow-[0_30px_80px_rgba(11,31,58,0.18)]"
                style={{ '--mood': moodColor[mood] } as React.CSSProperties}
            >
                {/* zachte pastelvlekken bovenaan */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60 blur-3xl transition-[background] duration-700"
                    style={{
                        background:
                            'radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--mood) 55%, white), transparent 55%), radial-gradient(circle at 85% 20%, rgb(0 163 224 / 0.25), transparent 50%)',
                    }}
                />

                {/* transactiebanner */}
                {phase !== 'idle' && (
                    <div className="absolute inset-x-5 top-4 z-30 flex animate-doppel-banner items-center gap-3 rounded-2xl bg-ink p-3 text-white shadow-lg">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">
                            <Wallet className="size-4" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[14px] font-bold">
                                €3.200 ontvangen
                            </span>
                            <span className="block truncate text-[12px] text-white/60">
                                van Brouwerij De Leie · Factuur betaald
                            </span>
                        </span>
                    </div>
                )}

                <header className="relative z-10 flex items-center gap-3 px-5 pt-6">
                    <div
                        className={`grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-kbc/10 ${nod ? 'animate-doppel-nod' : ''}`}
                    >
                        <Doppel
                            mood={mood}
                            variant={customer.mascot_variant}
                            size={40}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-[20px] leading-tight font-bold tracking-tight">
                            Hey {firstName}
                        </h1>
                        <p className="truncate text-[13px] text-ink/50">
                            {note ??
                                `${customer.age}, ${customer.city} · Welkom bij Doppel`}
                        </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f4f6fa] px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap">
                        <span
                            className="size-2 rounded-full transition-colors duration-700"
                            style={{ background: 'var(--mood)' }}
                        />
                        {moodLabel[mood]}
                    </span>
                </header>

                {/* dagboekkaart met Doppel */}
                <section className="relative z-10 px-5 pt-5">
                    <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b1f3a,#163a6b)] p-5 text-white">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -right-6 -bottom-10 size-56 rounded-full opacity-50 blur-2xl transition-[background] duration-700"
                            style={{ background: 'var(--mood)' }}
                        />
                        <p className="text-[11px] font-semibold tracking-[0.16em] text-white/55 uppercase">
                            Mijn dagboek · {shortDate(today)}
                        </p>
                        <div className="mt-3 flex items-end gap-2">
                            <SpeechBubble
                                text={opener}
                                thinking={phase === 'thinking'}
                                onDark
                                className="relative z-10 flex-1 pb-4"
                            />
                            <div
                                className={`-mr-2 -mb-3 shrink-0 ${nod ? 'animate-doppel-nod' : ''}`}
                            >
                                <Doppel
                                    mood={mood}
                                    variant={customer.mascot_variant}
                                    size={120}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* cijfers */}
                <section className="relative z-10 grid grid-cols-2 gap-3 px-5 pt-4">
                    <div className="rounded-[22px] bg-[#f4f6fa] p-4">
                        <p className="text-[22px] font-bold tracking-tight">
                            {euro(balance_cents)}
                        </p>
                        <p className="text-[12px] text-ink/50">Saldo vandaag</p>
                    </div>
                    <div className="rounded-[22px] bg-[#f4f6fa] p-4">
                        <p className="text-[22px] font-bold tracking-tight">
                            {impact < 0
                                ? euro(impact)
                                : `${visibleCards.length}`}
                        </p>
                        <p className="text-[12px] text-ink/50">
                            {impact < 0
                                ? 'Verwachte impact'
                                : 'Dingen die ik zag'}
                        </p>
                    </div>
                </section>

                <ForkView scenario={scenario} />

                {/* dagboekkaarten */}
                <section className="relative z-10 px-5 pt-7 pb-6">
                    <h2 className="text-[18px] font-bold">Wat ik zag</h2>
                    <p className="mt-0.5 text-[13px] text-ink/55">
                        Van dichtbij naar verder weg. Tik op een kaart voor het
                        waarom.
                    </p>
                    {visibleCards.length === 0 ? (
                        <div className="mt-4 rounded-[24px] bg-emerald-50 p-6 text-center">
                            <p className="text-[20px] leading-snug font-bold">
                                Ik heb je maand geleefd. Niets om je zorgen over
                                te maken.
                            </p>
                        </div>
                    ) : (
                        <div
                            key={`${scenario}-${cards.map((c) => c.id ?? c.rule_key).join('.')}`}
                            className="mt-4 flex flex-col gap-3"
                        >
                            {visibleCards.map((card, i) => (
                                <DiaryCard
                                    key={`${card.rule_key}-${card.id}`}
                                    card={card}
                                    index={i}
                                    mood={mood}
                                    leaving={
                                        leaving !== null && leaving === card.id
                                    }
                                    onWhy={openWhy}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex-1" />

                {/* tab-balk (decoratief) */}
                <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-ink/6 bg-white/90 px-2 pt-3 pb-5 backdrop-blur-xl">
                    {tabs.map(({ icon: Icon, label, active }) => (
                        <span
                            key={label}
                            className={
                                active
                                    ? 'flex flex-col items-center gap-1 text-[11px] font-semibold text-ink'
                                    : 'flex flex-col items-center gap-1 text-[11px] font-medium text-ink/40'
                            }
                        >
                            <Icon className="size-5" />
                            {label}
                        </span>
                    ))}
                </nav>
            </main>

            <WhyDrawer
                card={whyCard}
                open={whyOpen}
                onOpenChange={setWhyOpen}
                onDismiss={dismiss}
            />
        </div>
    );
}
