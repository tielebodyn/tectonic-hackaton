/** Props zoals DoppelController@show ze stuurt. Snake_case komt uit PHP. */

export type BackendMood = 'neutral' | 'relieved' | 'paused';
export type MascotVariant = 'backpack' | 'box' | 'laptop';
export type Scenario = 'base' | 'save_100' | 'fixed_energy';
export type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human';

/** Gezichtsuitdrukking van de buddy (frontend), ruimer dan de backend-mood. */
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

export type ShowProps = {
    customer: ShowCustomer;
    balance_cents: number;
    today: string;
    scenario: Scenario;
    opener: string;
    cards: Card[];
    demo: { enabled: boolean; events: string[] };
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
    new Intl.NumberFormat('nl-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(cents / 100);

export const shortDate = (iso: string) =>
    new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long' }).format(
        new Date(iso),
    );
