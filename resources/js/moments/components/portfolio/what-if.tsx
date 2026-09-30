import { Banknote, Scissors, ShoppingBag, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { MONTHS, short } from '../../data/portfolio';
import type { Extra, Scenario } from '../../data/portfolio';
import { cn } from '@/lib/utils';

function Switch({ on }: { on: boolean }) {
    return (
        <span
            className={cn(
                'relative inline-flex h-6 w-10 shrink-0 rounded-full transition-colors duration-200',
                on ? 'bg-kbc-navy' : 'bg-line',
            )}
        >
            <span
                className={cn(
                    'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200',
                    on && 'translate-x-4',
                )}
            />
        </span>
    );
}

function Row({
    icon,
    title,
    hint,
    on,
    onToggle,
    children,
}: {
    icon: ReactNode;
    title: string;
    hint: string;
    on: boolean;
    onToggle?: () => void;
    children?: ReactNode;
}) {
    const Head = onToggle ? 'button' : 'div';

    return (
        <div
            className={cn(
                'rounded-2xl border p-4 transition-colors duration-200',
                on
                    ? 'border-kbc-navy/25 bg-kbc-navy/[0.03]'
                    : 'border-line bg-white',
            )}
        >
            <Head
                onClick={onToggle}
                className="flex w-full items-center gap-3 text-left"
            >
                <span
                    className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                        on ? 'bg-kbc-navy text-white' : 'bg-mist text-ink-2',
                    )}
                >
                    {icon}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[14px] leading-tight font-semibold text-ink">
                        {title}
                    </span>
                    <span className="text-ink-3 mt-0.5 block text-[12px]">
                        {hint}
                    </span>
                </span>
                {onToggle && <Switch on={on} />}
            </Head>
            {children && <div className="mt-3">{children}</div>}
        </div>
    );
}

function Segmented<T extends string | number>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className="bg-mist flex rounded-xl p-1 text-[13px] font-medium">
            {options.map((o) => (
                <button
                    key={o.value}
                    onClick={() => onChange(o.value)}
                    className={cn(
                        'flex-1 rounded-lg px-2 py-1.5 tabular-nums transition-all',
                        o.value === value
                            ? 'text-kbc-navy bg-white shadow-sm'
                            : 'text-ink-2 hover:text-ink',
                    )}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export function WhatIf({
    scenario,
    onChange,
    saveSteps,
    purchase,
    extra,
}: {
    scenario: Scenario;
    onChange: (s: Scenario) => void;
    saveSteps: number[];
    purchase: number;
    extra: Extra;
}) {
    const set = (patch: Partial<Scenario>) =>
        onChange({ ...scenario, ...patch });

    return (
        <div className="space-y-3">
            <Row
                icon={<Banknote className="size-4" />}
                title="Spend a little less"
                hint="Every month, starting in October"
                on={scenario.saveStep > 0}
            >
                <Segmented
                    value={scenario.saveStep}
                    onChange={(v) => set({ saveStep: v })}
                    options={saveSteps.map((s, i) => ({
                        value: i,
                        label: i === 0 ? 'As now' : short(s),
                    }))}
                />
            </Row>

            <Row
                icon={<ShoppingBag className="size-4" />}
                title={`A big purchase of ${short(purchase)}`}
                hint="A car repair, a new kitchen, a trip"
                on={scenario.purchase}
                onToggle={() => set({ purchase: !scenario.purchase })}
            >
                {scenario.purchase && (
                    <Segmented
                        value={scenario.purchaseMonth}
                        onChange={(v) => set({ purchaseMonth: v })}
                        options={[3, 6, 9].map((m) => ({
                            value: m,
                            label: `In ${MONTHS[m - 1]}`,
                        }))}
                    />
                )}
            </Row>

            <Row
                icon={<TrendingDown className="size-4" />}
                title="Your income drops 20%"
                hint="From January, e.g. going part-time"
                on={scenario.incomeDrop}
                onToggle={() => set({ incomeDrop: !scenario.incomeDrop })}
            />

            <Row
                icon={<Scissors className="size-4" />}
                title={extra.label}
                hint={extra.hint}
                on={scenario.extra}
                onToggle={() => set({ extra: !scenario.extra })}
            />
        </div>
    );
}
