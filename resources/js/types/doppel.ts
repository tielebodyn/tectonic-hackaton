/**
 * Props-contract voor de Doppel-pagina.
 * Afgesproken met backend; NIET wijzigen zonder overleg. Extra velden voor de
 * demo staan apart in DoppelDemoInfo, buiten het contract.
 */

export type Mood = 'relaxed' | 'thinking' | 'worried' | 'relieved' | 'paused';

export type Variant = 'starter' | 'mover' | 'freelancer';

export type Prediction = {
    id: number;
    title: string;
    /** ISO-datum (YYYY-MM-DD) */
    expectedAt: string;
    /** Leesbare horizon, bv. "volgende week" */
    horizon: string;
    /** 0–100 */
    confidence: number;
    /**
     * Vrije tekst. Conventie voor het icoon in de WhyDrawer: prefix
     * "transactie:", "patroon:" of "app:". Zonder prefix valt het terug op
     * het patroon-icoon. TODO: als backend een signaaltype wil meesturen,
     * hoort dat in een contractwijziging, niet hier.
     */
    signals: string[];
    status: 'open' | 'dismissed';
};

export type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human';

export type Action = {
    id: number;
    predictionId: number;
    kind: ActionKind;
    title: string;
    ctaLabel: string;
};

export type Customer = {
    name: string;
    lifeStage: string;
    variant: Variant;
    mood: Mood;
    summary: string;
    opener: string;
};

export type DoppelPageProps = {
    customer: Customer;
    predictions: Prediction[];
    forkPredictions: Prediction[] | null;
    forkLabel: string | null;
    actions: Action[];
};

/** Alleen aanwezig op de demo-route, nooit in productie. */
export type DoppelPersona = 'lotte' | 'peeters' | 'karim' | 'karim-after';

export type DoppelDemoInfo = {
    persona: DoppelPersona;
    /** true zodra de route predictions.feedback bestaat */
    canPostFeedback: boolean;
    /** true zodra de route demo.simulate-transaction bestaat */
    canSimulate: boolean;
};
