import { Head } from '@inertiajs/react';
import { BookOpen, ChevronRight, Home, Sparkles, User } from 'lucide-react';
import { useState } from 'react';
import DemoBar from '@/components/doppel/DemoBar';
import Doppel from '@/components/doppel/Doppel';
import SpeechBubble from '@/components/doppel/SpeechBubble';
import type { DoppelDemoInfo, DoppelPageProps, Mood } from '@/types/doppel';

type Props = DoppelPageProps & {
    /** Alleen op /doppel-demo; de echte controller stuurt dit niet mee. */
    demo?: DoppelDemoInfo;
};

const moodColor: Record<Mood, string> = {
    relaxed: 'var(--color-mood-relaxed)',
    thinking: 'var(--color-mood-thinking)',
    worried: 'var(--color-mood-worried)',
    relieved: 'var(--color-mood-relieved)',
    paused: 'var(--color-mood-paused)',
};

const moodLabel: Record<Mood, string> = {
    relaxed: 'Alles rustig',
    thinking: 'Aan het nadenken',
    worried: 'Lichte zorgen',
    relieved: 'Opgelucht',
    paused: 'Even gepauzeerd',
};

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Goeiemorgen';
    if (h < 18) return 'Goeiemiddag';
    return 'Goeieavond';
}

export default function DoppelIndex(props: Props) {
    const { customer, demo } = props;
    const [mood, setMood] = useState<Mood>(customer.mood);
    const [simulating, setSimulating] = useState(false);

    // TODO(live event): wordt in de stap "live event" vervangen door banner + POST.
    function simulateTransaction() {
        setSimulating(true);
        setMood('thinking');
        window.setTimeout(() => {
            setMood(customer.mood);
            setSimulating(false);
        }, 1800);
    }

    const firstName = customer.name.replace(/^Familie /, '');

    return (
        <div className="doppel bg-night min-h-dvh text-white sm:px-4 sm:py-8">
            <Head title="Doppel" />

            {demo && (
                <DemoBar
                    persona={demo.persona}
                    simulating={simulating}
                    onSimulate={simulateTransaction}
                />
            )}

            {/* Telefoonframe: full-bleed op mobiel, 390px gecentreerd op groter scherm. */}
            <main
                className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-[linear-gradient(180deg,#1a2b5c_0%,#0d1735_45%,#070b1a_100%)] sm:min-h-[844px] sm:rounded-[40px] sm:border sm:border-white/10 sm:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                style={{ '--mood': moodColor[mood] } as React.CSSProperties}
            >
                {/* header */}
                <header className="relative z-10 flex items-center gap-3 px-5 pt-6">
                    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-kbc/70 bg-white/5">
                        <Doppel
                            mood={mood}
                            variant={customer.variant}
                            size={38}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-[22px] leading-tight font-bold tracking-tight">
                            {greeting()}, {firstName}!
                        </h1>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap">
                        <span
                            className="size-2 rounded-full transition-colors duration-700"
                            style={{ background: 'var(--mood)' }}
                        />
                        {moodLabel[mood]}
                    </span>
                </header>

                {/* hero: gloed + buddy + bubbel */}
                <section className="relative h-[400px]">
                    <div
                        aria-hidden
                        className="absolute inset-x-6 top-16 bottom-4 rounded-full opacity-55 blur-3xl transition-[background] duration-700"
                        style={{
                            background:
                                'radial-gradient(circle at 50% 70%, var(--mood), transparent 68%)',
                        }}
                    />
                    <SpeechBubble
                        text={customer.opener}
                        thinking={mood === 'thinking' && simulating}
                        className="absolute top-3 right-4 left-[38%] z-10"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-center">
                        <Doppel
                            mood={mood}
                            variant={customer.variant}
                            size={250}
                        />
                    </div>
                </section>

                {/* CTA */}
                <div className="relative z-10 px-5">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#2b7fff,#00a3e0)] px-6 py-4 text-[17px] font-bold text-white shadow-[0_12px_40px_rgba(0,163,224,0.35)] transition-transform active:scale-[0.98]"
                    >
                        Laat Doppel het proberen
                        <span className="grid size-7 place-items-center rounded-full bg-white/20">
                            <ChevronRight className="size-4" />
                        </span>
                    </button>
                </div>

                {/* TODO: DiaryCard-tijdlijn, ActionCards, ForkView, PushPreview volgen. */}
                <section className="px-5 pt-8">
                    <h2 className="text-lg font-bold">Wat ik zag in oktober</h2>
                    <p className="mt-1 text-sm text-white/55">
                        {customer.summary}
                    </p>
                </section>

                <div className="flex-1" />

                {/* tab-balk (decoratief) */}
                <nav className="sticky bottom-0 z-20 mx-3 mb-3 flex items-center justify-around rounded-[28px] border border-white/10 bg-[#0f1a3a]/80 px-2 py-3 backdrop-blur-xl">
                    {[
                        { icon: Home, label: 'Home', active: true },
                        { icon: BookOpen, label: 'Dagboek', active: false },
                        { icon: Sparkles, label: 'Acties', active: false },
                        { icon: User, label: 'Profiel', active: false },
                    ].map(({ icon: Icon, label, active }) => (
                        <span
                            key={label}
                            className={
                                active
                                    ? 'flex flex-col items-center gap-1 text-[11px] font-semibold text-kbc'
                                    : 'flex flex-col items-center gap-1 text-[11px] font-medium text-white/45'
                            }
                        >
                            <Icon className="size-5" />
                            {label}
                        </span>
                    ))}
                </nav>
            </main>
        </div>
    );
}
