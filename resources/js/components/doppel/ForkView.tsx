import { router } from '@inertiajs/react';
import type { Scenario } from '@/components/doppel/types';
import { doppel } from '@/routes';
import { cn } from '@/lib/utils';

const scenarios: { value: Scenario; label: string; hint: string }[] = [
    {
        value: 'base',
        label: 'As it is',
        hint: 'This is how I lived your month.',
    },
    {
        value: 'save_100',
        label: 'Save €100/month',
        hint: 'Doppel putting €100 aside every month.',
    },
    {
        value: 'fixed_energy',
        label: 'Fixed energy contract',
        hint: 'Doppel with a fixed energy price.',
    },
];

/** "What if I…": the same month, with one choice made differently. */
export default function ForkView({ scenario }: { scenario: Scenario }) {
    const current = scenarios.find((s) => s.value === scenario) ?? scenarios[0];

    function pick(value: Scenario) {
        router.get(
            doppel.url({ query: value === 'base' ? {} : { scenario: value } }),
            {},
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <section className="px-5 pt-7">
            <h2 className="text-[18px] font-bold text-ink">What if I…</h2>
            <p className="mt-0.5 text-[13px] text-ink/55">{current.hint}</p>
            <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
                {scenarios.map((s) => (
                    <button
                        key={s.value}
                        type="button"
                        onClick={() => pick(s.value)}
                        className={cn(
                            'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors',
                            s.value === scenario
                                ? 'bg-ink text-white'
                                : 'bg-[#f4f6fa] text-ink/70 hover:bg-ink/8',
                        )}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </section>
    );
}
