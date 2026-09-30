import type { Persona } from '../../types';

export const thomas: Persona = {
    id: 'thomas',
    name: 'Thomas Verstraete',
    firstName: 'Thomas',
    age: 28,
    city: 'Ghent',
    avatar: { initials: 'TV', hue: 175 },
    segment: 'Young savers',
    lifeStage: 'Saving well, curious about investing',
    tagline:
        'Nurse with €18.400 on a savings account and a car loan that ends next month',
    headline: '€310 a month frees up in November',
    greeting: 'Your car is almost paid off, Thomas. Nice work.',
    push: {
        title: 'One more car loan payment to go',
        body: 'From November, €310 a month stays with you. Want to decide what it does?',
    },
    kateOpener:
        'Hi Thomas. You asked if investing is risky. Short answer: it can go up and down, and small amounts over many years smooth that out. Want the 3-minute version?',
    advisorBrief:
        'Thomas Verstraete (28), Ghent, nurse at UZ Gent, €2.480 net. Disciplined saver (€400/month for 3 years), €18.400 on savings at ~1.5%. Car loan ends in October (frees €310/month). Read 5 investing articles, opened Bolero twice without starting, asked Kate "is investing risky?". No pension saving yet. Big summer holiday spend (~€2.900). Likely low-to-medium risk appetite, first-time investor. Goal: explain, reassure, keep buffer intact; no pressure.',
    accounts: [
        {
            label: 'KBC Zichtrekening',
            iban: 'BE24 •••• 5518',
            balanceCents: 234000,
            kind: 'current',
        },
        {
            label: 'KBC Spaarrekening',
            iban: 'BE77 •••• 0962',
            balanceCents: 1840000,
            kind: 'savings',
        },
        {
            label: 'KBC Autolening',
            iban: 'BE40 •••• 3107',
            balanceCents: -31000,
            kind: 'credit',
        },
    ],
    monthly: { incomeCents: 248000, spendCents: 198000 },
    products: [
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Debit Card',
        'KBC Autolening',
        'KBC Autoverzekering',
    ],
    transactions: [
        {
            id: 'thomas-tx-loan',
            date: '28 Sep',
            label: 'KBC Autolening — instalment 47/48',
            amountCents: -31000,
            category: 'transport',
            flag: '1 left',
        },
        {
            id: 'thomas-tx-savings',
            date: '26 Sep',
            label: 'To KBC Spaarrekening',
            amountCents: -40000,
            category: 'savings',
            flag: 'every month',
        },
        {
            id: 'thomas-tx-salary',
            date: '25 Sep',
            label: 'UZ Gent — salary',
            amountCents: 248000,
            category: 'income',
        },
        {
            id: 'thomas-tx-ah',
            date: '24 Sep',
            label: 'Albert Heijn Gent Zuid',
            amountCents: -5400,
            category: 'groceries',
        },
        {
            id: 'thomas-tx-basicfit',
            date: '22 Sep',
            label: 'Basic-Fit Gent',
            amountCents: -2999,
            category: 'subscriptions',
        },
        {
            id: 'thomas-tx-luminus',
            date: '20 Sep',
            label: 'Luminus — energy advance',
            amountCents: -8500,
            category: 'utilities',
        },
        {
            id: 'thomas-tx-ryanair',
            date: '18 Sep',
            label: 'Ryanair — Lisbon, July 2027',
            amountCents: -28600,
            category: 'leisure',
            flag: 'summer trip',
        },
        {
            id: 'thomas-tx-delhaize',
            date: '12 Sep',
            label: 'Delhaize Gent Sint-Pieters',
            amountCents: -4700,
            category: 'groceries',
        },
        {
            id: 'thomas-tx-spotify',
            date: '5 Sep',
            label: 'Spotify',
            amountCents: -1199,
            category: 'subscriptions',
        },
        {
            id: 'thomas-tx-rent',
            date: '1 Sep',
            label: 'Rent — Kortrijksesteenweg, Gent',
            amountCents: -79000,
            category: 'housing',
        },
    ],
    signals: [
        {
            id: 'thomas-sig-loan-end',
            label: 'Your car loan ends next month',
            detail: 'You paid instalment 47 of 48. From November, €310 a month stays with you.',
            source: 'products',
            strength: 0.9,
            observedAt: '2 days ago',
        },
        {
            id: 'thomas-sig-idle-savings',
            label: '€18.400 on your savings account at 1.5%',
            detail: 'Prices rise by about 2.8% a year, so your savings lose around €240 in buying power each year.',
            source: 'products',
            strength: 0.85,
            observedAt: 'today',
        },
        {
            id: 'thomas-sig-saver',
            label: 'You save €400 every month',
            detail: 'For 3 years you have not skipped a single month.',
            source: 'transactions',
            strength: 0.65,
            observedAt: '4 days ago',
        },
        {
            id: 'thomas-sig-articles',
            label: 'You read about investing',
            detail: 'You read 5 articles about investing in the app this month.',
            source: 'app_behaviour',
            strength: 0.6,
            observedAt: 'this month',
        },
        {
            id: 'thomas-sig-bolero',
            label: 'You opened Bolero but did not start',
            detail: 'You visited the Bolero start page twice and stopped at choosing a fund.',
            source: 'app_behaviour',
            strength: 0.7,
            observedAt: '6 days ago',
        },
        {
            id: 'thomas-sig-kate',
            label: 'You asked Kate if investing is risky',
            detail: "You asked Kate: 'Is investing risky?'",
            source: 'kate',
            strength: 0.75,
            observedAt: '3 days ago',
        },
        {
            id: 'thomas-sig-no-pension',
            label: 'You do not use pension saving yet',
            detail: 'Pension saving gets you up to 30% back on your taxes, up to €1.050 a year.',
            source: 'products',
            strength: 0.7,
            observedAt: 'today',
        },
        {
            id: 'thomas-sig-summer',
            label: 'Summer is your big yearly cost',
            detail: 'Last July and August you spent about €2.900 on holidays, and you already booked a flight for next summer.',
            source: 'transactions',
            strength: 0.4,
            observedAt: '12 days ago',
        },
    ],
    moments: [
        {
            id: 'thomas-mom-loan-end',
            title: '€310 a month frees up in November',
            narrative:
                'Your last car loan payment is at the end of October. After that, €310 a month is yours to decide on, before it quietly disappears into daily spending.',
            horizon: 'in ~4 weeks',
            daysAhead: 28,
            confidence: 94,
            impactCents: 31000,
            signalIds: ['thomas-sig-loan-end', 'thomas-sig-saver'],
        },
        {
            id: 'thomas-mom-idle',
            title: 'Your savings slowly lose value',
            narrative:
                'Your €18.400 earns about 1.5%, while prices rise faster. A safety buffer is smart; the part above it could work harder.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 80,
            impactCents: -24000,
            signalIds: [
                'thomas-sig-idle-savings',
                'thomas-sig-saver',
                'thomas-sig-summer',
            ],
        },
        {
            id: 'thomas-mom-ready',
            title: 'You look ready to start investing, small',
            narrative:
                'You have been reading, you asked about the risks, and you opened Bolero twice. Starting small is a fine way to learn.',
            horizon: 'in ~1 month',
            daysAhead: 30,
            confidence: 66,
            signalIds: [
                'thomas-sig-articles',
                'thomas-sig-bolero',
                'thomas-sig-kate',
            ],
        },
        {
            id: 'thomas-mom-pension-deadline',
            title: 'Tax benefit deadline: 31 December',
            narrative:
                'Money you put into pension saving before 31 December can get you up to €315 back on your taxes for this year.',
            horizon: 'in 92 days',
            daysAhead: 92,
            confidence: 85,
            impactCents: 31500,
            signalIds: ['thomas-sig-no-pension', 'thomas-sig-idle-savings'],
        },
    ],
    recommendations: [
        {
            id: 'thomas-rec-pension-saving',
            momentId: 'thomas-mom-pension-deadline',
            kind: 'kbc',
            title: 'Start KBC pension saving before 31 December',
            body: 'Put up to €1.050 in this year and get up to 30% back on your taxes. You can start with one deposit from your savings.',
            cta: 'Start with €1.050',
            valueToCustomer: 'Up to €315 back on your taxes',
            scores: {
                relevance: 88,
                timing: 82,
                customerValue: 88,
                kbcValue: 70,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Up to €315 back on your taxes this year. Deadline 31 December.',
                },
                {
                    channel: 'push',
                    when: '1 Dec 18:00',
                    message:
                        'One month left to get your pension saving tax benefit for 2026.',
                },
                {
                    channel: 'email',
                    when: 'if not started by 15 Dec',
                    message:
                        'Last reminder: pension saving before 31 December.',
                },
            ],
        },
        {
            id: 'thomas-rec-explained',
            momentId: 'thomas-mom-ready',
            kind: 'no_sale',
            title: 'Investing explained in 3 minutes',
            body: 'What risk really means, why time helps, and what you can lose. Honest, short, no fund names.',
            cta: 'Watch the 3 minutes',
            valueToCustomer: 'Decide with confidence, or not at all',
            scores: {
                relevance: 88,
                timing: 78,
                customerValue: 80,
                kbcValue: 10,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now',
                    message:
                        'You asked if investing is risky. Here is the honest 3-minute answer.',
                },
                {
                    channel: 'app',
                    when: 'in the feed, Sun 20:00',
                    message: 'Investing explained in 3 minutes.',
                },
            ],
        },
        {
            id: 'thomas-rec-buffer',
            momentId: 'thomas-mom-idle',
            kind: 'no_sale',
            title: 'Your safety buffer: about €8.900 is enough',
            body: 'Three months of costs (~€6.000) plus your summer trip (~€2.900) is a solid buffer for you. The rest can be for longer-term goals, if you want.',
            cta: 'See my buffer',
            valueToCustomer: 'Know what to keep safe',
            scores: {
                relevance: 82,
                timing: 70,
                customerValue: 82,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'How much should you keep aside? For you, about €8.900.',
                },
                {
                    channel: 'push',
                    when: 'Thu 19:00',
                    message:
                        'Your savings: how much is buffer, how much is extra?',
                },
            ],
        },
        {
            id: 'thomas-rec-invest-plan',
            momentId: 'thomas-mom-ready',
            kind: 'kbc',
            title: 'Start investing with €50 a month',
            body: 'A KBC investment plan via Bolero: €50 a month in a broad fund, stop or pause anytime. You finish where you stopped last time.',
            cta: 'Start with €50/month',
            valueToCustomer: 'Learn by doing, with a small amount',
            scores: {
                relevance: 85,
                timing: 80,
                customerValue: 80,
                kbcValue: 75,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'next time you open Bolero',
                    message:
                        'You stopped at choosing a fund. Here is a simple starter option.',
                },
                {
                    channel: 'email',
                    when: 'if not started in 7 days',
                    message: 'Starting small: what €50 a month can grow into.',
                },
            ],
        },
        {
            id: 'thomas-rec-advisor',
            momentId: 'thomas-mom-idle',
            kind: 'human',
            title: 'Talk it through with an advisor',
            body: 'A 20-minute call, after your shift if needed. Bring all your questions about saving and investing.',
            cta: 'Book a call',
            valueToCustomer: 'Answers for your situation',
            scores: {
                relevance: 70,
                timing: 55,
                customerValue: 75,
                kbcValue: 50,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after the 3-minute video',
                    message: 'Still unsure? Talk to a person, 20 minutes.',
                },
                {
                    channel: 'advisor',
                    when: 'on booking',
                    message:
                        'Phone or video call, also early mornings or evenings.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'thomas-evt-loan-paid',
            label: 'Last car loan instalment paid',
            description:
                'Thomas pays instalment 48/48. His car loan is closed and €310 a month is free from November.',
            transaction: {
                id: 'thomas-tx-loan-last',
                date: '30 Sep',
                label: 'KBC Autolening — last instalment 48/48',
                amountCents: -31000,
                category: 'transport',
                flag: 'loan closed',
            },
            effect: {
                balanceDeltaCents: -31000,
                removeSignalIds: ['thomas-sig-loan-end'],
                addSignals: [
                    {
                        id: 'thomas-sig-loan-closed',
                        label: 'Your car is paid off',
                        detail: 'You paid the last of 48 instalments. Your car loan is closed.',
                        source: 'products',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['thomas-mom-loan-end'],
                addMoments: [
                    {
                        id: 'thomas-mom-loan-end',
                        title: '€310 a month is yours again',
                        narrative:
                            'Your car is paid off. Give that €310 a job now, before it quietly disappears into daily spending.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 97,
                        impactCents: 31000,
                        signalIds: [
                            'thomas-sig-loan-closed',
                            'thomas-sig-saver',
                        ],
                    },
                ],
                addRecommendations: [
                    {
                        id: 'thomas-rec-split-310',
                        momentId: 'thomas-mom-loan-end',
                        kind: 'kbc',
                        title: 'Give your €310 a job',
                        body: 'A suggestion: €88 a month to pension saving, €50 to a KBC investment plan, and the rest to savings for summer. Change the split as you like.',
                        cta: 'Set up my split',
                        valueToCustomer:
                            'Tax benefit, a start in investing, and a summer fund',
                        scores: {
                            relevance: 90,
                            timing: 95,
                            customerValue: 85,
                            kbcValue: 75,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Car paid off! Want to decide what your €310 a month does?',
                            },
                            {
                                channel: 'app',
                                when: 'on tap',
                                message:
                                    'Drag the sliders: pension saving, investing, savings.',
                            },
                            {
                                channel: 'kate',
                                when: 'if you ask',
                                message:
                                    'I can set up the standing orders for you in one go.',
                            },
                        ],
                    },
                ],
                greeting:
                    'Your car is paid off, Thomas. €310 a month is yours again.',
                push: {
                    title: 'Your car is paid off',
                    body: 'From November, €310 a month stays with you. Give it a job?',
                },
            },
        },
    ],
    cohort: {
        label: '58,400 KBC customers under 35 hold €10k+ in savings and have never invested',
        size: 58400,
    },
};
