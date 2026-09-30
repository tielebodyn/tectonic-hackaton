/**
 * KBC Moments: shared contract for the POC. Everything is mock data in the browser.
 * Money is always integer cents. Dates are human strings relative to the demo "today"
 * (Wed 30 Sep 2026), e.g. "in 12 days", "3 days ago".
 */

/** kbc = KBC product, partner = third-party via KBC, no_sale = pure help, human = advisor, protect = safety */
export type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human' | 'protect';

export type Channel = 'app' | 'push' | 'kate' | 'advisor' | 'email' | 'branch';

export type SignalSource =
    | 'transactions'
    | 'app_behaviour'
    | 'products'
    | 'life_event'
    | 'kate'
    | 'external';

export type TxCategory =
    | 'income'
    | 'housing'
    | 'groceries'
    | 'subscriptions'
    | 'utilities'
    | 'insurance'
    | 'transport'
    | 'shopping'
    | 'savings'
    | 'investing'
    | 'bnpl'
    | 'tax'
    | 'childcare'
    | 'health'
    | 'leisure'
    | 'transfer'
    | 'business'
    | 'other';

export type Transaction = {
    id: string;
    date: string; // "28 Sep"
    label: string; // counterparty, e.g. "Colruyt Gent"
    amountCents: number; // signed, negative = spend
    category: TxCategory;
    flag?: string; // optional short tag the engine "noticed", e.g. "new", "unusual", "student price"
};

export type Account = {
    label: string; // "Zichtrekening", "Spaarrekening", "KBC Business"
    iban: string; // fake, "BE68 •••• 4412"
    balanceCents: number;
    kind: 'current' | 'savings' | 'business' | 'investment' | 'credit';
};

export type Signal = {
    id: string;
    label: string; // "First salary from new employer"
    detail: string; // "Accenture paid €2.050 on 25 Sep, no earlier payroll"
    source: SignalSource;
    strength: number; // 0..1, how strongly it points to the moment
    observedAt: string; // "5 days ago"
};

/** A predicted life/financial moment: what is about to happen to this customer. */
export type Moment = {
    id: string;
    title: string; // "Student discounts end next week"
    narrative: string; // 1–2 sentences, plain language, second person
    horizon: string; // "in 7 days", "in ~2 months"
    daysAhead: number; // for sorting/timeline, 0 = now
    confidence: number; // 0..100
    impactCents?: number; // signed effect on the customer's money, if any
    signalIds: string[]; // which signals led here (explainability)
};

export type ChannelStep = {
    channel: Channel;
    when: string; // "now", "Tue 08:00", "if no tap in 3 days"
    message: string; // what that channel says, short
};

export type Recommendation = {
    id: string;
    momentId: string;
    kind: ActionKind;
    title: string; // "KBC Start2Save plan"
    body: string; // one or two sentences
    cta: string; // "Start with €25/month"
    partner?: string; // for kind = partner
    valueToCustomer?: string; // "Saves ~€240 a year"
    scores: {
        relevance: number; // 0..100, fit with situation
        timing: number; // 0..100, is now the moment
        customerValue: number; // 0..100, how much it helps the customer
        kbcValue: number; // 0..100, commercial value for KBC
    };
    channels: ChannelStep[]; // orchestration plan across channels
};

/** Customer state flags the guardrails react to. */
export type CustomerState = {
    financialStress: boolean; // falling balance, BNPL, shortfall ahead → stop selling
    vulnerable: boolean; // e.g. elderly + unusual transfer pattern → protect first
    sensitiveMoment?: string; // e.g. "separation", "bereavement" → human tone, no partner offers
};

export type SimEvent = {
    id: string;
    label: string; // button text: "Client pays €3.200 invoice"
    description: string; // what happens, one line
    transaction?: Transaction; // shows up on top of the tx list
    effect: {
        balanceDeltaCents?: number; // applied to the first account
        addSignals?: Signal[];
        removeSignalIds?: string[];
        addMoments?: Moment[];
        removeMomentIds?: string[];
        addRecommendations?: Recommendation[];
        removeRecommendationIds?: string[];
        setState?: Partial<CustomerState>;
        greeting?: string;
        push?: { title: string; body: string };
    };
};

export type Persona = {
    id: string; // "lotte"
    name: string; // "Lotte Vermeulen"
    firstName: string;
    age: number;
    city: string;
    avatar: { initials: string; hue: number }; // hue 0..360 for a soft tinted circle
    segment: string; // "Young professionals"
    lifeStage: string; // "First job"
    tagline: string; // one-line situation for the roster: "Started her first job 5 weeks ago"
    headline: string; // the one moment that matters most, for the roster chip: "Discounts end in 7 days"
    greeting: string; // hero line on the KBC app home, second person: "Your first full month as an employee looks good, Lotte."
    push: { title: string; body: string }; // the push notification preview
    kateOpener: string; // what Kate (KBC's assistant) would say first
    advisorBrief?: string; // what a human advisor sees before calling, if relevant
    accounts: Account[];
    monthly: { incomeCents: number; spendCents: number };
    products: string[]; // KBC products held: "KBC Zichtrekening", "Visa Card"
    transactions: Transaction[]; // 8–12 most recent, newest first
    signals: Signal[];
    moments: Moment[]; // 3–5
    recommendations: Recommendation[]; // 4–6, at least one no_sale, mixes kinds
    state: CustomerState;
    events: SimEvent[]; // 1–2 live events you can trigger in the demo
    cohort: { label: string; size: number }; // "12,400 KBC customers are in their first job month"
};

/* ---------- Engine output ---------- */

export type RankedRecommendation = {
    rec: Recommendation;
    score: number; // 0..100 after weighting + guardrail boosts
    rank: number; // 1-based
};

export type SuppressedRecommendation = {
    rec: Recommendation;
    reason: string; // "Sales paused: signs of financial stress"
};

export type Decision = {
    ranked: RankedRecommendation[];
    suppressed: SuppressedRecommendation[];
    log: string[]; // human-readable decision trace, in order
};

/** A persona after live events and feedback have been applied. */
export type PersonaView = Persona & {
    firedEventIds: string[];
    dismissedIds: string[];
    decision: Decision;
};
