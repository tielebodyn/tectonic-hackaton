export type LifeStage = 'starter' | 'moving' | 'self_employed';
export type MascotVariant = 'backpack' | 'box' | 'laptop';
export type Mood = 'neutral' | 'relieved' | 'paused';
export type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human';
export type Scenario = 'base' | 'save_100' | 'fixed_energy';

export type Customer = {
    id: number;
    displayName: string;
    lifeStage: LifeStage;
    mascotVariant: MascotVariant;
    mood: Mood;
    diaryOpener: string | null;
    balanceCents: number;
};

export type Signal = {
    label: string;
    detail: string;
};

export type Action = {
    kind: ActionKind;
    title: string;
    body: string | null;
    ctaLabel: string;
    partnerName: string | null;
};

export type Prediction = {
    id: number;
    ruleKey: string;
    title: string;
    body: string | null;
    expectedOn: string; // Y-m-d
    confidence: number; // 0-100
    impactCents: number | null;
    urgency: number; // 0-100
    signals: Signal[];
    actions: Action[];
};

export type DashboardProps = {
    customer: Customer;
    predictions: Prediction[];
    forkPredictions: Prediction[] | null;
    activeFork: string | null;
    pushPreview: string | null;
    demo: {
        enabled: boolean;
        personas: string[];
    };
};
