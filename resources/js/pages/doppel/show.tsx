import { Form, Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, RotateCcw, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Kobe } from '@/components/doppel/kobe';
import type { MascotVariant, Mood } from '@/components/doppel/kobe';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { doppel } from '@/routes';
import { events, feedback, reset } from '@/routes/doppel';

type Scenario = 'base' | 'save_100' | 'fixed_energy';
type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human';

type CardAction = {
    kind: ActionKind;
    title: string;
    body: string | null;
    cta_label: string;
    partner_name: string | null;
};

type Card = {
    id: number | null;
    rule_key: string;
    title: string;
    body: string | null;
    expected_on: string;
    confidence: number;
    impact_cents: number | null;
    urgency: number;
    signals: { label: string; detail: string }[];
    actions: CardAction[];
};

type Props = {
    customer: {
        display_name: string;
        age: number;
        city: string;
        life_stage: string;
        mascot_variant: MascotVariant;
        mood: Mood;
        persona_key: string | null;
    };
    balance_cents: number;
    today: string;
    scenario: Scenario;
    opener: string;
    cards: Card[];
    demo: { enabled: boolean; events: string[] };
};

const scenarios: { value: Scenario; label: string }[] = [
    { value: 'base', label: 'Zoals het nu loopt' },
    { value: 'save_100', label: '€100 per maand sparen' },
    { value: 'fixed_energy', label: 'Vast energiecontract' },
];

const moodLabel: Record<Mood, string> = {
    neutral: 'Kobe houdt een oogje in het zeil',
    relieved: 'Kobe is opgelucht',
    paused: 'Kobe maakt zich zorgen',
};

