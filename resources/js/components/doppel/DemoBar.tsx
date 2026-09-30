import { Link } from '@inertiajs/react';
import type { DoppelPersona } from '@/types/doppel';
import { demo } from '@/routes/doppel';
import { cn } from '@/lib/utils';

const personas: { key: DoppelPersona; label: string }[] = [
    { key: 'lotte', label: 'Lotte' },
    { key: 'peeters', label: 'Peeters' },
    { key: 'karim', label: 'Karim' },
];

type Props = {
    persona: DoppelPersona;
    simulating: boolean;
    onSimulate: () => void;
};

/** Alleen zichtbaar op de demo-route. Zit buiten het telefoonframe. */
export default function DemoBar({ persona, simulating, onSimulate }: Props) {
    const active = persona === 'karim-after' ? 'karim' : persona;

    return (
        <div className="sticky top-0 z-40 flex w-full items-center justify-center gap-2 bg-ink/95 px-3 py-2 text-paper backdrop-blur sm:static sm:mb-6 sm:bg-transparent sm:backdrop-blur-none">
            <span className="mr-1 hidden text-[11px] font-medium tracking-[0.18em] text-paper/50 uppercase sm:inline">
                Demo
            </span>
            <div className="flex rounded-full border border-paper/15 p-0.5">
                {personas.map((p) => (
                    <Link
                        key={p.key}
                        href={demo({ query: { persona: p.key } })}
                        preserveScroll
                        className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                            active === p.key
                                ? 'bg-paper text-ink'
                                : 'text-paper/70 hover:text-paper',
                        )}
                    >
                        {p.label}
                    </Link>
                ))}
            </div>
            <button
                type="button"
                onClick={onSimulate}
                disabled={simulating}
                className="rounded-full border border-kbc bg-kbc/15 px-3 py-1 text-xs font-medium text-paper transition-colors hover:bg-kbc/30 disabled:opacity-50"
            >
                Simuleer transactie
            </button>
        </div>
    );
}
