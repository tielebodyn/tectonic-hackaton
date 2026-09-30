import type { Persona } from '../../types';

export const karim: Persona = {
    id: 'karim',
    name: 'Karim Benali',
    firstName: 'Karim',
    age: 47,
    city: 'Ghent',
    avatar: { initials: 'KB', hue: 95 },
    segment: 'Self-employed',
    lifeStage: 'Freelancer under pressure',
    tagline: 'Self-employed graphic designer, big client paying late',
    headline: '€900 short when BTW is due',
    greeting:
        'A tight few weeks, Karim. Let’s get you through 20 October together.',
    push: {
        title: 'A heads-up about 20 October',
        body: 'Your BTW payment may not fit yet. No stress: here are 3 ways to handle it, and someone to talk to if you want.',
    },
    kateOpener:
        'Hi Karim. You asked if you can pay your BTW in instalments: yes, FOD Financiën allows a payment plan. Want me to show you how, step by step?',
    advisorBrief:
        'Self-employed graphic designer (eenmanszaak), KBC customer 11 years. Revenue down from ~€4.100/month (2025) to ~€2.100. Main client Studio Noord BV (normally €3.200/month) has an invoice open for 62 days. Business balance fell from €2.210 to €640 in 8 weeks. First-ever BNPL use (Klarna, 3x €46,33). Q3 BTW of ~€1.700 due 20 Oct → projected shortfall ~€900. Asked Kate about paying VAT in instalments. Financial-stress guardrail is ON: no product sales in this call. Goal: listen, explain the FOD payment plan, help plan a friendly reminder to Studio Noord, check fixed costs. Only discuss credit if Karim brings it up himself.',
    accounts: [
        {
            label: 'KBC Business Zichtrekening',
            iban: 'BE47 •••• 6152',
            balanceCents: 64000,
            kind: 'business',
        },
        {
            label: 'Zichtrekening',
            iban: 'BE31 •••• 0874',
            balanceCents: 41020,
            kind: 'current',
        },
        {
            label: 'Spaarrekening',
            iban: 'BE58 •••• 3390',
            balanceCents: 15000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 210000, spendCents: 290000 },
    products: [
        'KBC Business Zichtrekening',
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Business Debetkaart',
        'KBC Visa Card',
    ],
    transactions: [
        {
            id: 'karim-tx-1',
            date: '29 Sep',
            label: 'Klarna · Coolblue (1/3)',
            amountCents: -4633,
            category: 'bnpl',
            flag: 'first BNPL',
        },
        {
            id: 'karim-tx-2',
            date: '28 Sep',
            label: 'Colruyt Gent Sint-Amandsberg',
            amountCents: -5240,
            category: 'groceries',
        },
        {
            id: 'karim-tx-3',
            date: '26 Sep',
            label: 'Adobe Creative Cloud',
            amountCents: -6649,
            category: 'subscriptions',
            flag: 'overlap',
        },
        {
            id: 'karim-tx-4',
            date: '24 Sep',
            label: 'Canva Pro',
            amountCents: -1199,
            category: 'subscriptions',
            flag: 'unused',
        },
        {
            id: 'karim-tx-5',
            date: '22 Sep',
            label: 'Bakkerij De Vos, logo',
            amountCents: 52000,
            category: 'business',
            flag: 'small client',
        },
        {
            id: 'karim-tx-6',
            date: '20 Sep',
            label: 'Transfer to own Zichtrekening',
            amountCents: -120000,
            category: 'transfer',
        },
        {
            id: 'karim-tx-7',
            date: '18 Sep',
            label: 'Adobe Stock',
            amountCents: -3599,
            category: 'subscriptions',
            flag: 'unused',
        },
        {
            id: 'karim-tx-8',
            date: '15 Sep',
            label: 'Liantis sociale bijdragen',
            amountCents: -89000,
            category: 'tax',
        },
        {
            id: 'karim-tx-9',
            date: '10 Sep',
            label: 'Proximus Business',
            amountCents: -6500,
            category: 'utilities',
        },
        {
            id: 'karim-tx-10',
            date: '5 Sep',
            label: 'Huur atelier Dok Noord',
            amountCents: -45000,
            category: 'business',
        },
        {
            id: 'karim-tx-11',
            date: '28 Jul',
            label: 'Studio Noord BV',
            amountCents: 320000,
            category: 'business',
            flag: 'last payment',
        },
    ],
    signals: [
        {
            id: 'karim-sig-late-invoice',
            label: 'Studio Noord has not paid for 2 months',
            detail: 'Studio Noord usually pays you €3.200 a month. The last payment was on 28 Jul, nothing since.',
            source: 'transactions',
            strength: 0.9,
            observedAt: 'this week',
        },
        {
            id: 'karim-sig-balance',
            label: 'Your business balance is dropping',
            detail: 'Your business account went from €2.210 to €640 in 8 weeks.',
            source: 'transactions',
            strength: 0.85,
            observedAt: 'today',
        },
        {
            id: 'karim-sig-vat',
            label: 'Your BTW payment is due on 20 Oct',
            detail: 'FOD Financiën: your Q3 BTW is due on 20 Oct. Based on your Q2 payment, about €1.700.',
            source: 'external',
            strength: 0.9,
            observedAt: 'this month',
        },
        {
            id: 'karim-sig-bnpl',
            label: 'You used buy-now-pay-later',
            detail: 'You split a Coolblue purchase in 3 with Klarna. It is the first time in 11 years with us.',
            source: 'transactions',
            strength: 0.75,
            observedAt: '1 day ago',
        },
        {
            id: 'karim-sig-app',
            label: 'You check your balance a lot',
            detail: 'You checked your business balance 11 times this week. Usually it is twice.',
            source: 'app_behaviour',
            strength: 0.7,
            observedAt: 'this week',
        },
        {
            id: 'karim-sig-kate',
            label: 'You asked Kate about your BTW',
            detail: "You asked Kate: 'can I pay my VAT in instalments?'",
            source: 'kate',
            strength: 0.85,
            observedAt: '2 days ago',
        },
        {
            id: 'karim-sig-subs',
            label: 'You pay for tools you do not use',
            detail: 'You pay for Canva Pro and Adobe Stock, but you do all your work in Adobe Creative Cloud. €48 a month.',
            source: 'transactions',
            strength: 0.5,
            observedAt: '6 days ago',
        },
        {
            id: 'karim-sig-sector',
            label: 'Clients are paying later everywhere',
            detail: 'Graydon: late B2B payments in Flemish creative services are up 14% compared to last year. It is not just you.',
            source: 'external',
            strength: 0.4,
            observedAt: 'this month',
        },
    ],
    moments: [
        {
            id: 'karim-mom-shortfall',
            title: '€900 short when BTW is due',
            narrative:
                'On 20 Oct you need about €1.700 for BTW. With what is coming in, you will be roughly €900 short. There are good ways to handle this.',
            horizon: 'in 20 days',
            daysAhead: 20,
            confidence: 86,
            impactCents: -90000,
            signalIds: [
                'karim-sig-vat',
                'karim-sig-balance',
                'karim-sig-late-invoice',
                'karim-sig-kate',
                'karim-sig-app',
            ],
        },
        {
            id: 'karim-mom-late-invoice',
            title: 'Your €3.200 invoice is 2 months late',
            narrative:
                'Studio Noord has not paid since July. Late payments happen more often now, and a friendly reminder often solves it.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 90,
            impactCents: 320000,
            signalIds: ['karim-sig-late-invoice', 'karim-sig-sector'],
        },
        {
            id: 'karim-mom-costs',
            title: 'Your fixed costs outgrew your income',
            narrative:
                'Since the summer you spend about €800 more than comes in. Some of that is easy to cut.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 72,
            impactCents: -4800,
            signalIds: [
                'karim-sig-subs',
                'karim-sig-bnpl',
                'karim-sig-balance',
            ],
        },
    ],
    recommendations: [
        {
            id: 'karim-rec-credit',
            momentId: 'karim-mom-shortfall',
            kind: 'kbc',
            title: 'KBC Business cash credit',
            body: 'A flexible credit line of up to €5.000 to bridge the BTW payment.',
            cta: 'Apply now',
            valueToCustomer: 'Bridges the €900 gap',
            scores: {
                relevance: 85,
                timing: 90,
                customerValue: 60,
                kbcValue: 85,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: 'Bridge your BTW with a KBC cash credit.',
                },
                {
                    channel: 'email',
                    when: 'Mon 08:00',
                    message:
                        'Flexible business credit, ready when you need it.',
                },
            ],
        },
        {
            id: 'karim-rec-accountant',
            momentId: 'karim-mom-late-invoice',
            kind: 'partner',
            partner: 'Accountable',
            title: 'Let Accountable handle invoicing and BTW',
            body: 'Automatic invoice reminders and BTW returns for freelancers, via our partner Accountable.',
            cta: 'Try 1 month free',
            valueToCustomer: 'Fewer late invoices',
            scores: {
                relevance: 70,
                timing: 60,
                customerValue: 65,
                kbcValue: 40,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Tired of chasing invoices? Accountable does it for you.',
                },
                {
                    channel: 'email',
                    when: 'in 3 days',
                    message: 'Freelancer admin, sorted: try Accountable.',
                },
            ],
        },
        {
            id: 'karim-rec-advisor',
            momentId: 'karim-mom-shortfall',
            kind: 'human',
            title: 'Want an advisor to call you?',
            body: 'No sales talk. Someone who knows self-employed life looks at the next few weeks with you and helps you make a plan.',
            cta: 'Yes, call me',
            valueToCustomer: 'A plan in 20 minutes',
            scores: {
                relevance: 85,
                timing: 90,
                customerValue: 90,
                kbcValue: 20,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Want someone to look at the next weeks with you? No sales talk.',
                },
                {
                    channel: 'kate',
                    when: 'next time he opens Kate',
                    message:
                        'I can also ask a person to call you. Today or tomorrow?',
                },
                {
                    channel: 'advisor',
                    when: 'within 4 working hours after "yes"',
                    message:
                        'Advisor calls with the brief. Guardrail on: no products.',
                },
            ],
        },
        {
            id: 'karim-rec-vat-plan',
            momentId: 'karim-mom-shortfall',
            kind: 'no_sale',
            title: 'Ask FOD Financiën for a BTW payment plan',
            body: 'You can ask to pay your BTW in instalments. We prefilled the request with your numbers. Ask before 20 Oct.',
            cta: 'Show me how',
            valueToCustomer: 'Spreads €1.700 over 3 months',
            scores: {
                relevance: 85,
                timing: 85,
                customerValue: 85,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now (answer to his question)',
                    message: 'Yes, you can. Here is the request, prefilled.',
                },
                {
                    channel: 'app',
                    when: 'now',
                    message: 'Pay BTW in instalments: 3 steps, 10 minutes.',
                },
                {
                    channel: 'push',
                    when: 'Wed 14 Oct 09:00, if not done',
                    message:
                        '6 days until BTW. The payment plan request takes 10 minutes.',
                },
            ],
        },
        {
            id: 'karim-rec-reminder',
            momentId: 'karim-mom-late-invoice',
            kind: 'no_sale',
            title: 'Send Studio Noord a friendly reminder',
            body: 'We drafted a polite reminder with the invoice attached and a payment link. You check it and send it.',
            cta: 'Review the reminder',
            valueToCustomer: '€3.200 back in your account',
            scores: {
                relevance: 80,
                timing: 80,
                customerValue: 80,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Studio Noord is 62 days late. Send a friendly reminder?',
                },
                {
                    channel: 'email',
                    when: 'if not sent in 2 days',
                    message: 'Your drafted reminder to Studio Noord is ready.',
                },
            ],
        },
        {
            id: 'karim-rec-subscriptions',
            momentId: 'karim-mom-costs',
            kind: 'no_sale',
            title: 'Cancel 2 unused subscriptions',
            body: 'Canva Pro and Adobe Stock overlap with Adobe Creative Cloud, which you use every day. Cancelling both saves €48 a month.',
            cta: 'Show me how to cancel',
            valueToCustomer: 'Saves €576 a year',
            scores: {
                relevance: 80,
                timing: 80,
                customerValue: 75,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Adobe + Canva overlap. Cancel 2 and save €48/month.',
                },
                {
                    channel: 'push',
                    when: 'before next Canva renewal (23 Oct)',
                    message: 'Canva renews tomorrow. Still want it?',
                },
            ],
        },
    ],
    state: { financialStress: true, vulnerable: false },
    events: [
        {
            id: 'karim-evt-invoice',
            label: 'Studio Noord pays €3.200 invoice',
            description:
                'Studio Noord finally pays the overdue July invoice into Karim’s business account.',
            transaction: {
                id: 'karim-tx-evt-invoice',
                date: '30 Sep',
                label: 'Studio Noord BV, factuur 2026-031',
                amountCents: 320000,
                category: 'business',
                flag: 'finally paid',
            },
            effect: {
                balanceDeltaCents: 320000,
                setState: { financialStress: false },
                addSignals: [
                    {
                        id: 'karim-sig-paid',
                        label: 'Studio Noord paid you',
                        detail: 'Studio Noord paid your €3.200 invoice today. Your business balance is now €3.840.',
                        source: 'transactions',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeSignalIds: [
                    'karim-sig-late-invoice',
                    'karim-sig-balance',
                    'karim-sig-app',
                    'karim-sig-kate',
                    'karim-sig-bnpl',
                ],
                removeMomentIds: [
                    'karim-mom-shortfall',
                    'karim-mom-late-invoice',
                ],
                addMoments: [
                    {
                        id: 'karim-mom-vat-covered',
                        title: 'Your BTW is covered',
                        narrative:
                            'After paying €1.700 on 20 Oct, you will still have about €2.300 on your business account.',
                        horizon: 'in 20 days',
                        daysAhead: 20,
                        confidence: 94,
                        impactCents: 230000,
                        signalIds: ['karim-sig-paid', 'karim-sig-vat'],
                    },
                    {
                        id: 'karim-mom-tax-buffer',
                        title: 'Next quarter, without the stress',
                        narrative:
                            'Setting aside 21% of every invoice as it comes in means the next BTW payment is already waiting for you in January.',
                        horizon: 'in ~3 months',
                        daysAhead: 90,
                        confidence: 70,
                        signalIds: [
                            'karim-sig-paid',
                            'karim-sig-vat',
                            'karim-sig-sector',
                        ],
                    },
                ],
                removeRecommendationIds: [
                    'karim-rec-credit',
                    'karim-rec-advisor',
                    'karim-rec-vat-plan',
                    'karim-rec-reminder',
                    'karim-rec-accountant',
                ],
                addRecommendations: [
                    {
                        id: 'karim-rec-all-clear',
                        momentId: 'karim-mom-vat-covered',
                        kind: 'no_sale',
                        title: 'BTW covered. Nothing to do.',
                        body: 'The €1.700 on 20 Oct fits, with about €2.300 to spare. You can drop the payment plan request.',
                        cta: 'See my October',
                        valueToCustomer: 'One less worry',
                        scores: {
                            relevance: 95,
                            timing: 95,
                            customerValue: 75,
                            kbcValue: 0,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Studio Noord paid. Your BTW is covered 🙌',
                            },
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'October looks fine now. Here is the overview.',
                            },
                        ],
                    },
                    {
                        id: 'karim-rec-vat-pot',
                        momentId: 'karim-mom-tax-buffer',
                        kind: 'kbc',
                        title: 'An automatic BTW pot',
                        body: 'Every time a client pays, we move 21% to a separate KBC Business Spaarrekening. Your BTW is ready when FOD Financiën asks.',
                        cta: 'Set up my BTW pot',
                        valueToCustomer: 'No more BTW surprises',
                        scores: {
                            relevance: 85,
                            timing: 75,
                            customerValue: 85,
                            kbcValue: 45,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'tomorrow 09:00',
                                message:
                                    'Make next quarter easy: 21% of each invoice, set aside.',
                            },
                            {
                                channel: 'email',
                                when: 'if not opened in 1 week',
                                message:
                                    'How other freelancers never worry about BTW.',
                            },
                        ],
                    },
                    {
                        id: 'karim-rec-accountant',
                        momentId: 'karim-mom-tax-buffer',
                        kind: 'partner',
                        partner: 'Accountable',
                        title: 'Let Accountable remind clients for you',
                        body: 'Automatic invoice reminders and BTW returns for freelancers, via our partner Accountable. Only if you want it.',
                        cta: 'Try 1 month free',
                        valueToCustomer: 'Fewer late invoices',
                        scores: {
                            relevance: 65,
                            timing: 50,
                            customerValue: 65,
                            kbcValue: 40,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'in 1 week',
                                message:
                                    'Late invoices again someday? Accountable can chase them for you.',
                            },
                            {
                                channel: 'email',
                                when: 'in 2 weeks',
                                message: 'Freelancer admin, sorted.',
                            },
                        ],
                    },
                ],
                greeting:
                    'Breathe out, Karim. Studio Noord paid and your BTW is covered.',
                push: {
                    title: 'Studio Noord just paid €3.200 🙌',
                    body: 'Your BTW on 20 Oct is covered, with about €2.300 to spare. Nothing else to do.',
                },
            },
        },
    ],
    cohort: {
        label: '3,100 self-employed KBC customers face a BTW shortfall this quarter',
        size: 3100,
    },
};
