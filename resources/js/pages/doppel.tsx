import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ActionCard } from '@/components/doppel/action-card';
import { DiaryOpener, Timeline } from '@/components/doppel/diary';
import { ForkView } from '@/components/doppel/fork-view';
import { Kobe } from '@/components/doppel/kobe';
import { SignalsDrawer } from '@/components/doppel/signals-drawer';
import { DemoPanel, PhoneFrame } from '@/components/doppel/stage';
import type { Simulation } from '@/components/doppel/stage';
import { demoStates, personas } from '@/data/doppel-demo';
import type { DemoStateKey, PersonaKey } from '@/data/doppel-demo';
import { cn } from '@/lib/utils';
import type { Action, HomeProps, Prediction } from '@/types/doppel';

// Demo mode: everything runs on hardcoded data from @/data/doppel-demo.
// When the controller sends real HomeProps, they are used instead.
// TODO(BE): replace onPersona / simulate / dismiss with router.post calls.

const byDate = (a: Prediction, b: Prediction) =>
    a.expected_at.localeCompare(b.expected_at);

function actionsOf(
    data: HomeProps,
): { action: Action; prediction: Prediction }[] {
    const list = [...data.predictions]
        .sort(byDate)
        .flatMap((prediction) =>
            prediction.actions.map((action) => ({ action, prediction })),
        );

    // When Doppel goes quiet, only the human card is allowed.
    if (data.customer.mood === 'paused') {
        return list.filter(({ action }) => action.kind === 'human');
    }

    return list;
}

const karimSimulations: Simulation[] = [
    { key: 'karim_relieved', label: 'Client pays invoice €3,200' },
    { key: 'karim_paused', label: 'First buy-now-pay-later purchase' },
];

