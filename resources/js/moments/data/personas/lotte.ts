import type { Persona } from '../../types';

export const lotte: Persona = {
    id: 'lotte',
    name: 'Lotte Vermeulen',
    firstName: 'Lotte',
    age: 24,
    city: 'Ghent',
    avatar: { initials: 'LV', hue: 330 },
    segment: 'Young professionals',
    lifeStage: 'First job',
    tagline: 'Started her first job at Accenture 5 weeks ago',
    headline: 'Student prices end in 7 days',
    greeting: 'Your first full month as an employee looks good, Lotte.',
    push: {
        title: 'Your student prices end next week',
        body: 'Spotify and your Telenet student pack go up by €14/month from 7 Oct. Your budget can handle it, have a look.',
    },
    kateOpener:
        'Hi Lotte! Congrats on your first salary. Want me to show what changes now that you are no longer a student? Three things, two minutes.',
    accounts: [
        {
            label: 'Zichtrekening',
            iban: 'BE68 •••• 4412',
            balanceCents: 118040,
            kind: 'current',
        },
        {
            label: 'Spaarrekening',
            iban: 'BE21 •••• 7730',
            balanceCents: 8500,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 215000, spendCents: 204000 },
    products: [
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Debetkaart',
        'KBC Mobile',
    ],
    transactions: [
        {
            id: 'lotte-tx-1',
            date: '28 Sep',
            label: 'Colruyt Gent Dampoort',
            amountCents: -4730,
            category: 'groceries',
        },
        {
            id: 'lotte-tx-2',
            date: '27 Sep',
            label: 'Spotify Student',
            amountCents: -599,
            category: 'subscriptions',
            flag: 'student price',
        },
        {
            id: 'lotte-tx-3',
            date: '26 Sep',
            label: 'Café Labiekke Gent',
            amountCents: -2250,
            category: 'leisure',
        },
        {
            id: 'lotte-tx-4',
            date: '25 Sep',
            label: 'Accenture Belgium',
            amountCents: 215000,
            category: 'income',
            flag: 'first salary',
        },
        {
            id: 'lotte-tx-5',
            date: '25 Sep',
            label: 'Huur studio Gent',
            amountCents: -65000,
            category: 'housing',
        },
        {
            id: 'lotte-tx-6',
            date: '22 Sep',
            label: 'Proximus Mobile',
            amountCents: -3500,
            category: 'utilities',
            flag: 'overpaying',
        },
        {
            id: 'lotte-tx-7',
            date: '20 Sep',
            label: 'Telenet Student Pack (Netflix incl.)',
            amountCents: -1500,
            category: 'subscriptions',
            flag: 'student price',
        },
        {
            id: 'lotte-tx-8',
            date: '18 Sep',
            label: 'Zara Gent Veldstraat',
            amountCents: -8990,
            category: 'shopping',
        },
        {
            id: 'lotte-tx-9',
            date: '15 Sep',
            label: 'Delhaize Gent Zuid',
            amountCents: -3860,
            category: 'groceries',
        },
        {
            id: 'lotte-tx-10',
            date: '12 Sep',
            label: 'NMBS Gent-Sint-Pieters',
            amountCents: -1450,
            category: 'transport',
        },
    ],
    signals: [
        {
            id: 'lotte-sig-salary',
            label: 'You got your first salary',
            detail: 'Accenture paid you €2.150 on 25 Sep. Before that, you only had student job payments.',
            source: 'transactions',
            strength: 0.95,
            observedAt: '5 days ago',
        },
        {
            id: 'lotte-sig-graduated',
            label: 'Your student days are over',
            detail: 'Your last UGent tuition payment was a year ago, and your student job payments stopped in July.',
            source: 'life_event',
            strength: 0.8,
            observedAt: '2 months ago',
        },
        {
            id: 'lotte-sig-student-subs',
            label: 'You pay student prices for 2 subscriptions',
            detail: 'Spotify Student (€5,99) and your Telenet Student Pack (€15). Your student status runs out on 7 Oct.',
            source: 'transactions',
            strength: 0.85,
            observedAt: '3 days ago',
        },
        {
            id: 'lotte-sig-no-buffer',
            label: 'You have no savings buffer yet',
            detail: 'Your Spaarrekening has €85. One unexpected bill of €300 would bring your current account close to zero.',
            source: 'products',
            strength: 0.8,
            observedAt: 'today',
        },
        {
            id: 'lotte-sig-mobile',
            label: 'You pay a lot for mobile',
            detail: 'You pay Proximus €35/month for 5 GB. Similar plans cost €15–20.',
            source: 'transactions',
            strength: 0.7,
            observedAt: '8 days ago',
        },
        {
            id: 'lotte-sig-kate-tax',
            label: 'You asked Kate about taxes',
            detail: "You asked Kate: 'do I have to pay extra tax now that I'm working?'",
            source: 'kate',
            strength: 0.75,
            observedAt: '2 days ago',
        },
        {
            id: 'lotte-sig-savings-screen',
            label: 'You looked at savings goals',
            detail: 'You opened the savings goals screen 3 times this week, but did not start one yet.',
            source: 'app_behaviour',
            strength: 0.6,
            observedAt: 'this week',
        },
        {
            id: 'lotte-sig-fod',
            label: 'Tax letters are on their way',
            detail: 'FOD Financiën sends most tax letters for income year 2025 between October and December.',
            source: 'external',
            strength: 0.5,
            observedAt: 'this month',
        },
    ],
    moments: [
        {
            id: 'lotte-mom-discounts',
            title: 'Student prices end in 7 days',
            narrative:
                'Your Spotify Student and Telenet student pack switch to full price on 7 Oct. That is about €14 more every month.',
            horizon: 'in 7 days',
            daysAhead: 7,
            confidence: 92,
            impactCents: -1400,
            signalIds: ['lotte-sig-student-subs', 'lotte-sig-graduated'],
        },
        {
            id: 'lotte-mom-buffer',
            title: 'No safety net yet',
            narrative:
                'Your salary covers your month, but there is nothing set aside. A broken laptop or a dentist bill would hit your current account directly.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 85,
            signalIds: [
                'lotte-sig-no-buffer',
                'lotte-sig-salary',
                'lotte-sig-savings-screen',
            ],
        },
        {
            id: 'lotte-mom-mobile',
            title: 'You overpay for mobile',
            narrative:
                'You pay €35/month for 5 GB. The same data costs about €15–20 elsewhere.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 78,
            impactCents: 18000,
            signalIds: ['lotte-sig-mobile'],
        },
        {
            id: 'lotte-mom-tax',
            title: 'Your first tax letter is coming',
            narrative:
                'FOD Financiën will send the assessment for your 2025 student work in about 2 months. Based on similar profiles, expect to pay around €380.',
            horizon: 'in ~2 months',
            daysAhead: 60,
            confidence: 64,
            impactCents: -38000,
            signalIds: [
                'lotte-sig-kate-tax',
                'lotte-sig-fod',
                'lotte-sig-graduated',
            ],
        },
    ],
    recommendations: [
        {
            id: 'lotte-rec-savings',
            momentId: 'lotte-mom-buffer',
            kind: 'kbc',
            title: 'KBC Start2Save plan',
            body: 'Move a fixed amount to your Spaarrekening the day after payday, so saving happens before spending. Stop or change it anytime.',
            cta: 'Start with €100/month',
            valueToCustomer: '€1.200 buffer in a year',
            scores: {
                relevance: 85,
                timing: 80,
                customerValue: 85,
                kbcValue: 60,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Payday was 5 days ago. Save €100 on the 26th of every month?',
                },
                {
                    channel: 'push',
                    when: 'Mon 26 Oct 08:00',
                    message:
                        'Salary is in. Want to put €100 aside before the month starts?',
                },
                {
                    channel: 'kate',
                    when: 'if she opens savings goals again',
                    message:
                        'Shall I set up that savings goal for you? Takes 30 seconds.',
                },
            ],
        },
        {
            id: 'lotte-rec-mobile',
            momentId: 'lotte-mom-mobile',
            kind: 'partner',
            partner: 'Mobile Vikings',
            title: 'Cheaper mobile via Mobile Vikings',
            body: 'Same network quality, 10 GB instead of 5 GB, for €17/month. You keep your number.',
            cta: 'Compare plans',
            valueToCustomer: 'Saves ~€216 a year',
            scores: {
                relevance: 80,
                timing: 75,
                customerValue: 80,
                kbcValue: 25,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: 'You pay €35 for 5 GB. Here is €17 for 10 GB.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 3 days',
                    message:
                        'Keep your number, pay half: a quick mobile check-up.',
                },
            ],
        },
        {
            id: 'lotte-rec-budget',
            momentId: 'lotte-mom-discounts',
            kind: 'no_sale',
            title: 'Your budget is on track 👍',
            body: 'Even with Spotify and Telenet at full price, you still have about €110 left each month. Nothing to do.',
            cta: 'See my month',
            scores: {
                relevance: 70,
                timing: 80,
                customerValue: 70,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Prices go up €14 on 7 Oct. You are fine, here is why.',
                },
                {
                    channel: 'push',
                    when: 'Wed 7 Oct 09:00',
                    message:
                        'Student prices ended today. Your budget still works 👍',
                },
            ],
        },
        {
            id: 'lotte-rec-tax',
            momentId: 'lotte-mom-tax',
            kind: 'no_sale',
            title: 'Set aside €30/month for the tax letter',
            body: 'We estimate ~€380 to pay. Putting €30 aside now means no surprise in December. We explain every line of the letter when it arrives.',
            cta: 'Create a tax pot',
            valueToCustomer: 'No surprise bill',
            scores: {
                relevance: 70,
                timing: 55,
                customerValue: 75,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'next time she opens Kate',
                    message:
                        'About your tax question: here is what to expect and when.',
                },
                {
                    channel: 'app',
                    when: 'when the letter arrives',
                    message: 'Your tax letter explained, line by line.',
                },
                {
                    channel: 'push',
                    when: '3 days before due date',
                    message:
                        'Your tax payment is due Friday. Your pot covers it.',
                },
            ],
        },
        {
            id: 'lotte-rec-pension',
            momentId: 'lotte-mom-tax',
            kind: 'kbc',
            title: 'Pension saving, when you are ready',
            body: 'Pension saving gives you up to 30% back on your tax bill. Worth a look once your buffer is there, not before.',
            cta: 'Remind me in spring',
            valueToCustomer: 'Up to €309 tax back a year',
            scores: {
                relevance: 45,
                timing: 25,
                customerValue: 60,
                kbcValue: 70,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after 3 months of saving',
                    message:
                        'Your buffer is growing. Want to see how pension saving lowers your tax?',
                },
                {
                    channel: 'email',
                    when: 'March 2027',
                    message: 'Pension saving explained in 3 minutes.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'lotte-evt-savings',
            label: 'Sets up €100/month savings',
            description:
                'Lotte taps "Start with €100/month". The first transfer goes out today.',
            transaction: {
                id: 'lotte-tx-evt-savings',
                date: '30 Sep',
                label: 'Standing order → Spaarrekening',
                amountCents: -10000,
                category: 'savings',
                flag: 'new',
            },
            effect: {
                balanceDeltaCents: -10000,
                addSignals: [
                    {
                        id: 'lotte-sig-standing-order',
                        label: 'You started saving every month',
                        detail: 'You now move €100 to your Spaarrekening on the 26th, the day after payday.',
                        source: 'products',
                        strength: 0.9,
                        observedAt: 'just now',
                    },
                ],
                removeSignalIds: [
                    'lotte-sig-no-buffer',
                    'lotte-sig-savings-screen',
                ],
                removeMomentIds: ['lotte-mom-buffer'],
                addMoments: [
                    {
                        id: 'lotte-mom-buffer-growing',
                        title: 'Your safety net is growing',
                        narrative:
                            'At €100 a month you will have €685 by March, enough to absorb most surprise bills.',
                        horizon: 'in ~5 months',
                        daysAhead: 150,
                        confidence: 90,
                        impactCents: 60000,
                        signalIds: [
                            'lotte-sig-standing-order',
                            'lotte-sig-salary',
                        ],
                    },
                ],
                removeRecommendationIds: ['lotte-rec-savings'],
                addRecommendations: [
                    {
                        id: 'lotte-rec-buffer-progress',
                        momentId: 'lotte-mom-buffer-growing',
                        kind: 'no_sale',
                        title: 'Nice one. Buffer: €185 and counting',
                        body: 'We will show your progress once a month. Need the money? It is yours, move it back anytime.',
                        cta: 'See my goal',
                        valueToCustomer: '€685 buffer by March',
                        scores: {
                            relevance: 85,
                            timing: 85,
                            customerValue: 75,
                            kbcValue: 10,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'now',
                                message: 'Your first €100 is saved. 🎉',
                            },
                            {
                                channel: 'push',
                                when: 'Mon 26 Oct 09:00',
                                message: 'Another €100 saved. Buffer: €285.',
                            },
                        ],
                    },
                ],
                greeting: 'Your safety net just started, Lotte. €185 saved.',
                push: {
                    title: 'First €100 saved 🎉',
                    body: 'Your buffer is now €185. Next €100 goes on 26 Oct, the day after payday.',
                },
            },
        },
    ],
    cohort: {
        label: '14,200 KBC customers started their first job this quarter',
        size: 14200,
    },
};
