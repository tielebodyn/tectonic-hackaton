import { Form } from '@inertiajs/react';
import { RotateCcw, Zap } from 'lucide-react';
import { login as demoLogin } from '@/routes/demo';
import { reset } from '@/routes/doppel';
import { cn } from '@/lib/utils';

const personas = [
    { key: 'lotte', label: 'Lotte' },
    { key: 'peeters', label: 'Peeters' },
    { key: 'karim', label: 'Karim' },
];

type Props = {
    personaKey: string | null;
    canSimulate: boolean;
    simulating: boolean;
    onSimulate: () => void;
};

/** Alleen in demo-modus. Zit buiten het telefoonframe. */
export default function DemoBar({
    personaKey,
    canSimulate,
    simulating,
    onSimulate,
}: Props) {
    return (
        <div className="sticky top-0 z-40 flex w-full items-center justify-center gap-2 bg-ink px-3 py-2 text-white sm:static sm:mb-5 sm:rounded-full sm:bg-ink/90">
            <span className="hidden text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase sm:inline">
                Demo
            </span>
            <div className="flex rounded-full border border-white/15 p-0.5">
                {personas.map((p) => (
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
            </div>
            {canSimulate && (
                <button
                    type="button"
                    onClick={onSimulate}
                    disabled={simulating}
                    className="flex items-center gap-1 rounded-full bg-kbc px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-kbc/80 disabled:opacity-50"
                >
                    <Zap className="size-3.5" />
                    Simuleer transactie
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
