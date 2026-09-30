// Hardcoded demo data so the frontend works before the backend is ready.
// Same shape as HomeProps: the backend can replace this one persona at a time.
import type { HomeProps, Prediction } from '@/types/doppel';

function inDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date.toISOString().slice(0, 10);
}

// ---------- Lotte (24), first job in Ghent ----------

const lotteDiscount: Prediction = {
    id: 101,
    type: 'subscription_price_change',
    title: 'My Spotify and Netflix student discounts ended. That was €9.98 more every month.',
    expected_at: inDays(6),
    confidence: 0.9,
    scenario: 'base',
    signals: [
        {
            label: 'First salary',
            detail: 'Your first salary from an employer arrived on 25 September.',
        },
        {
            label: 'Student pricing',
            detail: 'Spotify and Netflix are still billed at student prices.',
        },
        {
            label: 'Renewal date',
            detail: 'Student plans renew next week and need proof of enrolment.',
        },
    ],
    actions: [
        {
            id: 1001,
            kind: 'no_sale',
            title: 'Your budget can handle this. No action needed.',
            cta_label: 'Good to know',
        },
    ],
};

const lottePhone: Prediction = {
    id: 102,
    type: 'overpaying_contract',
    title: 'My phone bill came in again: €35. My friends pay half that.',
    expected_at: inDays(12),
    confidence: 0.7,
    scenario: 'base',
    signals: [
        {
            label: 'Monthly direct debit',
            detail: '€35 to your mobile provider every month since 2022.',
        },
        {
            label: 'Comparable customers',
            detail: 'Starters with similar usage pay about €15 to €18.',
        },
    ],
    actions: [
        {
            id: 1002,
            kind: 'partner',
            title: 'Compare cheaper mobile plans with our partner.',
            cta_label: 'Compare plans',
        },
    ],
};

const lotteRent: Prediction = {
    id: 103,
    type: 'low_balance',
    title: 'Rent went out on the 1st. For three days I had €41 left.',
    expected_at: inDays(24),
    confidence: 0.8,
    scenario: 'base',
    signals: [
        {
            label: 'Rent',
            detail: '€720 standing order on the 1st of every month.',
        },
        {
            label: 'No savings',
            detail: 'No savings account and no buffer on your current account.',
        },
        {
            label: 'Spending pattern',
            detail: 'Your balance usually drops fastest in the last week before payday.',
        },
    ],
    actions: [
        {
            id: 1003,
            kind: 'kbc',
            title: 'Start a KBC savings plan, from €25 a month.',
            cta_label: 'Start saving',
        },
    ],
};

const lotteTax: Prediction = {
    id: 104,
    type: 'first_tax_bill',
    title: 'My first tax bill as an employee arrived. I had nothing set aside for it.',
    expected_at: inDays(58),
    confidence: 0.6,
    scenario: 'base',
    signals: [
        {
            label: 'New employee',
            detail: 'This is your first year with a salary instead of a student job.',
        },
        {
            label: 'Typical for starters',
            detail: 'Many starters get a first tax bill a few months into their job.',
        },
    ],
    actions: [],
};

const lotteForkPredictions: Prediction[] = [
    { ...lotteDiscount, id: 111, scenario: 'save_100', actions: [] },
    {
        ...lotteRent,
        id: 112,
        scenario: 'save_100',
        title: 'Rent went out on the 1st. My savings pot stayed untouched.',
        confidence: 0.8,
        actions: [],
    },
    {
        ...lotteTax,
        id: 113,
        scenario: 'save_100',
        title: 'My first tax bill arrived. I paid it from my buffer without stress.',
        actions: [],
    },
    {
        id: 114,
        type: 'buffer_reached',
        title: 'By New Year I had €300 set aside: my first real buffer.',
        expected_at: inDays(92),
        confidence: 0.75,
        scenario: 'save_100',
        signals: [
            {
                label: 'Savings order',
                detail: '€100 moved to savings on every payday.',
            },
        ],
        actions: [],
    },
];

const lotte: HomeProps = {
    customer: {
        id: 1,
        name: 'Lotte',
        life_stage: 'First job, Ghent',
        persona_summary:
            '24, first salary, rents a studio in Ghent, no savings yet.',
        mascot_variant: 'backpack',
        mood: 'neutral',
        diary_opener:
            'Hey Lotte, I already lived your next month. Mostly good, but I had no buffer when the surprises came.',
    },
    predictions: [lotteDiscount, lottePhone, lotteRent, lotteTax],
    forkPredictions: lotteForkPredictions,
    fork: {
        key: 'save_100',
        label: 'What if I save €100 a month?',
        opener: 'I saved €100 every payday. The tax bill came, and I barely noticed.',
    },
    push: {
        title: 'Your student discounts end next week',
        body: 'I already lived it: €9.98 more a month. Your budget can take it.',
    },
};

