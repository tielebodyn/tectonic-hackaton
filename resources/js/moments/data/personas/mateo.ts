import type { Persona } from '../../types';

export const mateo: Persona = {
    id: 'mateo',
    name: 'Mateo García',
    firstName: 'Mateo',
    age: 29,
    city: 'Brussels (Saint-Gilles)',
    avatar: { initials: 'MG', hue: 120 },
    segment: 'Newcomers',
    lifeStage: 'Just moved to Belgium',
    tagline: 'Spanish software engineer, moved to Brussels 3 weeks ago',
    headline: 'Join a health fund in the next weeks',
    greeting: 'Welcome to Belgium, Mateo. Your first Belgian salary is in.',
    push: {
        title: 'Your Belgium starter checklist',
        body: 'Five things newcomers sort out in their first 2 months. You have done 2 already.',
    },
    kateOpener:
        'Hi Mateo! You asked what a mutuelle is. It is a health fund: it pays back part of your doctor and hospital costs. Want me to show how to join one?',
    advisorBrief:
        'Mateo García (29), Spanish, software engineer at Nexlane NV, Brussels. Moved 3 weeks ago, onboarded digitally, app in English. First Belgian salary €2.910 (partial month; ~€3.850 net/month full). Registered at the commune of Saint-Gilles. Moved €12k from his Spanish account in 3 transfers. Asked Kate "what is a mutuelle?", viewed car insurance 3 times. Likely eligible for the special tax regime for inbound taxpayers (application by employer within 3 months of start). Speak English; explain Belgian basics before any product.',
    accounts: [
        {
            label: 'KBC Zichtrekening',
            iban: 'BE29 •••• 6015',
            balanceCents: 1033400,
            kind: 'current',
        },
        {
            label: 'KBC Spaarrekening',
            iban: 'BE61 •••• 8843',
            balanceCents: 0,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 385000, spendCents: 262000 },
    products: [
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Debit Card',
        'KBC Mobile (English)',
    ],
    transactions: [
        {
            id: 'mateo-tx-es-3',
            date: '29 Sep',
            label: 'Transfer from ES •••• 3391 (M. García)',
            amountCents: 800000,
            category: 'transfer',
            flag: 'from Spain',
        },
        {
            id: 'mateo-tx-salary',
            date: '28 Sep',
            label: 'Nexlane NV — salary September',
            amountCents: 291000,
            category: 'income',
            flag: 'first salary',
        },
        {
            id: 'mateo-tx-delhaize',
            date: '27 Sep',
            label: 'Delhaize Saint-Gilles',
            amountCents: -6400,
            category: 'groceries',
        },
        {
            id: 'mateo-tx-commune',
            date: '25 Sep',
            label: 'Commune de Saint-Gilles — residence card',
            amountCents: -2200,
            category: 'tax',
            flag: 'registered',
        },
        {
            id: 'mateo-tx-proximus',
            date: '23 Sep',
            label: 'Proximus — internet installation',
            amountCents: -7900,
            category: 'utilities',
        },
        {
            id: 'mateo-tx-deposit',
            date: '20 Sep',
            label: 'Rental deposit — Rue de la Victoire',
            amountCents: -250000,
            category: 'housing',
            flag: 'one-off',
        },
        {
            id: 'mateo-tx-es-2',
            date: '18 Sep',
            label: 'Transfer from ES •••• 3391 (M. García)',
            amountCents: 300000,
            category: 'transfer',
            flag: 'from Spain',
        },
        {
            id: 'mateo-tx-stib',
            date: '16 Sep',
            label: 'STIB-MIVB — monthly pass',
            amountCents: -4900,
            category: 'transport',
        },
        {
            id: 'mateo-tx-ikea',
            date: '15 Sep',
            label: 'IKEA Anderlecht',
            amountCents: -61200,
            category: 'shopping',
            flag: 'new home',
        },
        {
            id: 'mateo-tx-es-1',
            date: '12 Sep',
            label: 'Transfer from ES •••• 3391 (M. García)',
            amountCents: 100000,
            category: 'transfer',
            flag: 'from Spain',
        },
        {
            id: 'mateo-tx-rent',
            date: '10 Sep',
            label: 'Rent — Rue de la Victoire, Saint-Gilles',
            amountCents: -125000,
            category: 'housing',
        },
    ],
    signals: [
        {
            id: 'mateo-sig-first-salary',
            label: 'Your first Belgian salary arrived',
            detail: 'Nexlane NV paid you €2.910 on 28 Sep for your first weeks. A full month will be around €3.850.',
            source: 'transactions',
            strength: 0.8,
            observedAt: '2 days ago',
        },
        {
            id: 'mateo-sig-spain-transfers',
            label: 'You moved money from Spain 3 times',
            detail: 'You transferred €12.000 from your Spanish account this month. Many banks charge for instant transfers or keep a monthly account fee.',
            source: 'transactions',
            strength: 0.6,
            observedAt: '1 day ago',
        },
        {
            id: 'mateo-sig-commune',
            label: 'You registered at the commune',
            detail: 'You paid for your residence card at the commune of Saint-Gilles, so you now officially live in Belgium.',
            source: 'life_event',
            strength: 0.9,
            observedAt: '5 days ago',
        },
        {
            id: 'mateo-sig-car-insurance',
            label: 'You looked at car insurance',
            detail: 'You opened the car insurance page in the app 3 times this week.',
            source: 'app_behaviour',
            strength: 0.65,
            observedAt: 'yesterday',
        },
        {
            id: 'mateo-sig-language',
            label: 'Your app is in English',
            detail: 'You chose English as your app language, so we will explain Belgian terms in English too.',
            source: 'app_behaviour',
            strength: 0.5,
            observedAt: '3 weeks ago',
        },
        {
            id: 'mateo-sig-kate',
            label: 'You asked Kate about the mutuelle',
            detail: "You asked Kate: 'What is a mutuelle?'",
            source: 'kate',
            strength: 0.85,
            observedAt: '4 days ago',
        },
        {
            id: 'mateo-sig-new-customer',
            label: 'You are new to KBC',
            detail: 'You opened your accounts online 3 weeks ago, with no Belgian banking history before that.',
            source: 'products',
            strength: 0.7,
            observedAt: '3 weeks ago',
        },
    ],
    moments: [
        {
            id: 'mateo-mom-health-fund',
            title: 'Join a health fund in the next few weeks',
            narrative:
                'In Belgium, part of your doctor, pharmacy and hospital costs is paid back through a health fund (mutualité / ziekenfonds). Until you join one, you pay the full price.',
            horizon: 'in ~3 weeks',
            daysAhead: 21,
            confidence: 88,
            signalIds: [
                'mateo-sig-kate',
                'mateo-sig-commune',
                'mateo-sig-first-salary',
            ],
        },
        {
            id: 'mateo-mom-tax',
            title: 'Your first Belgian taxes, and a 3-month window',
            narrative:
                'You are now a Belgian tax resident. If you came to Belgium for this job, your employer can apply for the special tax regime for newcomers, but only within 3 months of your start date.',
            horizon: 'in ~2 months',
            daysAhead: 62,
            confidence: 64,
            signalIds: [
                'mateo-sig-first-salary',
                'mateo-sig-commune',
                'mateo-sig-new-customer',
            ],
        },
        {
            id: 'mateo-mom-fees',
            title: 'Two bank accounts, double the fees',
            narrative:
                'You are moving money between Spain and Belgium. Keeping your daily banking in one place can save you transfer and account fees.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 70,
            impactCents: -15000,
            signalIds: ['mateo-sig-spain-transfers', 'mateo-sig-new-customer'],
        },
        {
            id: 'mateo-mom-car',
            title: 'You may be buying a car soon',
            narrative:
                'You keep looking at car insurance. In Belgium you need insurance before you can get a number plate, so it is good to know the steps in advance.',
            horizon: 'in ~1 month',
            daysAhead: 30,
            confidence: 60,
            signalIds: ['mateo-sig-car-insurance', 'mateo-sig-spain-transfers'],
        },
    ],
    recommendations: [
        {
            id: 'mateo-rec-health-fund',
            momentId: 'mateo-mom-health-fund',
            kind: 'partner',
            partner: 'Helan',
            title: 'Join a health fund in 10 minutes',
            body: 'A short explainer of how health funds work in Belgium, and a direct link to join Helan online in English. You can also pick any other fund.',
            cta: 'Join online',
            valueToCustomer: 'Get most of your doctor costs paid back',
            scores: {
                relevance: 90,
                timing: 90,
                customerValue: 85,
                kbcValue: 40,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now',
                    message:
                        'A mutuelle is a health fund. Here is how to join one, in English.',
                },
                {
                    channel: 'app',
                    when: 'on the starter checklist',
                    message:
                        'Step 3: join a health fund. About 10 minutes online.',
                },
                {
                    channel: 'push',
                    when: 'if not done in 7 days',
                    message:
                        'Still no health fund? Until you join, you pay full price at the doctor.',
                },
            ],
        },
        {
            id: 'mateo-rec-checklist',
            momentId: 'mateo-mom-tax',
            kind: 'no_sale',
            title: 'Your Belgium starter checklist',
            body: 'Commune registration, health fund, the newcomer tax regime, your Spanish driving licence, first tax return: what to do and when, in plain English.',
            cta: 'Open my checklist',
            valueToCustomer: 'Nothing important slips through',
            scores: {
                relevance: 92,
                timing: 92,
                customerValue: 88,
                kbcValue: 10,
            },
            channels: [
                {
                    channel: 'push',
                    when: 'Sat 10:00',
                    message: 'Your Belgium starter checklist: 2 of 5 done.',
                },
                {
                    channel: 'app',
                    when: 'on tap',
                    message:
                        'Five steps for your first 2 months, with deadlines.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 5 days',
                    message: 'Your checklist as a PDF, to keep.',
                },
            ],
        },
        {
            id: 'mateo-rec-car-insurance',
            momentId: 'mateo-mom-car',
            kind: 'kbc',
            title: 'KBC car insurance, with your Spanish history',
            body: 'Your years without claims in Spain can count here. We also request your number plate for you.',
            cta: 'Get a price',
            valueToCustomer:
                'Your Spanish no-claims years can lower your price',
            scores: {
                relevance: 75,
                timing: 60,
                customerValue: 65,
                kbcValue: 80,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'next time you open car insurance',
                    message:
                        'Bring your Spanish no-claims certificate, it can lower your price.',
                },
                {
                    channel: 'kate',
                    when: 'if you ask about cars',
                    message:
                        'In Belgium you need insurance before you get a plate. I can help.',
                },
            ],
        },
        {
            id: 'mateo-rec-advisor',
            momentId: 'mateo-mom-tax',
            kind: 'human',
            title: 'Talk to an English-speaking advisor',
            body: 'A 20-minute video call about anything that is new to you: taxes, pension, renting, banking in Belgium.',
            cta: 'Book a video call',
            valueToCustomer: 'Answers in your language',
            scores: {
                relevance: 72,
                timing: 60,
                customerValue: 75,
                kbcValue: 45,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after the checklist',
                    message: 'Questions? An advisor can explain it in English.',
                },
                {
                    channel: 'advisor',
                    when: 'on booking',
                    message: 'Video call, in English, evenings possible.',
                },
            ],
        },
        {
            id: 'mateo-rec-transfers',
            momentId: 'mateo-mom-fees',
            kind: 'kbc',
            title: 'Bring your daily banking to KBC',
            body: 'Transfers to Spain in euro are free with KBC. We help you move your Spanish direct debits, so you can close the extra account when you are ready.',
            cta: 'Move my direct debits',
            valueToCustomer: 'Saves ~€150 a year in fees',
            scores: {
                relevance: 70,
                timing: 65,
                customerValue: 60,
                kbcValue: 50,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after your next transfer from Spain',
                    message:
                        'Transfers to and from Spain in euro are free here.',
                },
                {
                    channel: 'email',
                    when: 'in 2 weeks',
                    message: 'How to move your direct debits, step by step.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'mateo-evt-car',
            label: 'Buys a second-hand car',
            description:
                'Mateo pays €7.900 for a 2021 Seat Leon at a garage in Anderlecht. He cannot drive it without insurance.',
            transaction: {
                id: 'mateo-tx-car',
                date: '30 Sep',
                label: 'Garage Van Damme Anderlecht — Seat Leon 2021',
                amountCents: -790000,
                category: 'transport',
                flag: 'car purchase',
            },
            effect: {
                balanceDeltaCents: -790000,
                addSignals: [
                    {
                        id: 'mateo-sig-car-bought',
                        label: 'You bought a car',
                        detail: 'You paid €7.900 to a car garage in Anderlecht today.',
                        source: 'transactions',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['mateo-mom-car'],
                addMoments: [
                    {
                        id: 'mateo-mom-car',
                        title: 'Your car needs insurance before you drive it',
                        narrative:
                            'Congratulations on the car. In Belgium you need insurance first, then the insurer requests your number plate. You cannot drive until both are done.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 95,
                        signalIds: [
                            'mateo-sig-car-bought',
                            'mateo-sig-car-insurance',
                        ],
                    },
                ],
                removeRecommendationIds: ['mateo-rec-car-insurance'],
                addRecommendations: [
                    {
                        id: 'mateo-rec-car-insurance-now',
                        momentId: 'mateo-mom-car',
                        kind: 'kbc',
                        title: 'Insure your Seat and get your plate today',
                        body: 'Insure your car in the app, and we request your number plate for you. Your Spanish no-claims years can count.',
                        cta: 'Insure my car',
                        valueToCustomer: 'On the road in 1–2 days, not a week',
                        scores: {
                            relevance: 90,
                            timing: 98,
                            customerValue: 88,
                            kbcValue: 80,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'New car? You need insurance and a plate before you drive. We do both.',
                            },
                            {
                                channel: 'app',
                                when: 'on tap',
                                message:
                                    'Car details pre-filled from your purchase. 4 questions left.',
                            },
                            {
                                channel: 'kate',
                                when: 'if you have questions',
                                message:
                                    'Yes, your Spanish licence is valid in Belgium.',
                            },
                        ],
                    },
                ],
                greeting:
                    'Nice car, Mateo. Two small steps and you can drive it.',
                push: {
                    title: 'Congratulations on your car',
                    body: 'You need insurance and a number plate before you drive. We can do both today.',
                },
            },
        },
    ],
    cohort: {
        label: '2,700 newcomers to Belgium joined KBC in the last 3 months',
        size: 2700,
    },
};
