import type { Persona } from '../../types';

export const arne: Persona = {
    id: 'arne',
    name: 'Arne Janssens',
    firstName: 'Arne',
    age: 20,
    city: 'Leuven',
    avatar: { initials: 'AJ', hue: 228 },
    segment: 'Students',
    lifeStage: 'Student in a kot',
    tagline: 'KU Leuven student with a Delhaize job, planning a trip',
    headline: '110 student hours left',
    greeting: 'Kot, job, trip: you are juggling it well, Arne.',
    push: {
        title: 'Heads-up: 110 student hours left',
        body: 'At your pace you hit the 650-hour cap in early November. Here is what that means for you.',
    },
    kateOpener:
        'Hey Arne! Planning a trip? I can show what paying in złoty costs, and check your student hours so there are no surprises.',
    accounts: [
        {
            label: 'Zichtrekening',
            iban: 'BE54 •••• 2087',
            balanceCents: 31240,
            kind: 'current',
        },
        {
            label: 'Spaarrekening',
            iban: 'BE93 •••• 5561',
            balanceCents: 45000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 72000, spendCents: 69500 },
    products: [
        'KBC Zichtrekening (free until 25)',
        'KBC Spaarrekening',
        'KBC Debetkaart',
        'KBC Mobile',
    ],
    transactions: [
        {
            id: 'arne-tx-1',
            date: '29 Sep',
            label: 'Aldi Leuven Tiensesteenweg',
            amountCents: -2340,
            category: 'groceries',
        },
        {
            id: 'arne-tx-2',
            date: '28 Sep',
            label: 'Pieter Janssens (dad)',
            amountCents: 5000,
            category: 'transfer',
            flag: 'split rent share',
        },
        {
            id: 'arne-tx-3',
            date: '27 Sep',
            label: 'Café Commerce Leuven',
            amountCents: -1850,
            category: 'leisure',
        },
        {
            id: 'arne-tx-4',
            date: '25 Sep',
            label: 'Delhaize Le Lion (student job)',
            amountCents: 41800,
            category: 'income',
            flag: 'student job',
        },
        {
            id: 'arne-tx-5',
            date: '21 Sep',
            label: 'Huurwaarborg kot Naamsestraat',
            amountCents: -76000,
            category: 'housing',
            flag: 'first rent deposit',
        },
        {
            id: 'arne-tx-6',
            date: '21 Sep',
            label: 'Mama & papa Janssens',
            amountCents: 80000,
            category: 'transfer',
            flag: 'parents top-up',
        },
        {
            id: 'arne-tx-7',
            date: '20 Sep',
            label: 'Kotbaas V. Peeters, huur oktober',
            amountCents: -38000,
            category: 'housing',
        },
        {
            id: 'arne-tx-8',
            date: '18 Sep',
            label: 'Payconiq · Lars (pizza)',
            amountCents: 1250,
            category: 'transfer',
        },
        {
            id: 'arne-tx-9',
            date: '16 Sep',
            label: 'Acco Leuven (course books)',
            amountCents: -12400,
            category: 'shopping',
        },
        {
            id: 'arne-tx-10',
            date: '14 Sep',
            label: 'Telenet Wi-Fi kot',
            amountCents: -4800,
            category: 'utilities',
            flag: 'shared cost',
        },
    ],
    signals: [
        {
            id: 'arne-sig-kot',
            label: 'You moved into a kot',
            detail: 'You paid your first rent deposit (€760) and pay rent to a Leuven landlord since September.',
            source: 'transactions',
            strength: 0.85,
            observedAt: '9 days ago',
        },
        {
            id: 'arne-sig-student-hours',
            label: 'Your student hours are adding up',
            detail: 'Based on your Delhaize pay, you worked about 540 hours in 2026. Student work is capped at 650 hours a year.',
            source: 'transactions',
            strength: 0.8,
            observedAt: '5 days ago',
        },
        {
            id: 'arne-sig-travel-insurance',
            label: 'You looked at travel insurance',
            detail: 'You opened the travel insurance page twice and the currency converter for złoty (PLN) 4 times.',
            source: 'app_behaviour',
            strength: 0.75,
            observedAt: '3 days ago',
        },
        {
            id: 'arne-sig-kate-trip',
            label: 'You asked Kate about Poland',
            detail: "You asked Kate: 'does my card work in Poland?'",
            source: 'kate',
            strength: 0.7,
            observedAt: '2 days ago',
        },
        {
            id: 'arne-sig-shared-costs',
            label: 'You share lots of small costs',
            detail: 'You made 9 Payconiq transfers with your 3 roommates this month (Wi-Fi, pizza, groceries).',
            source: 'transactions',
            strength: 0.6,
            observedAt: 'this month',
        },
        {
            id: 'arne-sig-parents',
            label: 'Your parents help out',
            detail: 'Your parents send you money regularly, including €800 in September for the deposit.',
            source: 'transactions',
            strength: 0.5,
            observedAt: '9 days ago',
        },
        {
            id: 'arne-sig-academic',
            label: 'Exams are coming',
            detail: 'Your KU Leuven blok starts mid-December. Most students work 60% fewer hours then.',
            source: 'external',
            strength: 0.55,
            observedAt: 'this month',
        },
    ],
    moments: [
        {
            id: 'arne-mom-hours-cap',
            title: 'You reach the 650-hour cap in ~5 weeks',
            narrative:
                'You have about 110 student hours left this year. Above 650 hours, you pay normal social contributions, and it can affect your parents’ tax situation.',
            horizon: 'in ~5 weeks',
            daysAhead: 35,
            confidence: 82,
            signalIds: ['arne-sig-student-hours'],
        },
        {
            id: 'arne-mom-trip',
            title: 'Trip to Kraków coming up',
            narrative:
                'Looks like you are going to Poland soon. Paying in złoty and having travel cover matter more than you would think.',
            horizon: 'in ~4 weeks',
            daysAhead: 32,
            confidence: 74,
            impactCents: -35000,
            signalIds: ['arne-sig-travel-insurance', 'arne-sig-kate-trip'],
        },
        {
            id: 'arne-mom-kot',
            title: 'Settling into your kot',
            narrative:
                'Deposit paid, rent running, and lots of small costs shared with 3 roommates.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 88,
            signalIds: [
                'arne-sig-kot',
                'arne-sig-shared-costs',
                'arne-sig-parents',
            ],
        },
        {
            id: 'arne-mom-exams',
            title: 'Exam period: fewer shifts, more takeaway',
            narrative:
                'From mid-December you will probably work less and spend more on food and coffee. Plan for about €180 less that month.',
            horizon: 'in ~2.5 months',
            daysAhead: 75,
            confidence: 68,
            impactCents: -18000,
            signalIds: ['arne-sig-academic', 'arne-sig-student-hours'],
        },
    ],
    recommendations: [
        {
            id: 'arne-rec-hours',
            momentId: 'arne-mom-hours-cap',
            kind: 'no_sale',
            title: 'Heads-up: 110 student hours left',
            body: 'Check your exact balance on Student@work and plan your November shifts. Going over the cap costs you social contributions.',
            cta: 'How the cap works',
            valueToCustomer: 'Avoids surprise contributions',
            scores: {
                relevance: 90,
                timing: 85,
                customerValue: 90,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'About 110 student hours left this year. Here is how to check.',
                },
                {
                    channel: 'push',
                    when: 'Fri 18:00',
                    message:
                        'Planning weekend shifts? You have ~110 student hours left in 2026.',
                },
                {
                    channel: 'kate',
                    when: 'if he asks about his job',
                    message: 'Want me to explain the 650-hour rule in 3 lines?',
                },
            ],
        },
        {
            id: 'arne-rec-travel',
            momentId: 'arne-mom-trip',
            kind: 'kbc',
            title: 'Travel insurance for the trip',
            body: 'KBC Reisbijstand covers medical costs and repatriation for your trip only. No yearly contract needed.',
            cta: 'Cover my trip from €9',
            valueToCustomer: 'Medical costs abroad covered',
            scores: {
                relevance: 80,
                timing: 75,
                customerValue: 70,
                kbcValue: 55,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: 'Going to Poland? Trip-only cover from €9.',
                },
                {
                    channel: 'push',
                    when: '10 days before departure',
                    message:
                        'Your trip is close. Covered for medical costs abroad?',
                },
            ],
        },
        {
            id: 'arne-rec-currency',
            momentId: 'arne-mom-trip',
            kind: 'no_sale',
            title: 'Paying in złoty? Choose PLN, not EUR',
            body: 'When a card terminal asks, always pick PLN: the "pay in euro" option costs up to 7% extra. Withdraw cash once, not every day.',
            cta: 'Show my travel tips',
            valueToCustomer: 'Saves ~€20 on a 4-day trip',
            scores: {
                relevance: 80,
                timing: 80,
                customerValue: 75,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now (answer to his question)',
                    message:
                        'Yes, your card works in Poland. One tip: always pay in PLN.',
                },
                {
                    channel: 'push',
                    when: 'on first card payment in Poland',
                    message:
                        'Welcome to Kraków! Tip: choose PLN at the terminal.',
                },
            ],
        },
        {
            id: 'arne-rec-split',
            momentId: 'arne-mom-kot',
            kind: 'no_sale',
            title: 'Split kot costs with your roommates',
            body: 'Create a shared group for Wi-Fi, groceries and pizza nights. Everyone sees who owes what, and settles with one tap.',
            cta: 'Create "Kot Naamsestraat"',
            scores: {
                relevance: 75,
                timing: 70,
                customerValue: 65,
                kbcValue: 15,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        '9 Payconiq transfers with roommates this month. Make it one group?',
                },
                {
                    channel: 'push',
                    when: 'next time Telenet is paid',
                    message: 'Telenet paid. Split it with the kot in one tap?',
                },
            ],
        },
        {
            id: 'arne-rec-perks',
            momentId: 'arne-mom-kot',
            kind: 'kbc',
            title: 'Your free student pack',
            body: 'Your account and debit card stay free until 25. You can add a free second card or a savings goal without any cost.',
            cta: 'See what is included',
            scores: {
                relevance: 55,
                timing: 40,
                customerValue: 55,
                kbcValue: 50,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'next login',
                    message: 'Everything in your student pack, in one screen.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in a week',
                    message: 'Free until 25: what your KBC account includes.',
                },
            ],
        },
        {
            id: 'arne-rec-exam-budget',
            momentId: 'arne-mom-exams',
            kind: 'no_sale',
            title: 'Plan your blok budget',
            body: 'Put €15 aside per week until December, so the exam month without shifts is not tight.',
            cta: 'Set a blok pot',
            valueToCustomer: '€150 ready for December',
            scores: {
                relevance: 60,
                timing: 35,
                customerValue: 65,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'mid-October',
                    message:
                        'Blok is 10 weeks away. €15/week keeps December relaxed.',
                },
                {
                    channel: 'push',
                    when: '1 Dec 18:00',
                    message: 'Exams soon. Your blok pot has €150. Good luck!',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'arne-evt-flights',
            label: 'Books flights to Kraków',
            description:
                'Arne pays Ryanair for Brussels South Charleroi → Kraków, 30 Oct – 2 Nov.',
            transaction: {
                id: 'arne-tx-evt-flights',
                date: '30 Sep',
                label: 'Ryanair CRL–KRK',
                amountCents: -8900,
                category: 'transport',
                flag: 'trip booked',
            },
            effect: {
                balanceDeltaCents: -8900,
                addSignals: [
                    {
                        id: 'arne-sig-flights',
                        label: 'You booked your flights',
                        detail: 'You paid Ryanair €89 for Charleroi → Kraków, 30 Oct – 2 Nov.',
                        source: 'transactions',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['arne-mom-trip'],
                addMoments: [
                    {
                        id: 'arne-mom-trip',
                        title: 'Kraków: 30 Oct – 2 Nov',
                        narrative:
                            'Flights are booked. You fly in 30 days. Travel cover and paying in złoty are the two things left to sort.',
                        horizon: 'in 30 days',
                        daysAhead: 30,
                        confidence: 95,
                        impactCents: -35000,
                        signalIds: [
                            'arne-sig-flights',
                            'arne-sig-travel-insurance',
                            'arne-sig-kate-trip',
                        ],
                    },
                ],
                removeRecommendationIds: ['arne-rec-travel'],
                addRecommendations: [
                    {
                        id: 'arne-rec-travel',
                        momentId: 'arne-mom-trip',
                        kind: 'kbc',
                        title: 'Cover 30 Oct – 2 Nov for €9',
                        body: 'KBC Reisbijstand for exactly these 4 days: medical costs, repatriation and lost luggage.',
                        cta: 'Cover my trip',
                        valueToCustomer: 'Medical costs abroad covered',
                        scores: {
                            relevance: 90,
                            timing: 90,
                            customerValue: 75,
                            kbcValue: 55,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'Flights booked! Add cover for these 4 days, €9.',
                            },
                            {
                                channel: 'push',
                                when: '26 Oct 19:00',
                                message:
                                    'Flying Friday. Travel cover is one tap away.',
                            },
                        ],
                    },
                ],
                greeting: 'Kraków is booked, Arne. 30 days to go ✈️',
                push: {
                    title: 'Kraków booked ✈️',
                    body: 'Two things left: trip cover (€9) and choosing PLN when you pay. We will remind you before you fly.',
                },
            },
        },
    ],
    cohort: {
        label: '38,600 KBC student customers have a student job this year',
        size: 38600,
    },
};