// ---------- The Peeters family, moving house ----------

const peetersAddress: Prediction = {
    id: 201,
    type: 'moving_admin',
    title: 'I had to change my address with 6 organisations. I forgot two of them.',
    expected_at: inDays(3),
    confidence: 0.95,
    scenario: 'base',
    signals: [
        {
            label: 'Rental deposit',
            detail: '€2,400 rental deposit paid last week.',
        },
        {
            label: 'Moving company',
            detail: 'Payment to a moving company on 22 September.',
        },
        {
            label: 'New furniture',
            detail: 'Three purchases at IKEA in the last ten days.',
        },
    ],
    actions: [
        {
            id: 2001,
            kind: 'no_sale',
            title: 'Moving checklist: the 6 places to update your address.',
            cta_label: 'Open checklist',
        },
    ],
};

const peetersInsurance: Prediction = {
    id: 202,
    type: 'missing_insurance',
    title: 'The new house had no home insurance yet.',
    expected_at: inDays(10),
    confidence: 0.75,
    scenario: 'base',
    signals: [
        {
            label: 'Moving',
            detail: 'Deposit and moving costs point to a new address.',
        },
        {
            label: 'No insurer',
            detail: 'We see no direct debit to any other home insurer.',
        },
    ],
    actions: [
        {
            id: 2002,
            kind: 'kbc',
            title: 'Get a KBC home insurance quote in 2 minutes.',
            cta_label: 'Get a quote',
        },
    ],
};

const peetersEnergy: Prediction = {
    id: 203,
    type: 'new_energy_contract',
    title: 'We signed a new energy contract without comparing.',
    expected_at: inDays(20),
    confidence: 0.7,
    scenario: 'base',
    signals: [
        {
            label: 'New energy supplier',
            detail: 'First payment to a new energy supplier this month.',
        },
        {
            label: 'Variable rate',
            detail: 'The amount suggests a variable-rate contract.',
        },
    ],
    actions: [
        {
            id: 2003,
            kind: 'partner',
            title: 'Compare energy contracts with our partner.',
            cta_label: 'Compare',
        },
    ],
};

const peetersWinter: Prediction = {
    id: 204,
    type: 'seasonal_bill',
    title: 'Our first winter bill arrived: €180 more than in the old flat.',
    expected_at: inDays(88),
    confidence: 0.65,
    scenario: 'base',
    signals: [
        {
            label: 'Bigger home',
            detail: 'Families moving to a house usually use more energy in winter.',
        },
        {
            label: 'Variable rate',
            detail: 'Variable contracts follow winter price peaks.',
        },
    ],
    actions: [],
};

const peeters: HomeProps = {
    customer: {
        id: 2,
        name: 'Jonas & Sarah',
        life_stage: 'Moving house',
        persona_summary:
            'Jonas (34) and Sarah (33), a 2-year-old son, just moved to a house.',
        mascot_variant: 'moving_box',
        mood: 'neutral',
        diary_opener:
            'Hey Jonas and Sarah, I already lived your first month in the new house. Busy, and winter cost more.',
    },
    predictions: [
        peetersAddress,
        peetersInsurance,
        peetersEnergy,
        peetersWinter,
    ],
    forkPredictions: [
        { ...peetersAddress, id: 211, scenario: 'fixed_energy', actions: [] },
        {
            ...peetersEnergy,
            id: 212,
            scenario: 'fixed_energy',
            title: 'We picked a fixed energy contract. Every month cost the same.',
            actions: [],
        },
        {
            ...peetersWinter,
            id: 213,
            scenario: 'fixed_energy',
            title: 'Winter came. The bill stayed at the amount we planned for.',
            confidence: 0.7,
            actions: [],
        },
    ],
    fork: {
        key: 'fixed_energy',
        label: 'What if we choose a fixed energy contract?',
        opener: 'We chose a fixed price. The winter bill held no surprises.',
    },
    push: {
        title: 'Moving? 6 places need your new address',
        body: 'I already did the move once. Here is the list I wish I had.',
    },
};

// ---------- Karim (47), self-employed ----------

const karimClient: Prediction = {
    id: 301,
    type: 'late_receivable',
    title: 'My biggest client still had not paid. Two invoices, €3,200 open.',
    expected_at: inDays(9),
    confidence: 0.85,
    scenario: 'base',
    signals: [
        {
            label: 'Missing income',
            detail: 'No payment from your biggest client for 2 months. Usually monthly.',
        },
        {
            label: 'Falling balance',
            detail: 'Your business balance dropped 38% in 8 weeks.',
        },
    ],
    actions: [
        {
            id: 3004,
            kind: 'partner',
            title: 'Ask a partner accountant how to handle late payers.',
            cta_label: 'Find an accountant',
        },
    ],
};

