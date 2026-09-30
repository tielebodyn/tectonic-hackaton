import type { Persona } from '../../types';

export const georgette: Persona = {
    id: 'georgette',
    name: 'Georgette Lambrecht',
    firstName: 'Georgette',
    age: 81,
    city: 'Kortrijk',
    avatar: { initials: 'GL', hue: 280 },
    segment: 'Seniors',
    lifeStage: 'Widow, living alone',
    tagline: 'Two unusual payments to a new account in the last 48 hours',
    headline: 'We held a payment to keep you safe',
    greeting:
        'Good morning, Georgette. We held one payment to be sure it is really you.',
    push: {
        title: 'We held a payment for you',
        body: 'Your €2.400 payment is on hold, just to be safe. Someone from KBC will call you today.',
    },
    kateOpener:
        'Hello Georgette. Nothing has been lost from your €2.400 payment, we are holding it. Did someone send you a message from a new phone number lately? You can simply tell me.',
    advisorBrief:
        'Georgette Lambrecht (81), Kortrijk, widow since 2019, lives alone. Very stable habits for years (pension €1.890 on the 1st, Colruyt, pharmacy, energy; largest payment in 5 years €640). Last 48h: €950 and €1.800 to a first-time payee BE•• •••• 7719, logins at 01:40, a third payment of €2.400 prepared and held by us. Matches the "hi grandma, new number" WhatsApp pattern; she asked the Kortrijk branch last month how to send money quickly to her grandson. Vulnerable flag on: no sales, no partner offers. Call calmly, never blame, ask open questions, offer a recall of the two payments and a trusted contact (daughter Annick is known).',
    accounts: [
        {
            label: 'KBC Zichtrekening',
            iban: 'BE58 •••• 2046',
            balanceCents: 318000,
            kind: 'current',
        },
        {
            label: 'KBC Spaarrekening',
            iban: 'BE95 •••• 7731',
            balanceCents: 4120000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 189000, spendCents: 142000 },
    products: [
        'KBC Zichtrekening',
        'KBC Spaarrekening',
        'KBC Debit Card',
        'KBC Woonverzekering',
        'KBC Mobile',
    ],
    transactions: [
        {
            id: 'georgette-tx-scam-2',
            date: '30 Sep',
            label: 'Transfer to BE•• •••• 7719 — "for Jonas phone + rent"',
            amountCents: -180000,
            category: 'transfer',
            flag: 'new payee, unusual',
        },
        {
            id: 'georgette-tx-scam-1',
            date: '29 Sep',
            label: 'Transfer to BE•• •••• 7719 — "new phone"',
            amountCents: -95000,
            category: 'transfer',
            flag: 'new payee',
        },
        {
            id: 'georgette-tx-colruyt-1',
            date: '27 Sep',
            label: 'Colruyt Kortrijk',
            amountCents: -4800,
            category: 'groceries',
        },
        {
            id: 'georgette-tx-pharmacy',
            date: '25 Sep',
            label: 'Apotheek De Kroon Kortrijk',
            amountCents: -2300,
            category: 'health',
        },
        {
            id: 'georgette-tx-bakery',
            date: '24 Sep',
            label: 'Bakkerij Vandaele',
            amountCents: -1200,
            category: 'groceries',
        },
        {
            id: 'georgette-tx-luminus',
            date: '22 Sep',
            label: 'Luminus — energy advance',
            amountCents: -11800,
            category: 'utilities',
        },
        {
            id: 'georgette-tx-homecare',
            date: '20 Sep',
            label: 'Wit-Gele Kruis — home care',
            amountCents: -3600,
            category: 'health',
        },
        {
            id: 'georgette-tx-proximus',
            date: '18 Sep',
            label: 'Proximus — landline & TV',
            amountCents: -4200,
            category: 'subscriptions',
        },
        {
            id: 'georgette-tx-colruyt-2',
            date: '15 Sep',
            label: 'Colruyt Kortrijk',
            amountCents: -5200,
            category: 'groceries',
        },
        {
            id: 'georgette-tx-pension',
            date: '1 Sep',
            label: 'Federale Pensioendienst — pension',
            amountCents: 189000,
            category: 'income',
        },
    ],
    signals: [
        {
            id: 'georgette-sig-new-payee',
            label: 'Two payments went to a new account',
            detail: 'Yesterday and today you sent money to an account you have never paid before.',
            source: 'transactions',
            strength: 0.95,
            observedAt: 'today',
        },
        {
            id: 'georgette-sig-amounts',
            label: 'These payments are bigger than usual',
            detail: 'In the last 5 years your largest payment was €640. These were €950 and €1.800.',
            source: 'transactions',
            strength: 0.8,
            observedAt: 'today',
        },
        {
            id: 'georgette-sig-night-login',
            label: 'You used the app late at night',
            detail: 'You logged in at 01:40, while you normally use the app in the morning.',
            source: 'app_behaviour',
            strength: 0.7,
            observedAt: 'last night',
        },
        {
            id: 'georgette-sig-pending',
            label: 'A third payment was ready to go',
            detail: 'You prepared €2.400 for the same account. We are holding it until we have spoken with you.',
            source: 'app_behaviour',
            strength: 0.9,
            observedAt: '1 hour ago',
        },
        {
            id: 'georgette-sig-grandson',
            label: 'You asked us about helping your grandson',
            detail: 'Last month you called our Kortrijk branch to ask how to send money quickly to your grandson.',
            source: 'external',
            strength: 0.6,
            observedAt: '4 weeks ago',
        },
        {
            id: 'georgette-sig-wave',
            label: '"New number" messages are going around',
            detail: 'Safeonweb and Febelfin warn about WhatsApp messages from people pretending to be a child or grandchild with a new phone number.',
            source: 'external',
            strength: 0.75,
            observedAt: 'this week',
        },
        {
            id: 'georgette-sig-routine',
            label: 'Your usual payments have not changed in years',
            detail: 'Colruyt, the pharmacy, home care, energy: the same calm rhythm since 2019.',
            source: 'transactions',
            strength: 0.4,
            observedAt: 'ongoing',
        },
    ],
    moments: [
        {
            id: 'georgette-mom-scam',
            title: 'Someone may be pretending to be family',
            narrative:
                'The two payments look a lot like a common trick where someone pretends to be a grandchild with a new phone number. If that happened, it is not your fault: these people are very convincing.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 91,
            impactCents: -275000,
            signalIds: [
                'georgette-sig-new-payee',
                'georgette-sig-amounts',
                'georgette-sig-wave',
                'georgette-sig-grandson',
            ],
        },
        {
            id: 'georgette-mom-third',
            title: 'Your €2.400 payment is on hold',
            narrative:
                'We have not sent your third payment yet. It stays safely on your account until you have spoken with us.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 86,
            impactCents: -240000,
            signalIds: [
                'georgette-sig-pending',
                'georgette-sig-night-login',
                'georgette-sig-new-payee',
            ],
        },
        {
            id: 'georgette-mom-trusted',
            title: 'Someone you trust could keep an eye out with you',
            narrative:
                'You can choose a person, like your daughter, who gets a message when something unusual happens on your account. They cannot pay anything, they only see alerts.',
            horizon: 'in ~2 weeks',
            daysAhead: 14,
            confidence: 70,
            signalIds: ['georgette-sig-routine', 'georgette-sig-grandson'],
        },
        {
            id: 'georgette-mom-pension',
            title: 'Your pension comes in tomorrow',
            narrative:
                'Your pension of €1.890 arrives on 1 October, as it does every month.',
            horizon: 'tomorrow',
            daysAhead: 1,
            confidence: 95,
            impactCents: 189000,
            signalIds: ['georgette-sig-routine'],
        },
    ],
    recommendations: [
        {
            id: 'georgette-rec-pause',
            momentId: 'georgette-mom-third',
            kind: 'protect',
            title: 'We held a payment. Was this really you?',
            body: 'Your €2.400 payment is on hold, so nothing leaves your account. Someone from our fraud team will call you today to check, calmly and in your own words.',
            cta: 'Call me now',
            valueToCustomer: 'Keeps €2.400 safe',
            scores: {
                relevance: 98,
                timing: 98,
                customerValue: 98,
                kbcValue: 20,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'We held one payment to keep your money safe. Was this you?',
                },
                {
                    channel: 'push',
                    when: 'now',
                    message:
                        'Your €2.400 payment is on hold. Someone will call you today.',
                },
                {
                    channel: 'advisor',
                    when: 'within 1 hour',
                    message:
                        'Our fraud team calls you on your landline, in Dutch.',
                },
                {
                    channel: 'branch',
                    when: 'if we cannot reach you by 16:00',
                    message: 'Your own advisor in Kortrijk calls you.',
                },
            ],
        },
        {
            id: 'georgette-rec-trusted',
            momentId: 'georgette-mom-trusted',
            kind: 'protect',
            title: 'Choose someone you trust',
            body: 'Pick one person, like your daughter Annick, who gets a message when something unusual happens. They can only look, never pay.',
            cta: 'Choose a trusted person',
            valueToCustomer: 'A second pair of eyes, you stay in charge',
            scores: {
                relevance: 80,
                timing: 65,
                customerValue: 88,
                kbcValue: 10,
            },
            channels: [
                {
                    channel: 'advisor',
                    when: 'at the end of the fraud call',
                    message:
                        'Would you like someone you trust to get alerts too?',
                },
                {
                    channel: 'branch',
                    when: 'if you prefer in person',
                    message:
                        'We can set it up together at KBC Kortrijk, with a coffee.',
                },
                {
                    channel: 'app',
                    when: 'in 2 days',
                    message: 'Your trusted person: set it up in 3 steps.',
                },
            ],
        },
        {
            id: 'georgette-rec-advisor',
            momentId: 'georgette-mom-scam',
            kind: 'human',
            title: 'Talk to Ann, your own advisor',
            body: 'Ann Desmet from KBC Kortrijk knows you. She can call you, or you can drop by the branch whenever you like.',
            cta: 'Ask Ann to call me',
            valueToCustomer: 'A familiar voice',
            scores: {
                relevance: 88,
                timing: 85,
                customerValue: 90,
                kbcValue: 25,
            },
            channels: [
                {
                    channel: 'branch',
                    when: 'today',
                    message:
                        'Ann calls you after the fraud team, just to check in.',
                },
                {
                    channel: 'advisor',
                    when: 'in 3 days',
                    message: 'Ann calls again to see how you are doing.',
                },
            ],
        },
        {
            id: 'georgette-rec-spot',
            momentId: 'georgette-mom-scam',
            kind: 'no_sale',
            title: 'How to spot a "new number" message',
            body: 'Three simple checks: call the person on their old number, ask something only they know, and never pay in a hurry. On paper too, if you like.',
            cta: 'Show me the 3 checks',
            valueToCustomer: 'Feel sure next time',
            scores: {
                relevance: 80,
                timing: 75,
                customerValue: 80,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after the call',
                    message:
                        'Three simple checks for messages from a new number.',
                },
                {
                    channel: 'branch',
                    when: 'on request',
                    message: 'We post you a printed card with the 3 checks.',
                },
            ],
        },
        {
            id: 'georgette-rec-pension',
            momentId: 'georgette-mom-pension',
            kind: 'no_sale',
            title: 'Your pension arrives tomorrow, as usual',
            body: 'Your €1.890 pension comes in on 1 October. Your regular payments for energy and home care go out as always.',
            cta: 'See my month',
            valueToCustomer: 'Peace of mind',
            scores: {
                relevance: 70,
                timing: 60,
                customerValue: 60,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: '1 Oct 08:00',
                    message: 'Your pension has arrived, as usual.',
                },
            ],
        },
        {
            id: 'georgette-rec-alarm',
            momentId: 'georgette-mom-trusted',
            kind: 'partner',
            partner: 'SecureHome (partner)',
            title: 'Home alarm with 24/7 monitoring',
            body: 'Feel safe at home with a connected alarm. First 3 months free.',
            cta: 'Try 3 months free',
            valueToCustomer: '3 months free',
            scores: {
                relevance: 55,
                timing: 40,
                customerValue: 50,
                kbcValue: 75,
            },
            channels: [
                {
                    channel: 'push',
                    when: 'Sat 11:00',
                    message: 'Living alone? A home alarm, 3 months free.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 3 days',
                    message: 'Partner offer: home alarm.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: true },
    events: [
        {
            id: 'georgette-evt-confirms-scam',
            label: 'Georgette confirms: it was a scam',
            description:
                'On the call, Georgette realises "Jonas" was not her grandson. The €2.400 is blocked and the €950 is recovered.',
            transaction: {
                id: 'georgette-tx-recovered',
                date: '30 Sep',
                label: 'Returned — payment to BE•• •••• 7719',
                amountCents: 95000,
                category: 'transfer',
                flag: 'recovered',
            },
            effect: {
                balanceDeltaCents: 95000,
                removeSignalIds: ['georgette-sig-pending'],
                addSignals: [
                    {
                        id: 'georgette-sig-confirmed',
                        label: 'You told us it was not your grandson',
                        detail: 'On the phone with our fraud team you confirmed the messages came from someone else.',
                        source: 'app_behaviour',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['georgette-mom-scam', 'georgette-mom-third'],
                addMoments: [
                    {
                        id: 'georgette-mom-scam',
                        title: 'We are getting your money back',
                        narrative:
                            'Your €2.400 never left, and €950 is already back on your account. We are still working on the €1.800. You did the right thing by telling us.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 90,
                        impactCents: 95000,
                        signalIds: [
                            'georgette-sig-confirmed',
                            'georgette-sig-new-payee',
                        ],
                    },
                ],
                removeRecommendationIds: ['georgette-rec-pause'],
                addRecommendations: [
                    {
                        id: 'georgette-rec-aftercare',
                        momentId: 'georgette-mom-scam',
                        kind: 'protect',
                        title: 'Next steps: we do them with you',
                        body: 'We blocked the account that received your money and prepared the police report. Ann can help you fill it in and change your app code.',
                        cta: 'Do it together with Ann',
                        valueToCustomer: 'Best chance to recover the €1.800',
                        scores: {
                            relevance: 95,
                            timing: 95,
                            customerValue: 95,
                            kbcValue: 10,
                        },
                        channels: [
                            {
                                channel: 'advisor',
                                when: 'now, on the same call',
                                message:
                                    'We have blocked the other account. Let us do the next steps together.',
                            },
                            {
                                channel: 'branch',
                                when: 'tomorrow 10:00',
                                message:
                                    'Ann visits you at home or you come by, as you prefer.',
                            },
                            {
                                channel: 'app',
                                when: 'after the call',
                                message:
                                    'What we have done and what happens next, in 3 lines.',
                            },
                        ],
                    },
                ],
                greeting:
                    'You did the right thing, Georgette. Your €2.400 is safe and €950 is already back.',
                push: {
                    title: '€950 is back on your account',
                    body: 'Your €2.400 stayed safe. We are still working on the rest.',
                },
            },
        },
        {
            id: 'georgette-evt-trusted-contact',
            label: 'Adds her daughter as trusted contact',
            description:
                'Georgette chooses her daughter Annick as trusted contact. Annick gets alerts, but cannot make payments.',
            effect: {
                addSignals: [
                    {
                        id: 'georgette-sig-annick',
                        label: 'Annick is now your trusted person',
                        detail: 'Your daughter Annick gets a message when something unusual happens. She can only look, never pay.',
                        source: 'products',
                        strength: 0.9,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['georgette-mom-trusted'],
                addMoments: [
                    {
                        id: 'georgette-mom-trusted',
                        title: 'Annick keeps an eye out with you',
                        narrative:
                            'From now on, Annick hears from us if a payment looks unusual. You stay in charge of your own money.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 90,
                        signalIds: ['georgette-sig-annick'],
                    },
                ],
                removeRecommendationIds: ['georgette-rec-trusted'],
                greeting:
                    'Annick is now your trusted person, Georgette. You stay in charge.',
                push: {
                    title: 'Annick is your trusted person',
                    body: 'She gets a message if something looks unusual. She cannot make payments.',
                },
            },
        },
    ],
    cohort: {
        label: '380 KBC customers aged 75+ show a "new number" scam pattern this week',
        size: 380,
    },
};
