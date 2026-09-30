// Contract between the Laravel controller and the Doppel home screen.
// Change it only after telling the whole team.

export type Mood = 'neutral' | 'thinking' | 'relieved' | 'paused';
export type ActionKind = 'kbc' | 'partner' | 'no_sale' | 'human';
export type MascotVariant = 'backpack' | 'moving_box' | 'laptop_coffee';

export interface Customer {
    id: number;
    name: string;
    life_stage: string;
    persona_summary: string;
    mascot_variant: MascotVariant;
    mood: Mood;
    diary_opener: string; // Kobe speaking: first person, past tense
}

export interface Action {
    id: number;
    kind: ActionKind;
    title: string;
    cta_label: string;
}

export interface Signal {
    label: string;
    detail: string;
}

export interface Prediction {
    id: number;
    type: string;
    title: string; // one diary line
    expected_at: string; // ISO date
    confidence: number; // 0..1, shown as "80% sure"
    signals: Signal[];
    scenario: string; // 'base' or e.g. 'save_100'
    actions: Action[];
}

export interface Fork {
    key: string;
    label: string; // "What if I save €100 a month?"
    opener: string; // what the forked Doppel says
}

export interface PushMessage {
    title: string;
    body: string;
}

export interface HomeProps {
    customer: Customer;
    predictions: Prediction[]; // scenario = base
    forkPredictions: Prediction[] | null;
    fork: Fork | null; // null for Karim
    push: PushMessage;
}