const karimSubscriptions: Prediction = {
    id: 302,
    type: 'unused_subscriptions',
    title: 'I was still paying for two subscriptions I no longer used.',
    expected_at: inDays(14),
    confidence: 0.9,
    scenario: 'base',
    signals: [
        {
            label: 'Recurring payments',
            detail: 'Two software subscriptions, €47 a month together, unused since spring.',
        },
    ],
    actions: [
        {
            id: 3003,
            kind: 'no_sale',
            title: 'Cancel 2 unused subscriptions and save €47 a month.',
            cta_label: 'Show them',
        },
    ],
};

const karimVat: Prediction = {
    id: 303,
    type: 'tax_shortfall',
    title: 'I came up €900 short for my VAT payment.',
    expected_at: inDays(21),
    confidence: 0.8,
    scenario: 'base',
    signals: [
        {
            label: 'VAT due',
            detail: 'Quarterly VAT of about €2,600 is due on the 20th.',
        },
        {
            label: 'Expected balance',
            detail: 'At the current pace your balance will be around €1,700 that day.',
        },
    ],
    actions: [
        {
            id: 3001,
            kind: 'kbc',
            title: 'KBC Business cash credit to bridge the gap.',
            cta_label: 'See the terms',
        },
        {
            id: 3002,
            kind: 'human',
            title: 'Want an advisor to call you?',
            cta_label: 'Call me',
        },
    ],
};

const karim: HomeProps = {
    customer: {
        id: 3,
        name: 'Karim',
        life_stage: 'Self-employed',
        persona_summary:
            '47, self-employed consultant, income dropped this quarter.',
        mascot_variant: 'laptop_coffee',
        mood: 'thinking',
        diary_opener:
            'Hey Karim, I already lived your next month. One thing got tight.',
    },
    predictions: [karimClient, karimSubscriptions, karimVat],
    forkPredictions: null,
    fork: null,
    push: {
        title: 'I came up €900 short for VAT',
        body: 'That was in 3 weeks. There is still time to fix it.',
    },
};

// Karim after "client pays invoice €3,200": credit card disappears, Kobe is relieved.
const karimRelieved: HomeProps = {
    ...karim,
    customer: {
        ...karim.customer,
        mood: 'relieved',
        diary_opener:
            'Good news, Karim. Your client paid. I lived the month again, and the VAT was covered.',
    },
    predictions: [
        {
            ...karimClient,
            id: 311,
            title: 'My client paid €3,200. The VAT was covered, with room to spare.',
            expected_at: inDays(0),
            confidence: 0.95,
            signals: [
                {
                    label: 'Incoming payment',
                    detail: '€3,200 received from your biggest client just now.',
                },
            ],
            actions: [],
        },
        karimSubscriptions,
    ],
    push: {
        title: 'Your client paid. VAT is covered.',
        body: 'I lived your month again. Nothing tight anymore.',
    },
};

// Karim after a first buy-now-pay-later purchase: Doppel goes quiet, a human takes over.
const karimPaused: HomeProps = {
    ...karim,
    customer: {
        ...karim.customer,
        mood: 'paused',
        diary_opener:
            'Karim, this is bigger than a tip. I can hand my diary to someone at KBC, if you want.',
    },
    predictions: [
        {
            id: 321,
            type: 'stress_signal',
            title: 'I paid for groceries with buy-now-pay-later for the first time.',
            expected_at: inDays(0),
            confidence: 1,
            scenario: 'base',
            signals: [
                {
                    label: 'First BNPL',
                    detail: 'First buy-now-pay-later payment on this account.',
                },
                {
                    label: 'Falling balance',
                    detail: 'Your balance dropped 38% in 8 weeks.',
                },
                {
                    label: 'Missing income',
                    detail: 'Your biggest client has not paid for 2 months.',
                },
            ],
            actions: [
                {
                    id: 3005,
                    kind: 'human',
                    title: 'Talk to a KBC advisor. No sales, just a plan.',
                    cta_label: 'Call me',
                },
            ],
        },
        { ...karimClient, actions: [] },
        { ...karimVat, actions: [] },
    ],
    push: {
        title: 'Can we talk?',
        body: 'Someone from KBC can look at your month with you.',
    },
};

export type PersonaKey = 'lotte' | 'peeters' | 'karim';
export type DemoStateKey = PersonaKey | 'karim_relieved' | 'karim_paused';

export const demoStates: Record<DemoStateKey, HomeProps> = {
    lotte,
    peeters,
    karim,
    karim_relieved: karimRelieved,
    karim_paused: karimPaused,
};

export const personas: { key: PersonaKey; label: string; hint: string }[] = [
    { key: 'lotte', label: 'Lotte, 24', hint: 'Starter' },
    { key: 'peeters', label: 'Peeters family', hint: 'Moving' },
    { key: 'karim', label: 'Karim, 47', hint: 'Self-employed' },
];
