import type { Persona } from '../../types';

export const emmaWout: Persona = {
    id: 'emma-wout',
    name: 'Emma & Wout De Smet',
    firstName: 'Emma & Wout',
    age: 31,
    city: 'Leuven',
    avatar: { initials: 'ED', hue: 250 },
    segment: 'Newlyweds',
    lifeStage: 'Just married, house hunting',
    tagline: 'Married 3 weeks ago, looking at houses around Leuven',
    headline: 'Close to mortgage-ready',
    greeting: 'Congratulations on your wedding, Emma and Wout! 💍',
    push: {
        title: 'How much can you borrow together?',
        body: 'We ran the numbers on your real incomes. Your answer is ready, no strings attached.',
    },
    kateOpener:
        'Hi Emma and Wout, congratulations! You asked how much you can borrow. With your two incomes it is about €340.000. Want to see how we got there?',
    advisorBrief:
        'Newlyweds (married 9 Sep), joint account opened 2 weeks ago. Combined net income €6.400/month, no existing loans. Own funds: €32.000 savings + €14.300 wedding gifts on the joint account = ~€46.000. Used the mortgage simulator 4x this week via Immoweb, looking at €380–420k houses in Heverlee/Kessel-Lo. Indicative borrowing capacity ~€340k (20y, 1/3 rule). Asked Kate "how much can we borrow?". Open points: beneficiary on Wout’s 2019 KBC Life policy still his parents; Emma has an individual hospitalisation plan. Tone: celebratory, not pushy. They have not asked for a meeting yet: offer, don’t book.',
    accounts: [
        {
            label: 'Gezamenlijke Zichtrekening',
            iban: 'BE36 •••• 8124',
            balanceCents: 1648000,
            kind: 'current',
        },
        {
            label: 'Spaarrekening',
            iban: 'BE85 •••• 1907',
            balanceCents: 3200000,
            kind: 'savings',
        },
        {
            label: 'Zichtrekening Wout',
            iban: 'BE09 •••• 4471',
            balanceCents: 214000,
            kind: 'current',
        },
    ],
    monthly: { incomeCents: 640000, spendCents: 480000 },
    products: [
        'KBC Gezamenlijke Zichtrekening',
        'KBC Spaarrekening',
        'KBC Life (Wout, 2019)',
        'KBC Hospitalisatieverzekering (Emma)',
        '2x KBC Debetkaart',
    ],
    transactions: [
        {
            id: 'emma-wout-tx-1',
            date: '29 Sep',
            label: 'Delhaize Heverlee',
            amountCents: -8740,
            category: 'groceries',
        },
        {
            id: 'emma-wout-tx-2',
            date: '28 Sep',
            label: 'Tante Marleen, "voor jullie huisje!"',
            amountCents: 50000,
            category: 'transfer',
            flag: 'wedding gift',
        },
        {
            id: 'emma-wout-tx-3',
            date: '25 Sep',
            label: 'Salaris Emma (KU Leuven)',
            amountCents: 310000,
            category: 'income',
        },
        {
            id: 'emma-wout-tx-4',
            date: '25 Sep',
            label: 'Salaris Wout (Colruyt Group)',
            amountCents: 330000,
            category: 'income',
        },
        {
            id: 'emma-wout-tx-5',
            date: '24 Sep',
            label: 'Huur appartement Leuven',
            amountCents: -115000,
            category: 'housing',
        },
        {
            id: 'emma-wout-tx-6',
            date: '21 Sep',
            label: '12 transfers, "proficiat!"',
            amountCents: 185000,
            category: 'transfer',
            flag: 'wedding gifts',
        },
        {
            id: 'emma-wout-tx-7',
            date: '18 Sep',
            label: 'Traiteur Hof ter Linden',
            amountCents: -640000,
            category: 'leisure',
            flag: 'wedding',
        },
        {
            id: 'emma-wout-tx-8',
            date: '16 Sep',
            label: 'Transfer from Wout to joint account',
            amountCents: 150000,
            category: 'transfer',
            flag: 'new joint account',
        },
        {
            id: 'emma-wout-tx-9',
            date: '14 Sep',
            label: 'Brussels Airlines (honeymoon)',
            amountCents: -142000,
            category: 'leisure',
        },
        {
            id: 'emma-wout-tx-10',
            date: '12 Sep',
            label: '31 transfers, "voor het bruidspaar"',
            amountCents: 680000,
            category: 'transfer',
            flag: 'wedding gifts',
        },
    ],
    signals: [
        {
            id: 'emma-wout-sig-married',
            label: 'You got married',
            detail: 'Your civil status changed to married on 9 Sep. Congratulations!',
            source: 'life_event',
            strength: 0.95,
            observedAt: '3 weeks ago',
        },
        {
            id: 'emma-wout-sig-gifts',
            label: 'Wedding gifts are coming in',
            detail: 'You received €14.300 in 44 transfers with messages like "proficiat" and "voor jullie huisje".',
            source: 'transactions',
            strength: 0.9,
            observedAt: '2 days ago',
        },
        {
            id: 'emma-wout-sig-joint',
            label: 'You opened a joint account',
            detail: 'You opened a Gezamenlijke Zichtrekening 2 weeks ago, and both salaries now land there.',
            source: 'products',
            strength: 0.8,
            observedAt: '2 weeks ago',
        },
        {
            id: 'emma-wout-sig-simulator',
            label: 'You are exploring a mortgage',
            detail: 'You opened the mortgage simulator 4 times this week, via Immoweb listings between €380.000 and €420.000 in Heverlee and Kessel-Lo.',
            source: 'app_behaviour',
            strength: 0.85,
            observedAt: 'this week',
        },
        {
            id: 'emma-wout-sig-kate',
            label: 'You asked Kate about borrowing',
            detail: "You asked Kate: 'how much can we borrow together?'",
            source: 'kate',
            strength: 0.9,
            observedAt: '1 day ago',
        },
        {
            id: 'emma-wout-sig-beneficiary',
            label: 'Your policy still names your parents',
            detail: 'Wout, your KBC Life policy from 2019 still lists your parents as beneficiaries, not Emma.',
            source: 'products',
            strength: 0.6,
            observedAt: 'today',
        },
        {
            id: 'emma-wout-sig-wedding-costs',
            label: 'The wedding is paid',
            detail: 'You paid €21.400 for the wedding over 4 months (venue, catering, honeymoon). No more big wedding bills are expected.',
            source: 'transactions',
            strength: 0.55,
            observedAt: '12 days ago',
        },
        {
            id: 'emma-wout-sig-rates',
            label: 'Mortgage rates eased',
            detail: 'NBB: the average 20-year fixed mortgage rate is 3,3%, down 0,2 points since June.',
            source: 'external',
            strength: 0.5,
            observedAt: 'this month',
        },
    ],
    moments: [
        {
            id: 'emma-wout-mom-mortgage',
            title: 'You are close to mortgage-ready',
            narrative:
                'With two incomes and ~€46.000 of your own money, a house around €380.000 is within reach. You could be ready to make an offer within weeks.',
            horizon: 'in ~3 weeks',
            daysAhead: 21,
            confidence: 84,
            signalIds: [
                'emma-wout-sig-simulator',
                'emma-wout-sig-kate',
                'emma-wout-sig-joint',
                'emma-wout-sig-rates',
            ],
        },
        {
            id: 'emma-wout-mom-gifts',
            title: '€14.300 in gifts is sitting idle',
            narrative:
                'Your wedding gifts are on your current account, earning nothing. You will likely need them for the notary soon, so keep them safe and close.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 90,
            impactCents: 21000,
            signalIds: ['emma-wout-sig-gifts', 'emma-wout-sig-wedding-costs'],
        },
        {
            id: 'emma-wout-mom-combine',
            title: 'Two money lives become one',
            narrative:
                'Salaries on one account, shared rent, shared plans. It helps to see your joint budget in one place.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 88,
            signalIds: ['emma-wout-sig-joint', 'emma-wout-sig-married'],
        },
        {
            id: 'emma-wout-mom-cover',
            title: 'Your cover still fits single life',
            narrative:
                'Wout’s life policy names his parents, and you each have your own insurance. Worth a 10-minute check now that you are married.',
            horizon: 'in ~1 month',
            daysAhead: 30,
            confidence: 66,
            signalIds: ['emma-wout-sig-beneficiary', 'emma-wout-sig-married'],
        },
    ],
    recommendations: [
        {
            id: 'emma-wout-rec-simulation',
            momentId: 'emma-wout-mom-mortgage',
            kind: 'kbc',
            title: 'Your KBC Woningkrediet simulation',
            body: 'Based on your real incomes, not guesses: about €340.000 over 20 years, ~€1.950/month. Free, and it commits you to nothing.',
            cta: 'See our numbers',
            valueToCustomer: 'Know your budget before you visit',
            scores: {
                relevance: 90,
                timing: 85,
                customerValue: 85,
                kbcValue: 90,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'now (answer to her question)',
                    message:
                        'About €340.000 together. Want to see the breakdown?',
                },
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your borrowing capacity, based on your real incomes.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 3 days',
                    message:
                        'Your personal mortgage simulation, saved for you.',
                },
            ],
        },
        {
            id: 'emma-wout-rec-advisor',
            momentId: 'emma-wout-mom-mortgage',
            kind: 'human',
            title: 'Talk it through with a mortgage advisor',
            body: 'An advisor in Leuven can walk you through fees, rates and what to offer. Evening and video slots available.',
            cta: 'Pick a time',
            valueToCustomer: 'A clear plan before you make an offer',
            scores: {
                relevance: 85,
                timing: 75,
                customerValue: 85,
                kbcValue: 70,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after they view the simulation',
                    message:
                        'Questions about the numbers? Talk to an advisor, evenings too.',
                },
                {
                    channel: 'advisor',
                    when: 'only if they book',
                    message:
                        'Advisor gets the brief and calls at the chosen time.',
                },
                {
                    channel: 'branch',
                    when: 'if they prefer in person',
                    message: 'KBC Leuven Bondgenotenlaan, Saturday mornings.',
                },
            ],
        },
        {
            id: 'emma-wout-rec-gifts',
            momentId: 'emma-wout-mom-gifts',
            kind: 'no_sale',
            title: 'Park the gifts for your future home',
            body: 'Move them to your Spaarrekening: they earn interest and you can still use them for the notary anytime. Not investing, on purpose, since you may need it soon.',
            cta: 'Move €14.300',
            valueToCustomer: '~€210 interest a year',
            scores: {
                relevance: 80,
                timing: 75,
                customerValue: 80,
                kbcValue: 20,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        '€14.300 in gifts, earning nothing. One tap to park it safely.',
                },
                {
                    channel: 'push',
                    when: 'Sat 10:00',
                    message:
                        'Your wedding gifts could earn €210 a year while you look for a house.',
                },
            ],
        },
        {
            id: 'emma-wout-rec-joint-budget',
            momentId: 'emma-wout-mom-combine',
            kind: 'no_sale',
            title: 'One budget view for the two of you',
            body: 'See both incomes, shared costs and what is left in one screen. Each of you keeps your own private account too.',
            cta: 'Set up our budget',
            scores: {
                relevance: 80,
                timing: 80,
                customerValue: 75,
                kbcValue: 15,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: 'Your first month together: see it in one view.',
                },
                {
                    channel: 'email',
                    when: 'end of October',
                    message: 'Your first joint month, summed up.',
                },
            ],
        },
        {
            id: 'emma-wout-rec-beneficiary',
            momentId: 'emma-wout-mom-cover',
            kind: 'no_sale',
            title: 'Update your beneficiary, Wout',
            body: 'Your KBC Life policy still names your parents. Changing it to Emma takes 2 minutes and costs nothing.',
            cta: 'Update beneficiary',
            scores: {
                relevance: 70,
                timing: 55,
                customerValue: 80,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'next login (Wout)',
                    message:
                        'Your life policy still names your parents. Update it?',
                },
                {
                    channel: 'email',
                    when: 'if not done in 2 weeks',
                    message: 'Married? A 2-minute check on your policies.',
                },
            ],
        },
        {
            id: 'emma-wout-rec-family-insurance',
            momentId: 'emma-wout-mom-cover',
            kind: 'kbc',
            title: 'One family insurance for both of you',
            body: 'KBC Gezinsverzekering covers damage you cause to others, for both of you in one contract. Often cheaper than two separate ones.',
            cta: 'Compare with what we have',
            valueToCustomer: 'One contract instead of two',
            scores: {
                relevance: 65,
                timing: 50,
                customerValue: 65,
                kbcValue: 60,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after beneficiary is updated',
                    message:
                        'While you are at it: one family insurance for both?',
                },
                {
                    channel: 'email',
                    when: 'in 3 weeks',
                    message: 'Newlywed checklist: 3 things worth checking.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'emma-wout-evt-offer',
            label: 'Makes an offer on a house in Heverlee',
            description:
                'Emma and Wout upload a signed offer of €395.000 for a house in Heverlee in KBC Mobile.',
            effect: {
                addSignals: [
                    {
                        id: 'emma-wout-sig-offer',
                        label: 'You made an offer on a house',
                        detail: 'You uploaded a signed offer of €395.000 for a house in Heverlee.',
                        source: 'app_behaviour',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeSignalIds: ['emma-wout-sig-simulator'],
                removeMomentIds: ['emma-wout-mom-mortgage'],
                addMoments: [
                    {
                        id: 'emma-wout-mom-compromis',
                        title: 'Compromis in ~2 weeks: €39.500 deposit',
                        narrative:
                            'If your offer is accepted, you sign the compromis and pay a 10% deposit. Your savings and gifts cover it. The mortgage must be approved within about 4 months.',
                        horizon: 'in ~2 weeks',
                        daysAhead: 14,
                        confidence: 93,
                        impactCents: -3950000,
                        signalIds: [
                            'emma-wout-sig-offer',
                            'emma-wout-sig-gifts',
                            'emma-wout-sig-kate',
                        ],
                    },
                ],
                removeRecommendationIds: [
                    'emma-wout-rec-simulation',
                    'emma-wout-rec-advisor',
                ],
                addRecommendations: [
                    {
                        id: 'emma-wout-rec-preapproval',
                        momentId: 'emma-wout-mom-compromis',
                        kind: 'kbc',
                        title: 'Get your Woningkrediet pre-approved',
                        body: 'A written pre-approval for €340.000 makes your offer stronger and gives you certainty before the compromis.',
                        cta: 'Request pre-approval',
                        valueToCustomer: 'A stronger offer',
                        scores: {
                            relevance: 95,
                            timing: 95,
                            customerValue: 90,
                            kbcValue: 90,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'Offer made! Pre-approval in 48 hours makes it stronger.',
                            },
                            {
                                channel: 'email',
                                when: 'now',
                                message:
                                    'Your documents checklist for the Woningkrediet.',
                            },
                        ],
                    },
                    {
                        id: 'emma-wout-rec-advisor',
                        momentId: 'emma-wout-mom-compromis',
                        kind: 'human',
                        title: 'Your advisor calls you this week',
                        body: 'Before you sign the compromis, an advisor checks the deposit, the notary fees and the conditions with you.',
                        cta: 'Pick a time',
                        valueToCustomer: 'No surprises at the notary',
                        scores: {
                            relevance: 95,
                            timing: 90,
                            customerValue: 90,
                            kbcValue: 70,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Exciting! Want an advisor to check the compromis with you?',
                            },
                            {
                                channel: 'advisor',
                                when: 'within 2 working days',
                                message:
                                    'Advisor calls with the brief and the offer details.',
                            },
                            {
                                channel: 'branch',
                                when: 'if they prefer in person',
                                message:
                                    'KBC Heverlee, Naamsesteenweg: Saturday slots.',
                            },
                        ],
                    },
                ],
                greeting: 'Fingers crossed for Heverlee, Emma and Wout! 🏡',
                push: {
                    title: 'You made an offer 🏡',
                    body: 'Your savings and gifts cover the 10% deposit. Want your mortgage pre-approved before the compromis?',
                },
            },
        },
    ],
    cohort: {
        label: '2,100 KBC customers married in the last 3 months and are looking at homes',
        size: 2100,
    },
};
