import type { Persona } from '../../types';

export const yasmine: Persona = {
    id: 'yasmine',
    name: 'Yasmine Mertens',
    firstName: 'Yasmine',
    age: 38,
    city: 'Brussels (Etterbeek)',
    avatar: { initials: 'YM', hue: 0 },
    segment: 'Families',
    lifeStage: 'Recently separated, one child',
    tagline: 'Just started living on one income with her 9-year-old daughter',
    headline: 'First month on one income',
    greeting:
        'A lot has changed lately, Yasmine. We will keep things simple for you.',
    push: {
        title: 'Your new monthly overview is ready',
        body: 'Only your own income and costs now. Take a look whenever it suits you.',
    },
    kateOpener:
        'Hi Yasmine. I noticed your joint account was closed. If it helps, I can set up a fresh overview with just your own income and costs. Only if you want to.',
    advisorBrief:
        'Yasmine Mertens (38), Etterbeek, recently separated, daughter Nora (9). Joint account closed 3 weeks ago, new individual rent €1.180, lawyer fees €1.450, child support from ex-partner expected. Net income €2.690 + Groeipakket via Famiris. Spend slightly above income this month, savings €6.300. Sensitive moment: separation. Tone: calm, practical, no product pitch, no partner offers. Offer a finance check-up: budget on one income, beneficiaries on her life insurance, single-parent tax situation. Let her lead.',
    accounts: [
        {
            label: 'KBC Zichtrekening',
            iban: 'BE36 •••• 7724',
            balanceCents: 214000,
            kind: 'current',
        },
        {
            label: 'KBC Spaarrekening',
            iban: 'BE14 •••• 5092',
            balanceCents: 630000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 305000, spendCents: 298000 },
    products: [
        'KBC Zichtrekening (individual, new)',
        'KBC Spaarrekening',
        'KBC Debit Card',
        'KBC Leven (life insurance, beneficiary: ex-partner)',
    ],
    transactions: [
        {
            id: 'yasmine-tx-salary',
            date: '28 Sep',
            label: 'UZ Brussel — salary',
            amountCents: 269000,
            category: 'income',
        },
        {
            id: 'yasmine-tx-lawyer',
            date: '26 Sep',
            label: 'Advocatenkantoor Delvaux — invoice',
            amountCents: -145000,
            category: 'other',
            flag: 'new',
        },
        {
            id: 'yasmine-tx-famiris',
            date: '24 Sep',
            label: 'Famiris — Groeipakket Nora',
            amountCents: 36000,
            category: 'income',
        },
        {
            id: 'yasmine-tx-carrefour',
            date: '23 Sep',
            label: 'Carrefour Market Etterbeek',
            amountCents: -8700,
            category: 'groceries',
        },
        {
            id: 'yasmine-tx-school',
            date: '21 Sep',
            label: 'École communale — lunch & activities',
            amountCents: -6400,
            category: 'childcare',
        },
        {
            id: 'yasmine-tx-sibelga',
            date: '18 Sep',
            label: 'Engie — new connection Etterbeek',
            amountCents: -12000,
            category: 'utilities',
            flag: 'new address',
        },
        {
            id: 'yasmine-tx-stib',
            date: '15 Sep',
            label: 'STIB-MIVB — monthly pass',
            amountCents: -4990,
            category: 'transport',
        },
        {
            id: 'yasmine-tx-colruyt',
            date: '12 Sep',
            label: 'Colruyt Etterbeek',
            amountCents: -7300,
            category: 'groceries',
        },
        {
            id: 'yasmine-tx-joint-close',
            date: '9 Sep',
            label: 'Closing joint account — your share',
            amountCents: 182000,
            category: 'transfer',
            flag: 'joint account closed',
        },
        {
            id: 'yasmine-tx-rent',
            date: '1 Sep',
            label: 'Rent — Rue des Champs, Etterbeek',
            amountCents: -118000,
            category: 'housing',
            flag: 'new rent',
        },
    ],
    signals: [
        {
            id: 'yasmine-sig-joint-closed',
            label: 'Your joint account was closed',
            detail: 'Your joint account was closed on 9 Sep and your share of €1.820 moved to your own account.',
            source: 'products',
            strength: 0.9,
            observedAt: '3 weeks ago',
        },
        {
            id: 'yasmine-sig-rent',
            label: 'You pay rent at a new address',
            detail: 'You paid your first rent of €1.180 in Etterbeek and set up energy at the same address.',
            source: 'transactions',
            strength: 0.8,
            observedAt: '4 weeks ago',
        },
        {
            id: 'yasmine-sig-lawyer',
            label: 'Some one-off legal costs',
            detail: 'You paid €1.450 to a law firm, the second invoice since July. We count these as one-off costs.',
            source: 'transactions',
            strength: 0.7,
            observedAt: '4 days ago',
        },
        {
            id: 'yasmine-sig-address',
            label: 'You updated your address',
            detail: 'You changed your address to Etterbeek in the app, with Nora living with you.',
            source: 'life_event',
            strength: 0.75,
            observedAt: '3 weeks ago',
        },
        {
            id: 'yasmine-sig-budget-tab',
            label: 'You keep a close eye on your balance',
            detail: 'You checked your balance more often than usual this week. A clear overview might make that easier.',
            source: 'app_behaviour',
            strength: 0.6,
            observedAt: 'this week',
        },
        {
            id: 'yasmine-sig-kate',
            label: 'You asked Kate about child support',
            detail: "You asked Kate: 'How do I see if a child support payment came in?'",
            source: 'kate',
            strength: 0.65,
            observedAt: '5 days ago',
        },
        {
            id: 'yasmine-sig-beneficiary',
            label: 'Your life insurance has an old beneficiary',
            detail: 'Your KBC Leven policy still names your ex-partner as beneficiary, as set up in 2017.',
            source: 'products',
            strength: 0.7,
            observedAt: 'today',
        },
    ],
    moments: [
        {
            id: 'yasmine-mom-one-income',
            title: 'Your first month on one income',
            narrative:
                'Rent, school and daily costs now run on your salary alone. This month you spent a little more than came in, mostly because of one-off costs.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 92,
            impactCents: -7000,
            signalIds: [
                'yasmine-sig-joint-closed',
                'yasmine-sig-rent',
                'yasmine-sig-lawyer',
                'yasmine-sig-budget-tab',
            ],
        },
        {
            id: 'yasmine-mom-beneficiaries',
            title: 'Your insurance still points to your old situation',
            narrative:
                'Your life insurance still names your ex-partner as beneficiary, and your home cover is at the old address. Worth updating when you feel ready.',
            horizon: 'in the coming weeks',
            daysAhead: 21,
            confidence: 85,
            signalIds: ['yasmine-sig-beneficiary', 'yasmine-sig-address'],
        },
        {
            id: 'yasmine-mom-single-parent',
            title: 'A new routine as a single parent',
            narrative:
                'Child support, Groeipakket and school costs will settle into a new monthly rhythm. A clear view helps you plan ahead.',
            horizon: 'in ~1 month',
            daysAhead: 30,
            confidence: 74,
            signalIds: [
                'yasmine-sig-kate',
                'yasmine-sig-address',
                'yasmine-sig-rent',
            ],
        },
        {
            id: 'yasmine-mom-tax',
            title: 'Your tax situation changes',
            narrative:
                'As a single parent with Nora living with you, you may get a higher tax-free amount. It applies to next year’s tax return.',
            horizon: '~6 months',
            daysAhead: 180,
            confidence: 60,
            impactCents: 60000,
            signalIds: ['yasmine-sig-address', 'yasmine-sig-joint-closed'],
        },
    ],
    recommendations: [
        {
            id: 'yasmine-rec-checkup',
            momentId: 'yasmine-mom-one-income',
            kind: 'human',
            title: 'A calm finance check-up, with a person',
            body: 'Thirty minutes with a KBC advisor, by phone or at the branch. You decide what to talk about. Nothing to sign.',
            cta: 'Choose a moment',
            valueToCustomer: 'Someone to think along, at your pace',
            scores: {
                relevance: 90,
                timing: 85,
                customerValue: 90,
                kbcValue: 35,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'If it helps, an advisor can look at everything with you. No pressure.',
                },
                {
                    channel: 'kate',
                    when: 'if you ask Kate about money again',
                    message:
                        'Would you like to talk to a person? I can book it.',
                },
                {
                    channel: 'advisor',
                    when: 'on booking',
                    message: 'Your advisor calls at the time you chose.',
                },
            ],
        },
        {
            id: 'yasmine-rec-budget-reset',
            momentId: 'yasmine-mom-one-income',
            kind: 'no_sale',
            title: 'A fresh start for your budget',
            body: 'We set up an overview with only your own income and costs, and mark the one-off ones like lawyer fees separately.',
            cta: 'Show my new overview',
            valueToCustomer: 'See where you stand, without the noise',
            scores: {
                relevance: 92,
                timing: 88,
                customerValue: 85,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your overview now shows only your own income and costs.',
                },
                {
                    channel: 'push',
                    when: 'Sun 19:00',
                    message:
                        'Your new monthly overview is ready. Take a look whenever it suits you.',
                },
            ],
        },
        {
            id: 'yasmine-rec-beneficiaries',
            momentId: 'yasmine-mom-beneficiaries',
            kind: 'no_sale',
            title: 'Checklist: update your beneficiaries',
            body: 'A short list of what usually needs updating after a separation: life insurance beneficiary, address on your policies, who can see your accounts.',
            cta: 'Open the checklist',
            valueToCustomer: 'Nothing forgotten, step by step',
            scores: {
                relevance: 80,
                timing: 70,
                customerValue: 85,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'in 1 week',
                    message:
                        'A short checklist for your policies and accounts, when you feel ready.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 10 days',
                    message: 'Your checklist, to keep for later.',
                },
            ],
        },
        {
            id: 'yasmine-rec-home-insurance',
            momentId: 'yasmine-mom-beneficiaries',
            kind: 'kbc',
            title: 'Tenant insurance for your new home',
            body: 'As a tenant you are liable for fire and water damage. KBC Woonverzekering covers your flat and belongings in Etterbeek.',
            cta: 'See the price',
            valueToCustomer: 'Covered at your new address',
            scores: {
                relevance: 75,
                timing: 70,
                customerValue: 70,
                kbcValue: 60,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'in the checklist',
                    message: 'Your new home is not insured with us yet.',
                },
                {
                    channel: 'advisor',
                    when: 'during the check-up, if you want',
                    message:
                        'Only if you bring it up: cover for your new flat.',
                },
            ],
        },
        {
            id: 'yasmine-rec-moving-partner',
            momentId: 'yasmine-mom-single-parent',
            kind: 'partner',
            partner: 'Familia Mediation (partner)',
            title: 'Family mediation and moving help',
            body: '10% off a certified family mediator and a moving service for single parents.',
            cta: 'Get 10% off',
            valueToCustomer: '10% off mediation',
            scores: {
                relevance: 70,
                timing: 75,
                customerValue: 60,
                kbcValue: 70,
            },
            channels: [
                {
                    channel: 'push',
                    when: 'Fri 12:00',
                    message: 'Moving or mediation? 10% off with our partner.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 3 days',
                    message: 'Partner offer for single parents.',
                },
            ],
        },
        {
            id: 'yasmine-rec-tax',
            momentId: 'yasmine-mom-tax',
            kind: 'no_sale',
            title: 'Single parent? Your tax-free amount may go up',
            body: 'A plain explanation of the single-parent supplement and what to check on your next tax return with FOD Financiën.',
            cta: 'Read the explainer',
            valueToCustomer: 'Possibly several hundred euros a year',
            scores: {
                relevance: 68,
                timing: 40,
                customerValue: 75,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'in March',
                    message:
                        'Tax season is coming. One thing to check as a single parent.',
                },
                {
                    channel: 'kate',
                    when: 'if you ask about taxes',
                    message: 'I can explain what changes for you this year.',
                },
            ],
        },
    ],
    state: {
        financialStress: false,
        vulnerable: false,
        sensitiveMoment: 'separation',
    },
    events: [
        {
            id: 'yasmine-evt-alimony',
            label: 'First alimony payment received',
            description:
                'The first monthly child support of €350 arrives from her ex-partner.',
            transaction: {
                id: 'yasmine-tx-alimony',
                date: '30 Sep',
                label: 'Child support — K. Peeters',
                amountCents: 35000,
                category: 'income',
                flag: 'new, monthly',
            },
            effect: {
                balanceDeltaCents: 35000,
                addSignals: [
                    {
                        id: 'yasmine-sig-alimony',
                        label: 'Your first child support payment arrived',
                        detail: 'You received €350 with the reference "onderhoudsbijdrage Nora". It will probably come every month.',
                        source: 'transactions',
                        strength: 0.85,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['yasmine-mom-one-income'],
                addMoments: [
                    {
                        id: 'yasmine-mom-one-income',
                        title: 'Your month closes slightly positive',
                        narrative:
                            'With the child support in, your income now covers your costs, even with the lawyer fees. Next month should be lighter.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 90,
                        impactCents: 28000,
                        signalIds: [
                            'yasmine-sig-alimony',
                            'yasmine-sig-rent',
                            'yasmine-sig-lawyer',
                        ],
                    },
                ],
                removeRecommendationIds: ['yasmine-rec-budget-reset'],
                addRecommendations: [
                    {
                        id: 'yasmine-rec-budget-reset-support',
                        momentId: 'yasmine-mom-one-income',
                        kind: 'no_sale',
                        title: 'Your overview now includes child support',
                        body: 'We added the €350 as expected monthly income, so you can see what is left each month. You can change or hide it at any time.',
                        cta: 'Show my overview',
                        valueToCustomer: 'A realistic view of each month',
                        scores: {
                            relevance: 92,
                            timing: 90,
                            customerValue: 85,
                            kbcValue: 5,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'Child support received. Your overview is updated.',
                            },
                            {
                                channel: 'kate',
                                when: 'if you ask',
                                message:
                                    'Yes, the payment came in today: €350 for Nora.',
                            },
                        ],
                    },
                ],
                greeting:
                    'The child support came in, Yasmine. Your month now closes slightly positive.',
                push: {
                    title: 'Payment received',
                    body: 'The child support of €350 arrived. Your overview is updated.',
                },
            },
        },
    ],
    cohort: {
        label: '4,100 KBC customers split a joint account in the last 60 days',
        size: 4100,
    },
};
