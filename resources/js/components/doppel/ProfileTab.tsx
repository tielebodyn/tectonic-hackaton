import { Form } from '@inertiajs/react';
import {
    Eye,
    LogOut,
    PauseCircle,
    RotateCcw,
    ShieldCheck,
    Smartphone,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import Doppel from '@/components/doppel/Doppel';
import type { FaceMood, ShowCustomer } from '@/components/doppel/types';
import { euro } from '@/components/doppel/types';
import { logout } from '@/routes';
import { reset } from '@/routes/doppel';
import { cn } from '@/lib/utils';

const lifeStage: Record<string, string> = {
    starter: 'Starter',
    moving: 'Mover',
    self_employed: 'Self-employed',
};

type Consent = {
    key: string;
    icon: typeof Wallet;
    title: string;
    body: string;
    on: boolean;
};

const initialConsents: Consent[] = [
    {
        key: 'tx',
        icon: Wallet,
        title: 'Read transactions',
        body: "Only your own KBC accounts, never anyone else's.",
        on: true,
    },
    {
        key: 'pattern',
        icon: Eye,
        title: 'Recognise patterns',
        body: 'Fixed costs, subscriptions and recurring income.',
        on: true,
    },
    {
        key: 'app',
        icon: Smartphone,
        title: 'App behaviour',
        body: 'What you open and search in the app, nothing outside it.',
        on: false,
    },
    {
        key: 'share',
        icon: ShieldCheck,
        title: 'Share diary with an adviser',
        body: 'Only after your explicit yes, each time.',
        on: false,
    },
];

function Toggle({
    on,
    onChange,
}: {
    on: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on)}
            className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                on ? 'bg-kbc' : 'bg-ink/15',
            )}
        >
            <span
                className={cn(
                    'absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform',
                    on && 'translate-x-5',
                )}
            />
        </button>
    );
}

/** Profile: who Doppel is doubling, what he may see, and the brake. */
export default function ProfileTab({
    customer,
    mood,
    balanceCents,
    demo,
}: {
    customer: ShowCustomer;
    mood: FaceMood;
    balanceCents: number;
    demo: boolean;
}) {
    const [consents, setConsents] = useState(initialConsents);
    const [pausedLocal, setPausedLocal] = useState(false);

    return (
        <section className="px-5 pt-6 pb-6">
            <div className="flex items-center gap-4 rounded-[28px] bg-[#f4f6fa] p-4">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white">
                    <Doppel
                        mood={pausedLocal ? 'paused' : mood}
                        variant={customer.mascot_variant}
                        size={72}
                    />
                </div>
                <div className="min-w-0">
                    <h2 className="text-[20px] leading-tight font-bold">
                        {customer.display_name}
                    </h2>
                    <p className="text-[13px] text-ink/55">
                        {customer.age} years · {customer.city} ·{' '}
                        {lifeStage[customer.life_stage] ?? customer.life_stage}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-ink">
                        Balance {euro(balanceCents)}
                    </p>
                </div>
            </div>

            <h3 className="mt-7 text-[15px] font-bold">What Doppel can see</h3>
            <p className="text-[12px] text-ink/50">
                You decide. Switching off works instantly.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
                {consents.map((c) => {
                    const Icon = c.icon;
                    return (
                        <li
                            key={c.key}
                            className="flex items-center gap-3 rounded-2xl bg-[#f4f6fa] p-3"
                        >
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-kbc">
                                <Icon className="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[14px] leading-tight font-semibold">
                                    {c.title}
                                </span>
                                <span className="block text-[12px] leading-snug text-ink/55">
                                    {c.body}
                                </span>
                            </span>
                            <Toggle
                                on={c.on}
                                onChange={(v) =>
                                    setConsents((all) =>
                                        all.map((x) =>
                                            x.key === c.key
                                                ? { ...x, on: v }
                                                : x,
                                        ),
                                    )
                                }
                            />
                        </li>
                    );
                })}
            </ul>

            <div className="mt-6 rounded-[24px] border border-ink/8 p-4">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f4f6fa] text-ink/70">
                        <PauseCircle className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold">
                            Pause Doppel
                        </span>
                        <span className="block text-[12px] text-ink/55">
                            He stops watching until you wake him up.
                        </span>
                    </span>
                    <Toggle on={pausedLocal} onChange={setPausedLocal} />
                </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-ink p-4 text-white">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                    Promises
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-snug text-white/85">
                    <li>
                        Your data stays at KBC. Nothing is shared without your
                        explicit yes.
                    </li>
                    <li>
                        Every prediction shows why. Say "that's not me" and he
                        learns.
                    </li>
                    <li>
                        If money gets tight, Doppel sells nothing and asks if an
                        adviser may call you.
                    </li>
                </ul>
            </div>

            <div className="mt-6 flex flex-col gap-2">
                {demo && (
                    <Form {...reset.form()} options={{ preserveScroll: true }}>
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/12 py-3 text-[14px] font-semibold"
                        >
                            <RotateCcw className="size-4" />
                            Reset demo
                        </button>
                    </Form>
                )}
                <Form {...logout.form()}>
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold text-ink/55"
                    >
                        <LogOut className="size-4" />
                        Log out
                    </button>
                </Form>
            </div>
        </section>
    );
}