export default function Doppel(props: Partial<HomeProps>) {
    const [stateKey, setStateKey] = useState<DemoStateKey>('lotte');
    const [forkOn, setForkOn] = useState(false);
    const [dismissed, setDismissed] = useState<number[]>([]);
    const [leaving, setLeaving] = useState<number[]>([]);
    const [rewriting, setRewriting] = useState(false);
    const [openPrediction, setOpenPrediction] = useState<Prediction | null>(
        null,
    );

    const data: HomeProps = props.customer
        ? (props as HomeProps)
        : demoStates[stateKey];
    const { customer, fork, forkPredictions, push } = data;
    const persona: PersonaKey = stateKey.startsWith('karim')
        ? 'karim'
        : (stateKey as PersonaKey);
    const quiet = customer.mood === 'paused';
    const mood = rewriting ? 'thinking' : customer.mood;
    const predictions = [...data.predictions].sort(byDate);
    const cards = actionsOf(data).filter(
        ({ action }) => !dismissed.includes(action.id),
    );

    function reset(next: DemoStateKey) {
        setStateKey(next);
        setForkOn(false);
        setDismissed([]);
        setLeaving([]);
        setOpenPrediction(null);
    }

    function simulate(next: string) {
        const nextKey = next as DemoStateKey;
        const nextIds = actionsOf(demoStates[nextKey]).map(
            ({ action }) => action.id,
        );

        setOpenPrediction(null);
        setLeaving(
            cards
                .map(({ action }) => action.id)
                .filter((id) => !nextIds.includes(id)),
        );
        setRewriting(true);

        setTimeout(() => {
            setStateKey(nextKey);
            setLeaving([]);
            setRewriting(false);
        }, 1400);
    }

    function dismiss(action: Action) {
        setDismissed((ids) => [...ids, action.id]);
        toast("Thanks. Your Doppel won't make that mistake again.");
    }

    function notMe(prediction: Prediction) {
        setDismissed((ids) => [
            ...ids,
            ...prediction.actions.map((action) => action.id),
        ]);
        setOpenPrediction(null);
        toast('Got it. Doppel learns from your correction.');
    }

    const simulations =
        persona === 'karim'
            ? stateKey === 'karim'
                ? karimSimulations
                : [{ key: 'karim', label: 'Reset Karim' }]
            : [];

    return (
        <>
            <Head title="Doppel" />
            <main className="flex min-h-screen items-center justify-center gap-16 bg-doppel-paper px-8 py-8 font-sans">
                <div className="hidden lg:block">
                    <DemoPanel
                        personas={personas}
                        active={persona}
                        onPersona={(key) => reset(key)}
                        simulations={simulations}
                        onSimulate={simulate}
                        busy={rewriting}
                        push={push}
                        variant={customer.mascot_variant}
                    />
                </div>

                <PhoneFrame quiet={quiet}>
                    <div
                        key={persona}
                        className="h-full overflow-y-auto px-5 pt-12 pb-10"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-diary text-lg font-semibold text-doppel-navy">
                                Doppel
                            </span>
                            <span className="flex size-9 items-center justify-center rounded-full bg-doppel-navy text-sm font-semibold text-white">
                                {customer.name.charAt(0)}
                            </span>
                        </div>

                        <section className="mt-5 flex items-start gap-3">
                            <Kobe
                                variant={customer.mascot_variant}
                                mood={mood}
                                size={92}
                                className="shrink-0"
                            />
                            <div className="flex-1 pt-1">
                                <DiaryOpener
                                    key={persona}
                                    text={
                                        forkOn && fork
                                            ? fork.opener
                                            : customer.diary_opener
                                    }
                                />
                                {rewriting && (
                                    <p className="mt-2 animate-pulse text-xs font-medium text-doppel-sky">
                                        Living your month again…
                                    </p>
                                )}
                            </div>
                        </section>

                        {fork && forkPredictions && (
                            <button
                                type="button"
                                onClick={() => setForkOn((on) => !on)}
                                className={cn(
                                    'mt-5 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors',
                                    forkOn
                                        ? 'bg-doppel-navy text-white'
                                        : 'bg-white text-doppel-navy ring-1 ring-doppel-line hover:ring-doppel-sky',
                                )}
                            >
                                <span>{fork.label}</span>
                                <span
                                    className={cn(
                                        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                                        forkOn
                                            ? 'bg-doppel-sky'
                                            : 'bg-doppel-line',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-1 size-4 rounded-full bg-white transition-all',
                                            forkOn ? 'left-6' : 'left-1',
                                        )}
                                    />
                                </span>
                            </button>
                        )}

                        {quiet && (
                            <div className="mt-5 animate-in rounded-2xl bg-white p-4 text-sm leading-relaxed text-doppel-ink ring-1 ring-doppel-line fade-in">
                                <span className="font-semibold">
                                    Doppel stopped suggesting products.
                                </span>{' '}
                                Your month looks heavy, and that deserves a real
                                conversation, not an offer.
                            </div>
                        )}

                        {forkOn && fork && forkPredictions ? (
                            <section className="mt-6">
                                <ForkView
                                    fork={fork}
                                    variant={customer.mascot_variant}
                                    base={predictions}
                                    forked={[...forkPredictions].sort(byDate)}
                                    onChoose={(which) => {
                                        setForkOn(false);
                                        toast(
                                            which === 'fork'
                                                ? 'Nice. Your Doppel will live this version from now on.'
                                                : 'OK. Doppel keeps your current path.',
                                        );
                                    }}
                                />
                            </section>
                        ) : (
                            // When Doppel goes quiet, the human card moves to the top.
                            <div
                                className={cn(
                                    'flex flex-col',
                                    quiet && 'flex-col-reverse',
                                )}
                            >
                                <section className="mt-7">
                                    <h2 className="mb-2 text-xs font-semibold tracking-wide text-doppel-muted uppercase">
                                        What happened to Doppel
                                    </h2>
                                    <Timeline
                                        predictions={predictions}
                                        onOpen={setOpenPrediction}
                                        quiet={quiet}
                                    />
                                </section>

                                {cards.length > 0 && (
                                    <section className="mt-6 space-y-3">
                                        <h2 className="text-xs font-semibold tracking-wide text-doppel-muted uppercase">
                                            What you can do
                                        </h2>
                                        {cards.map(({ action, prediction }) => (
                                            <ActionCard
                                                key={action.id}
                                                action={action}
                                                leaving={leaving.includes(
                                                    action.id,
                                                )}
                                                onCta={() =>
                                                    toast(
                                                        `Demo: "${action.cta_label}" would open here.`,
                                                    )
                                                }
                                                onWhy={() =>
                                                    setOpenPrediction(
                                                        prediction,
                                                    )
                                                }
                                                onDismiss={() =>
                                                    dismiss(action)
                                                }
                                            />
                                        ))}
                                    </section>
                                )}
                            </div>
                        )}
                    </div>

                    <SignalsDrawer
                        prediction={openPrediction}
                        onClose={() => setOpenPrediction(null)}
                        onNotMe={notMe}
                    />
                </PhoneFrame>
            </main>
        </>
    );
}
