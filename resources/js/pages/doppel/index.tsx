import { Head } from '@inertiajs/react';
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

    return (
        <div className="doppel min-h-dvh bg-paper text-ink sm:bg-ink sm:px-4 sm:py-8">
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
                className="relative mx-auto w-full max-w-[390px] overflow-hidden bg-paper sm:min-h-[820px] sm:rounded-frame sm:border sm:border-paper/10"
                style={{ '--mood': moodColor[mood] } as React.CSSProperties}
            >
                {/* mood-gradiënt achter Doppel, ±20% */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[420px] transition-[background] duration-700"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 55% at 50% 30%, color-mix(in oklab, var(--mood) 24%, transparent), transparent 75%)',
                    }}
                />

                <header className="relative flex items-start justify-between gap-4 px-6 pt-6">
                    <span className="font-display text-xl tracking-tight">
                        Doppel
                    </span>
                    <span className="flex flex-col items-end text-right text-xs leading-snug text-ink/55">
                        <span className="font-medium text-ink/80">
                            {customer.name}
                        </span>
                        <span>{customer.lifeStage}</span>
                    </span>
                </header>

                <section className="relative flex flex-col items-center px-6 pt-4">
                    <Doppel mood={mood} variant={customer.variant} size={190} />
                    <div className="mt-2 w-full">
                        <SpeechBubble
                            text={customer.opener}
                            thinking={mood === 'thinking' && simulating}
                        />
                    </div>
                </section>

                {/* TODO: DiaryCard-tijdlijn, ActionCards, ForkView, PushPreview volgen. */}
                <div className="h-24" />
            </main>
        </div>
    );
}