const euro = (cents: number) =>
    new Intl.NumberFormat('nl-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(cents / 100);

const longDate = (iso: string) =>
    new Intl.DateTimeFormat('nl-BE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(iso));

const shortDate = (iso: string) =>
    new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long' }).format(
        new Date(iso),
    );

function urgencyBadge(urgency: number) {
    if (urgency >= 70) {
        return <Badge variant="destructive">Dringend</Badge>;
    }

    if (urgency >= 40) {
        return <Badge>Binnenkort</Badge>;
    }

    return <Badge variant="secondary">Ter info</Badge>;
}

function ActionButton({ action }: { action: CardAction }) {
    const variant =
        action.kind === 'kbc'
            ? 'default'
            : action.kind === 'no_sale'
              ? 'ghost'
              : 'outline';

    return (
        <div className="flex flex-col gap-1 rounded-lg border p-3">
            <div className="text-sm font-medium">{action.title}</div>
            {action.body && (
                <p className="text-sm text-muted-foreground">{action.body}</p>
            )}
            {action.partner_name && (
                <p className="text-xs text-muted-foreground">
                    Via partner: {action.partner_name}
                </p>
            )}
            <Button
                size="sm"
                variant={variant}
                className="mt-1 self-start"
                onClick={() =>
                    toast(
                        `${action.cta_label}: in de echte app gaat dit verder.`,
                    )
                }
            >
                {action.cta_label}
            </Button>
        </div>
    );
}

function PredictionCard({ card }: { card: Card }) {
    return (
        <article className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
            <header className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {urgencyBadge(card.urgency)}
                <span>{shortDate(card.expected_on)}</span>
                <span>·</span>
                <span>{card.confidence}% zeker</span>
                {card.impact_cents !== null && (
                    <>
                        <span>·</span>
                        <span className="font-medium text-foreground">
                            {euro(card.impact_cents)}
                        </span>
                    </>
                )}
            </header>

            <div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                {card.body && (
                    <p className="mt-1 text-muted-foreground">{card.body}</p>
                )}
            </div>

            {card.signals.length > 0 && (
                <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-sky-700 dark:text-sky-300">
                        Waarom denk ik dat?
                        <ChevronDown className="size-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <ul className="mt-2 flex flex-col gap-1 text-sm">
                            {card.signals.map((signal) => (
                                <li key={signal.label}>
                                    <span className="font-medium">
                                        {signal.label}:
                                    </span>{' '}
                                    <span className="text-muted-foreground">
                                        {signal.detail}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleContent>
                </Collapsible>
            )}

            {card.actions.length > 0 && (
                <div className="grid gap-2 md:grid-cols-2">
                    {card.actions.map((action) => (
                        <ActionButton
                            key={`${action.kind}-${action.title}`}
                            action={action}
                        />
                    ))}
                </div>
            )}

            {card.id !== null && (
                <Form
                    {...feedback.form()}
                    options={{ preserveScroll: true }}
                    className="self-end"
                >
                    {({ processing }) => (
                        <>
                            <input
                                type="hidden"
                                name="prediction_id"
                                value={card.id ?? ''}
                            />
                            <Button
                                type="submit"
                                variant="link"
                                size="sm"
                                className="text-muted-foreground"
                                disabled={processing}
                            >
                                Dat ben ik niet
                            </Button>
                        </>
                    )}
                </Form>
            )}
        </article>
    );
}

export default function DoppelShow({
    customer,
    balance_cents,
    today,
    scenario,
    opener,
    cards,
    demo,
}: Props) {
    const { flash } = usePage<{ flash: { status: string | null } }>().props;

    useEffect(() => {
        if (flash?.status) {
            toast(flash.status);
        }
    }, [flash?.status]);

    const switchScenario = (value: Scenario) =>
        router.get(
            doppel.url({
                query: value === 'base' ? {} : { scenario: value },
            }),
            {},
            { preserveScroll: true, preserveState: true },
        );

    return (
        <>
            <Head title="Mijn Doppel" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <section className="flex flex-col gap-4 rounded-xl border bg-[#F4F8FB] p-5 md:flex-row md:items-center dark:bg-sky-950/30">
                    <Kobe
                        variant={customer.mascot_variant}
                        mood={customer.mood}
                    />
                    <div className="flex-1">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {moodLabel[customer.mood]}
                        </p>
                        <p className="mt-1 text-lg leading-snug font-medium text-[#003665] dark:text-sky-100">
                            {opener}
                        </p>
                    </div>
                    <div className="text-right text-sm">
                        <div className="text-muted-foreground">
                            Saldo op {longDate(today)}
                        </div>
                        <div className="text-2xl font-semibold">
                            {euro(balance_cents)}
                        </div>
                    </div>
                </section>

                <nav className="flex flex-wrap gap-2" aria-label="Scenario">
                    {scenarios.map((option) => (
                        <Button
                            key={option.value}
                            size="sm"
                            variant={
                                option.value === scenario
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => switchScenario(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </nav>

                <section className="flex flex-col gap-4">
                    {cards.length === 0 ? (
                        <p className="rounded-xl border p-6 text-center text-muted-foreground">
                            Ik heb de komende 30 dagen beleefd en er gebeurde
                            niets waar je iets mee moet.
                        </p>
                    ) : (
                        cards.map((card) => (
                            <PredictionCard
                                key={`${card.rule_key}-${card.id}`}
                                card={card}
                            />
                        ))
                    )}
                </section>

                {demo.enabled && (
                    <section className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed p-4 text-sm">
                        <span className="mr-2 font-medium text-muted-foreground">
                            Demo
                        </span>
                        {customer.persona_key === 'karim' &&
                            demo.events.includes('karim_invoice_paid') && (
                                <Form
                                    {...events.form('karim_invoice_paid')}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={processing}
                                        >
                                            <Zap className="size-4" />
                                            Brouwerij De Leie betaalt €3.200
                                        </Button>
                                    )}
                                </Form>
                            )}
                        <Form
                            {...reset.form()}
                            options={{ preserveScroll: true }}
                        >
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    size="sm"
                                    variant="outline"
                                    disabled={processing}
                                >
                                    <RotateCcw className="size-4" />
                                    Reset demo
                                </Button>
                            )}
                        </Form>
                    </section>
                )}
            </div>
        </>
    );
}

DoppelShow.layout = {
    breadcrumbs: [{ title: 'Mijn Doppel', href: doppel() }],
};
