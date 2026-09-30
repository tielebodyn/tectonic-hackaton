import type { Persona } from '../../types';

export const marc: Persona = {
    id: 'marc',
    name: 'Marc Wouters',
    firstName: 'Marc',
    age: 64,
    city: 'Bruges',
    avatar: { initials: 'MW', hue: 205 },
    segment: 'Pre-retirees',
    lifeStage: 'Retiring in 4 months',
    tagline: 'Retires on 1 February after 41 years at the same employer',
    headline: 'Hospital cover ends when you retire',
    greeting:
        'Four months to go, Marc. Let us make sure your pension days start calm.',
    push: {
        title: 'Your hospital cover after 1 February',
        body: 'Your employer’s plan stops when you retire. You can keep the same cover, without a new medical check.',
    },
    kateOpener:
        'Hi Marc. You asked how much your pension will be. Based on mypension.be it is about €2.310 net a month. Want to see what that means for your monthly budget?',
    advisorBrief:
        'Marc Wouters (64), Bruges. Legal pension from 1 Feb 2027 (mypension.be estimate €2.310 net vs €3.980 net salary today). Group insurance with KBC pays ~€145k gross (~€126k net) at retirement. Collective hospitalisation plan via employer ends at retirement: individual continuation must be requested within 105 days, no medical exam or waiting period if on time. Travels a lot (€4.900 in 3 months), supports 2 grandchildren monthly, read the gifts & inheritance article twice. €48k on savings, no investments yet. Conservative profile likely. Goal: help him plan the lump sum calmly; do not push a product in the first call.',
    accounts: [
        {
            label: 'KBC Zichtrekening',
            iban: 'BE52 •••• 1187',
            balanceCents: 684000,
            kind: 'current',
        },
        {
            label: 'KBC Spaarrekening',
            iban: 'BE87 •••• 3340',
            balanceCents: 4830000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 398000, spendCents: 352000 },
    products: [
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Debit Card',
        'KBC Visa Card',
        'KBC Groepsverzekering (via employer)',
        'KBC Hospitalisatie (collective, via employer)',
        'KBC Autoverzekering',
    ],
    transactions: [
        {
            id: 'marc-tx-salary',
            date: '25 Sep',
            label: 'Brugse Havenlogistiek NV — salary',
            amountCents: 398000,
            category: 'income',
            flag: '4 salaries left',
        },
        {
            id: 'marc-tx-sunweb',
            date: '24 Sep',
            label: 'Sunweb — Tenerife, 2 persons',
            amountCents: -234000,
            category: 'leisure',
            flag: 'travel',
        },
        {
            id: 'marc-tx-colruyt',
            date: '22 Sep',
            label: 'Colruyt Brugge',
            amountCents: -13800,
            category: 'groceries',
        },
        {
            id: 'marc-tx-grandkids',
            date: '20 Sep',
            label: 'Standing order — savings Lotte & Wout',
            amountCents: -20000,
            category: 'transfer',
            flag: 'grandchildren',
        },
        {
            id: 'marc-tx-engie',
            date: '19 Sep',
            label: 'Engie — energy advance',
            amountCents: -16500,
            category: 'utilities',
        },
        {
            id: 'marc-tx-airline',
            date: '17 Sep',
            label: 'Brussels Airlines',
            amountCents: -61200,
            category: 'leisure',
            flag: 'travel',
        },
        {
            id: 'marc-tx-delhaize',
            date: '15 Sep',
            label: 'Delhaize Sint-Kruis',
            amountCents: -9600,
            category: 'groceries',
        },
        {
            id: 'marc-tx-proximus',
            date: '12 Sep',
            label: 'Proximus',
            amountCents: -8900,
            category: 'subscriptions',
        },
        {
            id: 'marc-tx-pharmacy',
            date: '10 Sep',
            label: 'Apotheek Sint-Andries',
            amountCents: -4200,
            category: 'health',
        },
        {
            id: 'marc-tx-car-ins',
            date: '5 Sep',
            label: 'KBC Verzekeringen — car insurance',
            amountCents: -5400,
            category: 'insurance',
        },
        {
            id: 'marc-tx-club',
            date: '1 Sep',
            label: 'Club Brugge — season ticket',
            amountCents: -39500,
            category: 'leisure',
        },
    ],
    signals: [
        {
            id: 'marc-sig-age',
            label: 'Your pension starts on 1 February',
            detail: 'You turn 65 in January, so your legal pension starts on the first day of the next month.',
            source: 'life_event',
            strength: 0.9,
            observedAt: 'known',
        },
        {
            id: 'marc-sig-group-ins',
            label: 'Your group insurance pays out when you retire',
            detail: 'Your employer’s KBC group insurance has built up about €145.000 before tax, paid to you in one go when you retire.',
            source: 'products',
            strength: 0.9,
            observedAt: 'today',
        },
        {
            id: 'marc-sig-hospi',
            label: 'Your hospital cover comes through your employer',
            detail: 'You are insured through your employer’s KBC hospitalisation plan, and that plan stops on the day you retire.',
            source: 'products',
            strength: 0.85,
            observedAt: 'today',
        },
        {
            id: 'marc-sig-mypension',
            label: 'Your pension estimate: €2.310 a month',
            detail: 'The estimate you shared from mypension.be is €2.310 net a month. Your salary today is €3.980 net.',
            source: 'external',
            strength: 0.7,
            observedAt: '9 days ago',
        },
        {
            id: 'marc-sig-kate',
            label: 'You asked Kate about your pension',
            detail: "You asked Kate: 'How much will my pension be?'",
            source: 'kate',
            strength: 0.8,
            observedAt: '9 days ago',
        },
        {
            id: 'marc-sig-travel',
            label: 'You love to travel',
            detail: 'You spent €4.900 on flights and holidays in the last 3 months, almost half of your free spending.',
            source: 'transactions',
            strength: 0.5,
            observedAt: '6 days ago',
        },
        {
            id: 'marc-sig-grandkids',
            label: 'You save for Lotte and Wout',
            detail: 'Since 2021 you put €100 a month aside for each of your grandchildren.',
            source: 'transactions',
            strength: 0.55,
            observedAt: '10 days ago',
        },
        {
            id: 'marc-sig-gift-article',
            label: 'You read about gifts to grandchildren',
            detail: "You opened the article 'Gifts to grandchildren: what you should know' twice this month.",
            source: 'app_behaviour',
            strength: 0.45,
            observedAt: '4 days ago',
        },
    ],
    moments: [
        {
            id: 'marc-mom-hospi',
            title: 'Your hospital cover stops when you retire',
            narrative:
                'Your employer’s plan ends on 1 February. You can keep the same cover on your own, without medical check or waiting period, if you ask within 105 days.',
            horizon: 'in ~4 months',
            daysAhead: 124,
            confidence: 88,
            signalIds: ['marc-sig-hospi', 'marc-sig-age'],
        },
        {
            id: 'marc-mom-income-drop',
            title: 'Your monthly income drops by about €1.670',
            narrative:
                'From February your pension replaces your salary: roughly €2.310 instead of €3.980. Worth seeing what that means before it happens.',
            horizon: 'in ~4 months',
            daysAhead: 124,
            confidence: 78,
            impactCents: -167000,
            signalIds: [
                'marc-sig-mypension',
                'marc-sig-kate',
                'marc-sig-age',
                'marc-sig-travel',
            ],
        },
        {
            id: 'marc-mom-lump-sum',
            title: 'About €126.000 lands on your account',
            narrative:
                'Your group insurance pays out when you retire, about €126.000 after tax. A calm plan now beats a rushed decision in February.',
            horizon: 'in ~4 months',
            daysAhead: 124,
            confidence: 85,
            impactCents: 12600000,
            signalIds: ['marc-sig-group-ins', 'marc-sig-age'],
        },
        {
            id: 'marc-mom-estate',
            title: 'Helping your grandchildren, the smart way',
            narrative:
                'You already save for Lotte and Wout. A registered gift or a gift by bank transfer can help them more, but the rules on timing matter.',
            horizon: '~6 months',
            daysAhead: 180,
            confidence: 58,
            signalIds: [
                'marc-sig-grandkids',
                'marc-sig-gift-article',
                'marc-sig-group-ins',
            ],
        },
    ],
    recommendations: [
        {
            id: 'marc-rec-hospi',
            momentId: 'marc-mom-hospi',
            kind: 'kbc',
            title: 'Keep your hospital cover after you retire',
            body: 'Continue your current KBC hospitalisation plan on your own. Same cover, no medical questions, no waiting period. We fill in the form with you.',
            cta: 'Keep my cover',
            valueToCustomer: 'No gap in cover, no new medical check at 65',
            scores: {
                relevance: 92,
                timing: 90,
                customerValue: 95,
                kbcValue: 55,
            },
            channels: [
                {
                    channel: 'push',
                    when: 'Tue 10:00',
                    message:
                        'Your hospital cover after 1 February: keep it with one tap.',
                },
                {
                    channel: 'app',
                    when: 'on tap',
                    message:
                        'Pre-filled continuation form and your new monthly premium.',
                },
                {
                    channel: 'email',
                    when: 'if not done in 14 days',
                    message:
                        'Reminder: request within 105 days of retiring to keep your rights.',
                },
                {
                    channel: 'advisor',
                    when: 'if not done by 1 Jan',
                    message: 'Your KBC advisor calls to arrange it together.',
                },
            ],
        },
        {
            id: 'marc-rec-lump-sum-advisor',
            momentId: 'marc-mom-lump-sum',
            kind: 'human',
            title: 'Plan your lump sum with a KBC advisor',
            body: 'Sit down with an advisor in Bruges before February. Travel, grandchildren, a safety buffer: first your plans, then the numbers.',
            cta: 'Book a meeting',
            valueToCustomer: 'A plan for €126.000 that fits your life',
            scores: {
                relevance: 85,
                timing: 65,
                customerValue: 85,
                kbcValue: 75,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your group insurance pays out in February. Want to plan it with someone?',
                },
                {
                    channel: 'kate',
                    when: 'next time you open Kate',
                    message: 'I can book you a meeting at KBC Brugge Markt.',
                },
                {
                    channel: 'branch',
                    when: 'on booking',
                    message:
                        'KBC Brugge Markt, 60 minutes, bring your pension letter.',
                },
            ],
        },
        {
            id: 'marc-rec-pension-budget',
            momentId: 'marc-mom-income-drop',
            kind: 'no_sale',
            title: 'Your pension budget: what changes',
            body: 'We compare your last 12 months of spending with your pension estimate, category by category. Travel stays possible, you will see how.',
            cta: 'See my pension budget',
            valueToCustomer: 'No surprises in February',
            scores: {
                relevance: 88,
                timing: 80,
                customerValue: 82,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now',
                    message:
                        'You asked about your pension. Here is your budget with €2.310 a month.',
                },
                {
                    channel: 'app',
                    when: 'on tap',
                    message:
                        'Side-by-side view: salary today vs pension from February.',
                },
            ],
        },
        {
            id: 'marc-rec-gifts',
            momentId: 'marc-mom-estate',
            kind: 'no_sale',
            title: 'Gifts to grandchildren, explained',
            body: 'Registered gift or gift by bank transfer, what it costs and why timing matters. A 4-minute read, no advice attached.',
            cta: 'Read the guide',
            valueToCustomer: 'Understand your options first',
            scores: {
                relevance: 65,
                timing: 40,
                customerValue: 70,
                kbcValue: 10,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'in the feed, next week',
                    message:
                        'Gifts to grandchildren: the rules in plain language.',
                },
                {
                    channel: 'email',
                    when: 'after the advisor meeting',
                    message: 'Guide attached, as discussed.',
                },
            ],
        },
        {
            id: 'marc-rec-invest-plan',
            momentId: 'marc-mom-lump-sum',
            kind: 'kbc',
            title: 'KBC investment plan, step by step',
            body: 'Invest part of your lump sum gradually over 12 months in a defensive fund, so you do not put everything in at one moment.',
            cta: 'Simulate a plan',
            valueToCustomer: 'Spreads risk over time',
            scores: {
                relevance: 70,
                timing: 45,
                customerValue: 65,
                kbcValue: 85,
            },
            channels: [
                {
                    channel: 'advisor',
                    when: 'during the lump-sum meeting',
                    message:
                        'Only if you want to invest: a careful plan that steps in bit by bit.',
                },
                {
                    channel: 'app',
                    when: 'after the meeting',
                    message:
                        'Your simulation from the meeting, to look at again at home.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'marc-evt-retirement-confirmed',
            label: 'Employer confirms retirement date',
            description:
                'HR confirms 31 January as Marc’s last working day. Pension and payout dates are now certain.',
            effect: {
                addSignals: [
                    {
                        id: 'marc-sig-confirmed',
                        label: 'Your retirement date is confirmed',
                        detail: 'Your employer confirmed 31 January 2027 as your last working day, and your payout is scheduled.',
                        source: 'life_event',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['marc-mom-hospi', 'marc-mom-income-drop'],
                addMoments: [
                    {
                        id: 'marc-mom-hospi',
                        title: 'Your hospital cover stops on 1 February',
                        narrative:
                            'It is official: your employer’s plan ends on 1 February. Arrange your own continuation now and you are covered from day one.',
                        horizon: 'on 1 Feb (in 124 days)',
                        daysAhead: 124,
                        confidence: 96,
                        signalIds: ['marc-sig-confirmed', 'marc-sig-hospi'],
                    },
                    {
                        id: 'marc-mom-income-drop',
                        title: 'Your last salary arrives on 25 January',
                        narrative:
                            'From February your pension of about €2.310 replaces your salary of €3.980. Your budget view is ready.',
                        horizon: 'on 1 Feb (in 124 days)',
                        daysAhead: 124,
                        confidence: 96,
                        impactCents: -167000,
                        signalIds: [
                            'marc-sig-confirmed',
                            'marc-sig-mypension',
                            'marc-sig-kate',
                        ],
                    },
                ],
                greeting:
                    'It is official, Marc: 31 January is your last working day. Congratulations.',
                push: {
                    title: 'Your retirement date is confirmed',
                    body: 'Three things to arrange before 1 February. The first takes 2 minutes.',
                },
            },
        },
        {
            id: 'marc-evt-lump-sum-paid',
            label: 'Group insurance lump sum paid out',
            description:
                'Fast-forward to February: €126.000 net lands on Marc’s current account.',
            transaction: {
                id: 'marc-tx-lump-sum',
                date: '3 Feb',
                label: 'KBC Groepsverzekering — payout',
                amountCents: 12600000,
                category: 'income',
                flag: 'one-off',
            },
            effect: {
                balanceDeltaCents: 12600000,
                removeMomentIds: ['marc-mom-lump-sum'],
                addMoments: [
                    {
                        id: 'marc-mom-lump-sum',
                        title: '€126.000 is on your current account',
                        narrative:
                            'Your group insurance paid out. There is no rush, but money on a current account earns nothing and is easy to spend without noticing.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 95,
                        impactCents: 12600000,
                        signalIds: ['marc-sig-group-ins'],
                    },
                ],
                removeRecommendationIds: ['marc-rec-lump-sum-advisor'],
                addRecommendations: [
                    {
                        id: 'marc-rec-lump-sum-advisor-now',
                        momentId: 'marc-mom-lump-sum',
                        kind: 'human',
                        title: 'Your advisor is ready when you are',
                        body: 'Your lump sum arrived. Nothing needs to happen today; when you are ready, your advisor in Bruges walks through your plan with you.',
                        cta: 'Book a meeting',
                        valueToCustomer: 'A plan for €126.000, at your pace',
                        scores: {
                            relevance: 92,
                            timing: 95,
                            customerValue: 88,
                            kbcValue: 75,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'next morning 09:00',
                                message:
                                    'Your group insurance paid out. Want to plan it together?',
                            },
                            {
                                channel: 'advisor',
                                when: 'if no booking in 7 days',
                                message:
                                    'Your advisor calls once, just to offer a meeting.',
                            },
                        ],
                    },
                ],
                greeting:
                    'Your group insurance has arrived, Marc. Take your time, we are here when you want to plan.',
                push: {
                    title: '€126.000 received',
                    body: 'Your group insurance paid out. No rush. Your advisor can help you plan.',
                },
            },
        },
    ],
    cohort: {
        label: '31,800 KBC customers retire in the next 6 months',
        size: 31800,
    },
};
