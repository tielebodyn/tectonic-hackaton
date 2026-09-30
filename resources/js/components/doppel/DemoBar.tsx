import { Form } from '@inertiajs/react';
import { Check, ChevronDown, RotateCcw, Zap } from 'lucide-react';
import { useState } from 'react';
import type { DemoPersona } from '@/components/doppel/types';
import { login as demoLogin } from '@/routes/demo';
import { reset } from '@/routes/doppel';
import { cn } from '@/lib/utils';

const featured = [
    { key: 'lotte', label: 'Lotte' },
    { key: 'peeters', label: 'Peeters' },
    { key: 'karim', label: 'Karim' },
];

type Props = {
    personaKey: string | null;
    personas?: DemoPersona[];
    canSimulate: boolean;
    simulating: boolean;
    onSimulate: () => void;
};

/** Alleen in demo-modus. Zit buiten het telefoonframe. */
export default function DemoBar({
    personaKey,
    personas = [],
    canSimulate,
    simulating,
    onSimulate,
}: Props) {
    const [moreOpen, setMoreOpen] = useState(false);
    const others = personas.filter(
        (p) => !featured.some((f) => f.key === p.key),
    );
    const activeOther = others.find((p) => p.key === personaKey);

    return (
        <div className="sticky top-0 z-40 flex w-full items-center justify-center gap-2 bg-ink px-3 py-2 text-white sm:static sm:mb-4 sm:w-auto sm:shrink-0 sm:self-center sm:rounded-full sm:bg-ink/90">
            <span className="hidden text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase sm:inline">
                Demo
            </span>
            <div className="flex rounded-full border border-white/15 p-0.5">
                {featured.map((p) => (
                    <Form key={p.key} {...demoLogin.form(p.key)}>
                        <button
                            type="submit"
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                                personaKey === p.key
                                    ? 'bg-white text-ink'
                                    : 'text-white/70 hover:text-white',
                            )}
                        >
                            {p.label}
                        </button>
                    </Form>
                ))}
                {others.length > 0 && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMoreOpen((o) => !o)}
                            aria-expanded={moreOpen}
                            className={cn(
                                'flex items-center gap-0.5 rounded-full py-1 pr-2 pl-3 text-xs font-semibold transition-colors',
                                activeOther
                                    ? 'bg-white text-ink'
                                    : 'text-white/70 hover:text-white',
                            )}
                        >
                            {activeOther
                                ? activeOther.label.split(' ')[0]
                                : 'Meer'}
                            <ChevronDown
                                className={cn(
                                    'size-3.5 transition-transform',
                                    moreOpen && 'rotate-180',
                                )}
                            />
                        </button>
                        {moreOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Sluiten"
                                    onClick={() => setMoreOpen(false)}
                                    className="fixed inset-0 z-40 cursor-default"
                                />
                                <div className="absolute top-full right-0 z-50 mt-2 max-h-[60dvh] w-48 overflow-y-auto rounded-2xl bg-ink p-1 shadow-[0_12px_40px_rgba(11,31,58,0.35)] ring-1 ring-white/10">
                                    {others.map((p) => (
                                        <Form
                                            key={p.key}
                                            {...demoLogin.form(p.key)}
                                        >
                                            <button
                                                type="submit"
                                                className={cn(
                                                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors',
                                                    personaKey === p.key
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white',
                                                )}
                                            >
                                                {p.label}
                                                {personaKey === p.key && (
                                                    <Check className="size-3.5 text-kbc" />
                                                )}
                                            </button>
                                        </Form>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            {canSimulate && (
                <button
                    type="button"
                    onClick={onSimulate}
                    disabled={simulating}
                    title="Simuleer transactie"
                    className="flex items-center gap-1 rounded-full bg-kbc px-2 py-1 text-xs font-semibold whitespace-nowrap text-white transition-colors hover:bg-kbc/80 disabled:opacity-50 sm:px-3"
                >
                    <Zap className="size-3.5" />
                    <span className="sr-only sm:not-sr-only">
                        Simuleer transactie
                    </span>
                </button>
            )}
            <Form {...reset.form()} options={{ preserveScroll: true }}>
                <button
                    type="submit"
                    title="Demo terugzetten"
                    className="grid size-7 place-items-center rounded-full border border-white/15 text-white/70 hover:text-white"
                >
                    <RotateCcw className="size-3.5" />
                </button>
            </Form>
        </div>
    );
}
