import type { ReactNode } from 'react';
import { Kobe } from '@/components/doppel/kobe';
import type { PersonaKey } from '@/data/doppel-demo';
import { cn } from '@/lib/utils';
import type { MascotVariant, PushMessage } from '@/types/doppel';

export function PhoneFrame({
    children,
    quiet = false,
}: {
    children: ReactNode;
    quiet?: boolean;
}) {
    return (
        <div className="relative h-[820px] w-[400px] shrink-0 overflow-hidden rounded-[52px] border-[12px] border-doppel-ink bg-doppel-ink shadow-2xl">
            <div className="absolute top-2 left-1/2 z-40 h-7 w-28 -translate-x-1/2 rounded-full bg-doppel-ink" />
            <div
                className={cn(
                    'relative h-full overflow-hidden rounded-[40px] transition-colors duration-700',
                    quiet ? 'bg-slate-100' : 'bg-doppel-paper',
                )}
            >
                {children}
            </div>
        </div>
    );
}

export function PushPreview({
    push,
    variant,
}: {
    push: PushMessage;
    variant: MascotVariant;
}) {
    return (
        <div
            key={push.title}
            className="flex animate-in gap-3 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur duration-500 fade-in slide-in-from-top-2"
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-doppel-navy">
                <Kobe
                    variant={variant}
                    mood="neutral"
                    size={34}
                    className="animate-none"
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs text-doppel-muted">
                    <span className="font-semibold tracking-wide uppercase">
                        Doppel
                    </span>
                    <span>now</span>
                </div>
                <p className="text-sm font-semibold text-doppel-ink">
                    {push.title}
                </p>
                <p className="text-sm text-doppel-muted">{push.body}</p>
            </div>
        </div>
    );
}

export type Simulation = { key: string; label: string };

type DemoPanelProps = {
    personas: { key: PersonaKey; label: string; hint: string }[];
    active: PersonaKey;
    onPersona: (key: PersonaKey) => void;
    simulations: Simulation[];
    onSimulate: (key: string) => void;
    busy: boolean;
    push: PushMessage;
    variant: MascotVariant;
};

export function DemoPanel({
    personas,
    active,
    onPersona,
    simulations,
    onSimulate,
    busy,
    push,
    variant,
}: DemoPanelProps) {
    return (
        <aside className="flex w-full max-w-[440px] flex-col gap-8">
            <header>
                <div className="flex items-center gap-3">
                    <Kobe variant={variant} mood="neutral" size={56} />
                    <div>
                        <h1 className="font-diary text-4xl font-semibold text-doppel-navy">
                            Doppel
                        </h1>
                        <p className="text-sm font-medium tracking-wide text-doppel-muted uppercase">
                            A KBC concept
                        </p>
                    </div>
                </div>
                <p className="mt-4 font-diary text-2xl leading-snug text-doppel-ink italic">
                    Every banking app shows your past. At KBC, your double is
                    already living your future.
                </p>
            </header>

            <section>
                <p className="mb-2 text-xs font-semibold tracking-wide text-doppel-muted uppercase">
                    Log in as
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {personas.map((persona) => (
                        <button
                            key={persona.key}
                            type="button"
                            onClick={() => onPersona(persona.key)}
                            className={cn(
                                'rounded-xl border px-3 py-2.5 text-left transition-colors',
                                active === persona.key
                                    ? 'border-doppel-navy bg-doppel-navy text-white'
                                    : 'border-doppel-line bg-white text-doppel-ink hover:border-doppel-navy',
                            )}
                        >
                            <span className="block text-sm font-semibold">
                                {persona.label}
                            </span>
                            <span
                                className={cn(
                                    'block text-xs',
                                    active === persona.key
                                        ? 'text-white/70'
                                        : 'text-doppel-muted',
                                )}
                            >
                                {persona.hint}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {simulations.length > 0 && (
                <section>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-doppel-muted uppercase">
                        Simulate transaction
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {simulations.map((simulation) => (
                            <button
                                key={simulation.key}
                                type="button"
                                disabled={busy}
                                onClick={() => onSimulate(simulation.key)}
                                className="rounded-full border border-doppel-sky bg-doppel-sky-soft px-4 py-2 text-sm font-semibold text-doppel-navy transition-colors hover:bg-doppel-sky hover:text-white disabled:opacity-50"
                            >
                                {simulation.label}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <p className="mb-2 text-xs font-semibold tracking-wide text-doppel-muted uppercase">
                    One diary, every channel
                </p>
                <PushPreview push={push} variant={variant} />
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-doppel-muted">
                    {['KBC Mobile', 'Push', 'Kate', 'Advisor'].map(
                        (channel) => (
                            <span
                                key={channel}
                                className="rounded-full bg-white px-3 py-1 ring-1 ring-doppel-line"
                            >
                                {channel}
                            </span>
                        ),
                    )}
                </div>
            </section>

            <section className="rounded-2xl bg-doppel-navy p-5 text-white">
                <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
                    KBC view
                </p>
                <p className="mt-1 text-lg leading-snug font-semibold">
                    12,400 doubles are about to face their first winter after a
                    move.
                </p>
                <p className="mt-2 text-sm text-white/70">
                    Rules run in batch for 2.3 million customers. AI only writes
                    Doppel's words, and only when something changes.
                </p>
            </section>
        </aside>
    );
}
