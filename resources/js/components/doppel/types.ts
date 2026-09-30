/** Props as DoppelController@show sends them. Snake_case comes from PHP. */

export type BackendMood = 'neutral' | 'relieved' | 'paused';
export type MascotVariant = 'backpack' | 'box' | 'laptop';
export type Scenario = 'base' | 'save_100' | 'fixed_energy';
export type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human';

/** The buddy's facial expression (frontend), richer than the backend mood. */
export type FaceMood =
    | 'relaxed'
    | 'thinking'
    | 'worried'
    | 'relieved'
    | 'paused';

export type CardAction = {
    kind: ActionKind;
    title: string;
    body: string | null;
    cta_label: string;
    partner_name: string | null;
};

export type Signal = { label: string; detail: string };

export type Card = {
    id: number | null;
    rule_key: string;
    title: string;
    body: string | null;
    expected_on: string;
    confidence: number;
    impact_cents: number | null;
    urgency: number;
    signals: Signal[];
    actions: CardAction[];
};

export type ShowCustomer = {
    display_name: string;
    age: number;
    city: string;
    life_stage: string;
    mascot_variant: MascotVariant;
    mood: BackendMood;
    persona_key: string | null;
};

/** Average month over the last 90 days (or from the persona script). */
export type Monthly = { income_cents: number; spend_cents: number };

export type DemoPersona = { key: string; label: string };

export type ShowProps = {
    customer: ShowCustomer;
    balance_cents: number;
    monthly: Monthly;
    today: string;
    scenario: Scenario;
    opener: string;
    cards: Card[];
    demo: { enabled: boolean; events: string[]; personas: DemoPersona[] };
};

export type Persona = {
    persona_key: string;
    display_name: string;
    age: number;
    city: string;
    mascot_variant: MascotVariant;
    persona_summary: string | null;
};

export const faceFor: Record<BackendMood, FaceMood> = {
    neutral: 'relaxed',
    relieved: 'relieved',
    paused: 'worried',
};

export const euro = (cents: number) =>
    new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(cents / 100);

export const shortDate = (iso: string) =>
    new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long' }).format(
        new Date(iso),
    );

/** How far ahead the diary looks, in months. 1 = the next thirty days. */
export type Horizon = 1 | 3 | 12;

/** Recurring yearly moment, derived from the customer's own spending. Not a prediction, but expected. */
export type SeasonalMoment = {
    key: string;
    title: string;
    /** One word for the timeline. */
    short: string;
    body: string;
    expected_on: string;
    impact_cents: number;
};

/** What-if controls in "My money, month by month". Amounts in cents. */
export type WhatIf = {
    spend_delta_cents: number;
    income_pct: number;
    one_off_cents: number;
    one_off_month: string | null;
    saving_cents: number;
};
