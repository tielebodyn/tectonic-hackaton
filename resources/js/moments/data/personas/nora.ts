import type { Persona } from '../../types';

export const nora: Persona = {
    id: 'nora',
    name: 'Nora El Idrissi',
    firstName: 'Nora',
    age: 33,
    city: 'Antwerp',
    avatar: { initials: 'NE', hue: 150 },
    segment: 'New parents',
    lifeStage: 'Maternity leave',
    tagline: 'Became a mother 6 weeks ago, on maternity leave',
    headline: 'Add baby Amir to your hospital cover',
    greeting:
        'Six weeks with Amir already, Nora. We’ve got the money side covered.',
    push: {
        title: 'Amir can join your hospital cover',
        body: 'Add him within 3 months of birth and there is no waiting period. You have about 6 weeks left.',
    },
    kateOpener:
        'Hi Nora, congratulations on Amir! You asked when Groeipakket pays. Short answer: around the 10th of each month. Want the full picture of your leave months?',
    accounts: [
        {
            label: 'Zichtrekening',
            iban: 'BE62 •••• 5093',
            balanceCents: 142380,
            kind: 'current',
        },
        {
            label: 'Spaarrekening',
            iban: 'BE14 •••• 2266',
            balanceCents: 510000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 205000, spendCents: 238000 },
    products: [
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Hospitalisatieverzekering (Nora only)',
        'KBC Debetkaart',
        'KBC Visa Card',
    ],
    transactions: [
        {
            id: 'nora-tx-1',
            date: '29 Sep',
            label: 'Kruidvat Antwerpen Meir',
            amountCents: -4690,
            category: 'shopping',
            flag: 'baby',
        },
        {
            id: 'nora-tx-2',
            date: '27 Sep',
            label: 'Colruyt Berchem',
            amountCents: -9120,
            category: 'groceries',
        },
        {
            id: 'nora-tx-3',
            date: '24 Sep',
            label: 'Helan ziekenfonds, moederschapsuitkering',
            amountCents: 187000,
            category: 'income',
            flag: 'maternity pay',
        },
        {
            id: 'nora-tx-4',
            date: '22 Sep',
            label: 'Kinderopvang ’t Kuikentje, waarborg',
            amountCents: -40000,
            category: 'childcare',
            flag: 'new',
        },
        {
            id: 'nora-tx-5',
            date: '20 Sep',
            label: 'Huur appartement Berchem',
            amountCents: -98000,
            category: 'housing',
        },
        {
            id: 'nora-tx-6',
            date: '17 Sep',
            label: 'ZNA Middelheim, hospital bill',
            amountCents: -86000,
            category: 'health',
            flag: 'birth',
        },
        {
            id: 'nora-tx-7',
            date: '10 Sep',
            label: 'Kidslife Groeipakket',
            amountCents: 18400,
            category: 'income',
            flag: 'new',
        },
        {
            id: 'nora-tx-8',
            date: '8 Sep',
            label: 'Aldi Antwerpen',
            amountCents: -6230,
            category: 'groceries',
            flag: 'baby',
        },
        {
            id: 'nora-tx-9',
            date: '5 Sep',
            label: 'Engie',
            amountCents: -11200,
            category: 'utilities',
        },
        {
            id: 'nora-tx-10',
            date: '3 Sep',
            label: 'Dreambaby Wijnegem',
            amountCents: -23900,
            category: 'shopping',
            flag: 'baby',
        },
        {
            id: 'nora-tx-11',
            date: '25 Aug',
            label: 'Stad Antwerpen, salaris',
            amountCents: 295000,
            category: 'income',
            flag: 'last full salary',
        },
    ],
    signals: [
        {
            id: 'nora-sig-birth',
            label: 'Your baby was born',
            detail: 'Amir was born 6 weeks ago and your Groeipakket file with Kidslife is open. Congratulations!',
            source: 'life_event',
            strength: 0.95,
            observedAt: '6 weeks ago',
        },
        {
            id: 'nora-sig-maternity-pay',
            label: 'Your salary became maternity pay',
            detail: 'Helan paid you €1.870 on 24 Sep. Your salary from Stad Antwerpen was €2.950.',
            source: 'transactions',
            strength: 0.9,
            observedAt: '6 days ago',
        },
        {
            id: 'nora-sig-hospital',
            label: 'You paid the hospital bill',
            detail: 'You paid ZNA Middelheim €860 for the birth on 17 Sep.',
            source: 'transactions',
            strength: 0.65,
            observedAt: '13 days ago',
        },
        {
            id: 'nora-sig-hospi-cover',
            label: 'Your hospital cover is for you only',
            detail: 'Your KBC Hospitalisatieverzekering covers you, not Amir. Babies added within 3 months of birth skip the waiting period.',
            source: 'products',
            strength: 0.85,
            observedAt: 'today',
        },
        {
            id: 'nora-sig-childcare',
            label: 'You paid a childcare deposit',
            detail: 'You paid ’t Kuikentje a €400 deposit. Most places start about 5 weeks after the deposit.',
            source: 'transactions',
            strength: 0.8,
            observedAt: '8 days ago',
        },
        {
            id: 'nora-sig-baby-spend',
            label: 'You spend more on baby things',
            detail: 'About €190 a month on nappies and baby care at Kruidvat, Aldi and Colruyt, which is new.',
            source: 'transactions',
            strength: 0.6,
            observedAt: 'this month',
        },
        {
            id: 'nora-sig-kate',
            label: 'You asked Kate about Groeipakket',
            detail: "You asked Kate: 'when does Groeipakket pay, and how much?'",
            source: 'kate',
            strength: 0.7,
            observedAt: '3 days ago',
        },
        {
            id: 'nora-sig-child-saving',
            label: 'You looked at saving for your child',
            detail: 'You opened the "saving for your child" page twice this month.',
            source: 'app_behaviour',
            strength: 0.55,
            observedAt: 'this month',
        },
    ],
    moments: [
        {
            id: 'nora-mom-leave-income',
            title: 'Your income is lower during leave',
            narrative:
                'Maternity pay from Helan is about €1.080 less than your salary. Your savings can bridge it, but it helps to plan these months.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 92,
            impactCents: -108000,
            signalIds: [
                'nora-sig-maternity-pay',
                'nora-sig-baby-spend',
                'nora-sig-kate',
            ],
        },
        {
            id: 'nora-mom-childcare',
            title: 'Childcare starts next month',
            narrative:
                'Amir likely starts at ’t Kuikentje in early November. Expect about €520 a month, depending on your income.',
            horizon: 'in ~4 weeks',
            daysAhead: 30,
            confidence: 88,
            impactCents: -52000,
            signalIds: ['nora-sig-childcare', 'nora-sig-birth'],
        },
        {
            id: 'nora-mom-hospi',
            title: 'Add Amir to your hospital cover',
            narrative:
                'You have about 6 weeks left to add Amir without a waiting period. After that, he would wait months for cover.',
            horizon: 'in ~6 weeks',
            daysAhead: 42,
            confidence: 85,
            signalIds: [
                'nora-sig-hospi-cover',
                'nora-sig-birth',
                'nora-sig-hospital',
            ],
        },
        {
            id: 'nora-mom-child-saving',
            title: 'Starting to save for Amir',
            narrative:
                'Many parents start a small plan for their child in the first year. No rush: once your leave is over is fine too.',
            horizon: 'in ~2 months',
            daysAhead: 60,
            confidence: 58,
            signalIds: ['nora-sig-child-saving', 'nora-sig-birth'],
        },
    ],
    recommendations: [
        {
            id: 'nora-rec-hospi',
            momentId: 'nora-mom-hospi',
            kind: 'kbc',
            title: 'Add Amir to your hospitalisation insurance',
            body: 'Amir gets the same cover as you, with no waiting period if you add him before mid-November. About €6 a month.',
            cta: 'Add Amir',
            valueToCustomer: 'No waiting period',
            scores: {
                relevance: 90,
                timing: 70,
                customerValue: 90,
                kbcValue: 55,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Amir is not covered yet. Add him in 1 minute, about €6/month.',
                },
                {
                    channel: 'push',
                    when: 'Tue 6 Oct 20:30',
                    message:
                        'Quick one while Amir sleeps: add him to your hospital cover.',
                },
                {
                    channel: 'email',
                    when: '2 weeks before deadline',
                    message:
                        'Last 2 weeks to add Amir without a waiting period.',
                },
            ],
        },
        {
            id: 'nora-rec-leave-budget',
            momentId: 'nora-mom-leave-income',
            kind: 'no_sale',
            title: 'Your budget for the leave months',
            body: 'Until your leave ends, you spend about €330 more than you get. Your savings cover that easily. Here is the month-by-month view.',
            cta: 'See my leave budget',
            valueToCustomer: 'Peace of mind for 3 months',
            scores: {
                relevance: 92,
                timing: 92,
                customerValue: 88,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: 'Your leave months, planned. You are fine.',
                },
                {
                    channel: 'push',
                    when: 'on each Helan payment',
                    message: 'Helan paid. You are on track for this month.',
                },
            ],
        },
        {
            id: 'nora-rec-groeipakket',
            momentId: 'nora-mom-leave-income',
            kind: 'no_sale',
            title: 'Groeipakket payments explained',
            body: 'Kidslife pays about €184 around the 10th of each month, plus a one-off start bonus of €1.311. We show it when it lands.',
            cta: 'What I will receive',
            scores: {
                relevance: 80,
                timing: 85,
                customerValue: 75,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now (answer to her question)',
                    message:
                        'Around the 10th, about €184. And a start bonus is on its way.',
                },
                {
                    channel: 'app',
                    when: 'now',
                    message: 'Groeipakket in 3 lines: what, when, how much.',
                },
            ],
        },
        {
            id: 'nora-rec-childcare',
            momentId: 'nora-mom-childcare',
            kind: 'no_sale',
            title: 'Childcare is already in your plan',
            body: 'We added about €520 a month from November to your budget. Tip: childcare costs give you a tax reduction later.',
            cta: 'See November',
            scores: {
                relevance: 80,
                timing: 75,
                customerValue: 70,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Childcare from November: €520/month, already planned.',
                },
                {
                    channel: 'push',
                    when: '1 Nov 09:00',
                    message:
                        'First childcare month. Your budget is ready for it.',
                },
            ],
        },
        {
            id: 'nora-rec-child-plan',
            momentId: 'nora-mom-child-saving',
            kind: 'kbc',
            title: 'A savings plan for Amir',
            body: 'Start with €25 a month in a savings account or investment plan in his name. Grandparents can add to it too.',
            cta: 'Start from €25/month',
            valueToCustomer: '~€6.000 by his 18th',
            scores: {
                relevance: 55,
                timing: 40,
                customerValue: 70,
                kbcValue: 75,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after leave ends',
                    message: 'Back at work? A small plan for Amir, from €25.',
                },
                {
                    channel: 'email',
                    when: 'in 2 months',
                    message:
                        'Saving for your child: the options, simply explained.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'nora-evt-start-bonus',
            label: 'Groeipakket start bonus arrives',
            description:
                'Kidslife pays the one-off Groeipakket start bonus of €1.311 for Amir.',
            transaction: {
                id: 'nora-tx-evt-start-bonus',
                date: '30 Sep',
                label: 'Kidslife Groeipakket, startbedrag',
                amountCents: 131100,
                category: 'income',
                flag: 'start bonus',
            },
            effect: {
                balanceDeltaCents: 131100,
                addSignals: [
                    {
                        id: 'nora-sig-start-bonus',
                        label: 'Your Groeipakket start bonus arrived',
                        detail: 'Kidslife paid you €1.311 for Amir today.',
                        source: 'transactions',
                        strength: 0.9,
                        observedAt: 'just now',
                    },
                ],
                addMoments: [
                    {
                        id: 'nora-mom-bonus',
                        title: '€1.311 start bonus landed',
                        narrative:
                            'That covers your leave gap for about 4 months, or childcare until the new year. Your choice, we just show the options.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 95,
                        impactCents: 131100,
                        signalIds: [
                            'nora-sig-start-bonus',
                            'nora-sig-maternity-pay',
                        ],
                    },
                ],
                removeRecommendationIds: [
                    'nora-rec-groeipakket',
                    'nora-rec-child-plan',
                ],
                addRecommendations: [
                    {
                        id: 'nora-rec-bonus-pot',
                        momentId: 'nora-mom-bonus',
                        kind: 'no_sale',
                        title: 'Put the bonus aside for childcare',
                        body: 'Move it to a "childcare" pot and your November and December bills are already paid. It stays yours to use anytime.',
                        cta: 'Create childcare pot',
                        valueToCustomer: '2 months of childcare covered',
                        scores: {
                            relevance: 90,
                            timing: 95,
                            customerValue: 85,
                            kbcValue: 5,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Groeipakket start bonus: €1.311 for Amir 💚',
                            },
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'Use it for childcare? One tap to set it aside.',
                            },
                        ],
                    },
                    {
                        id: 'nora-rec-child-plan',
                        momentId: 'nora-mom-child-saving',
                        kind: 'kbc',
                        title: 'Or start Amir’s savings with part of it',
                        body: 'Even €100 of the bonus plus €25 a month adds up to about €6.300 by his 18th.',
                        cta: 'Start with €100',
                        valueToCustomer: '~€6.300 by his 18th',
                        scores: {
                            relevance: 70,
                            timing: 70,
                            customerValue: 70,
                            kbcValue: 75,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'now, below the bonus card',
                                message:
                                    'A start for Amir: €100 now, €25 a month.',
                            },
                            {
                                channel: 'email',
                                when: 'in 1 week',
                                message:
                                    'Saving for Amir: the options, simply explained.',
                            },
                        ],
                    },
                ],
                greeting: 'A little gift for Amir just arrived, Nora 💚',
                push: {
                    title: 'Groeipakket: €1.311 for Amir 💚',
                    body: 'His start bonus arrived. It covers childcare for November and December, if you like.',
                },
            },
        },
    ],
    cohort: {
        label: '4,800 KBC customers became parents in the last 2 months',
        size: 4800,
    },
};
