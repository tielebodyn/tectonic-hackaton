import type { Persona } from '../../types';

export const peeters: Persona = {
    id: 'peeters',
    name: 'Jonas & Sarah Peeters',
    firstName: 'Jonas & Sarah',
    age: 34,
    city: 'Mechelen',
    avatar: { initials: 'JP', hue: 30 },
    segment: 'Young families',
    lifeStage: 'Moving house',
    tagline: 'Moving to a bigger rental in Mechelen with their 2-year-old',
    headline: 'New home not insured yet',
    greeting:
        'Welcome to your new home, Jonas and Sarah. Let’s make the move easy.',
    push: {
        title: 'Moving this month? 6 addresses to update',
        body: 'Your city hall wants it within 8 days. We made a checklist: one tap per organisation.',
    },
    kateOpener:
        'Hi Jonas and Sarah! Busy month. Want your moving checklist? Address changes, energy, insurance: I will keep track so you don’t have to.',
    accounts: [
        {
            label: 'Gezamenlijke Zichtrekening',
            iban: 'BE72 •••• 3318',
            balanceCents: 234060,
            kind: 'current',
        },
        {
            label: 'Spaarrekening',
            iban: 'BE40 •••• 9025',
            balanceCents: 680000,
            kind: 'savings',
        },
        {
            label: 'KBC Huurwaarborg',
            iban: 'BE17 •••• 6640',
            balanceCents: 345000,
            kind: 'savings',
        },
    ],
    monthly: { incomeCents: 590000, spendCents: 612000 },
    products: [
        'KBC Gezamenlijke Zichtrekening',
        'KBC Spaarrekening',
        'KBC Huurwaarborg',
        'KBC Autoverzekering',
        '2x KBC Debetkaart',
        'KBC Visa Card',
    ],
    transactions: [
        {
            id: 'peeters-tx-1',
            date: '29 Sep',
            label: 'Kruidvat Mechelen Bruul',
            amountCents: -3470,
            category: 'shopping',
        },
        {
            id: 'peeters-tx-2',
            date: '28 Sep',
            label: 'Colruyt Mechelen',
            amountCents: -12860,
            category: 'groceries',
        },
        {
            id: 'peeters-tx-3',
            date: '27 Sep',
            label: 'IKEA Wilrijk',
            amountCents: -64200,
            category: 'shopping',
            flag: 'moving',
        },
        {
            id: 'peeters-tx-4',
            date: '26 Sep',
            label: 'Action Mechelen',
            amountCents: -4750,
            category: 'shopping',
            flag: 'moving',
        },
        {
            id: 'peeters-tx-5',
            date: '25 Sep',
            label: 'Verhuisfirma Van Dyck',
            amountCents: -89000,
            category: 'housing',
            flag: 'new',
        },
        {
            id: 'peeters-tx-6',
            date: '25 Sep',
            label: 'Salaris Sarah (UZ Leuven)',
            amountCents: 278000,
            category: 'income',
        },
        {
            id: 'peeters-tx-7',
            date: '25 Sep',
            label: 'Salaris Jonas (Barco)',
            amountCents: 312000,
            category: 'income',
        },
        {
            id: 'peeters-tx-8',
            date: '18 Sep',
            label: 'KBC Huurwaarborg (3 months rent)',
            amountCents: -345000,
            category: 'housing',
            flag: 'rent deposit',
        },
        {
            id: 'peeters-tx-9',
            date: '15 Sep',
            label: 'Engie voorschot',
            amountCents: -9500,
            category: 'utilities',
            flag: 'too low for new home',
        },
        {
            id: 'peeters-tx-10',
            date: '12 Sep',
            label: 'Telenet',
            amountCents: -8900,
            category: 'utilities',
        },
        {
            id: 'peeters-tx-11',
            date: '10 Sep',
            label: 'Kinderdagverblijf De Bijtjes',
            amountCents: -48000,
            category: 'childcare',
        },
    ],
    signals: [
        {
            id: 'peeters-sig-huurwaarborg',
            label: 'You opened a rent deposit',
            detail: 'You put €3.450 in a KBC Huurwaarborg for your new place in Mechelen on 18 Sep.',
            source: 'products',
            strength: 0.95,
            observedAt: '12 days ago',
        },
        {
            id: 'peeters-sig-removal',
            label: 'You hired movers',
            detail: 'You paid Verhuisfirma Van Dyck €890 on 25 Sep.',
            source: 'transactions',
            strength: 0.85,
            observedAt: '5 days ago',
        },
        {
            id: 'peeters-sig-furnishing',
            label: 'You are furnishing a new home',
            detail: 'You spent €642 at IKEA and €82 at Action and Kruidvat in the past week.',
            source: 'transactions',
            strength: 0.6,
            observedAt: '3 days ago',
        },
        {
            id: 'peeters-sig-no-home-insurance',
            label: 'We see no home insurance at any insurer',
            detail: 'In 14 months of payments we see no fire or home insurance premium to KBC or any other insurer. In Flanders, tenants must have fire insurance.',
            source: 'transactions',
            strength: 0.8,
            observedAt: 'today',
        },
        {
            id: 'peeters-sig-address',
            label: 'You changed your address in KBC Mobile',
            detail: 'You updated your address 4 days ago. You pay 6 other organisations regularly that will need it too.',
            source: 'app_behaviour',
            strength: 0.7,
            observedAt: '4 days ago',
        },
        {
            id: 'peeters-sig-energy-advance',
            label: 'Your energy advance fits your old flat',
            detail: 'You pay Engie €95/month, based on your old 70 m² flat. Your new house is almost twice that size.',
            source: 'transactions',
            strength: 0.75,
            observedAt: '15 days ago',
        },
        {
            id: 'peeters-sig-kate',
            label: 'You asked Kate about moving',
            detail: "You asked Kate: 'how do I move Telenet to our new address?'",
            source: 'kate',
            strength: 0.65,
            observedAt: '2 days ago',
        },
        {
            id: 'peeters-sig-statbel',
            label: 'Energy got more expensive',
            detail: 'Statbel: household energy prices are up 12% compared to last year.',
            source: 'external',
            strength: 0.5,
            observedAt: 'this month',
        },
    ],
    moments: [
        {
            id: 'peeters-mom-move',
            title: 'You are moving this month',
            narrative:
                'Deposit paid, movers booked, IKEA done. So far the move cost you about €1.600 on top of the deposit.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 95,
            impactCents: -161400,
            signalIds: [
                'peeters-sig-huurwaarborg',
                'peeters-sig-removal',
                'peeters-sig-furnishing',
            ],
        },
        {
            id: 'peeters-mom-address',
            title: '6 organisations need your new address',
            narrative:
                'City hall wants it within 8 days of the move. Telenet, Engie, your ziekenfonds, employers and the daycare need it too.',
            horizon: 'in 8 days',
            daysAhead: 8,
            confidence: 80,
            signalIds: ['peeters-sig-address', 'peeters-sig-kate'],
        },
        {
            id: 'peeters-mom-insurance',
            title: 'Your new home is not insured yet',
            narrative:
                'We see no home insurance at any insurer. As tenants in Flanders you are required to have fire insurance, and a water leak could cost you thousands.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 78,
            signalIds: [
                'peeters-sig-no-home-insurance',
                'peeters-sig-huurwaarborg',
            ],
        },
        {
            id: 'peeters-mom-energy',
            title: 'Your first winter bill: about €180 more',
            narrative:
                'A bigger house, a winter, and prices up 12%. Your first yearly energy bill will likely be about €180 higher than your advances cover.',
            horizon: 'in ~3 months',
            daysAhead: 85,
            confidence: 72,
            impactCents: -18000,
            signalIds: ['peeters-sig-energy-advance', 'peeters-sig-statbel'],
        },
    ],
    recommendations: [
        {
            id: 'peeters-rec-checklist',
            momentId: 'peeters-mom-address',
            kind: 'no_sale',
            title: 'Your moving checklist',
            body: 'City hall, Telenet, Engie, CM, both employers and De Bijtjes. One tap each, and we tick them off for you.',
            cta: 'Open my checklist',
            valueToCustomer: 'No missed letters or fines',
            scores: {
                relevance: 92,
                timing: 92,
                customerValue: 85,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: '6 addresses to update. 2 minutes, one tap each.',
                },
                {
                    channel: 'kate',
                    when: 'now (answer to Telenet question)',
                    message:
                        'Here is the Telenet link, and 5 others you will need.',
                },
                {
                    channel: 'push',
                    when: 'Mon 5 Oct 19:00',
                    message: '3 of 6 done. City hall deadline is Thursday.',
                },
            ],
        },
        {
            id: 'peeters-rec-home-insurance',
            momentId: 'peeters-mom-insurance',
            kind: 'kbc',
            title: 'Insure your new home',
            body: 'We only suggest this because we see no home insurance at any insurer. KBC Woningverzekering for tenants covers fire, water damage and your furniture. Already insured elsewhere? Tell us and we stop.',
            cta: 'Get a quote in 2 minutes',
            valueToCustomer: 'Legally required, from €12/month',
            scores: {
                relevance: 85,
                timing: 80,
                customerValue: 80,
                kbcValue: 70,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your new home has no insurance yet. From €12/month.',
                },
                {
                    channel: 'email',
                    when: 'if not opened in 3 days',
                    message:
                        'Tenant insurance explained, and why it is required.',
                },
                {
                    channel: 'advisor',
                    when: 'if they start but don’t finish',
                    message:
                        'Your KBC Mechelen advisor can finish it with you by phone.',
                },
            ],
        },
        {
            id: 'peeters-rec-energy-compare',
            momentId: 'peeters-mom-energy',
            kind: 'partner',
            partner: 'Mijnenergie',
            title: 'Compare energy for the new place',
            body: 'A new address is a good moment to switch. Mijnenergie compares all suppliers for your real usage.',
            cta: 'Compare suppliers',
            valueToCustomer: 'Families save ~€150 a year',
            scores: {
                relevance: 75,
                timing: 60,
                customerValue: 80,
                kbcValue: 20,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after checklist is done',
                    message:
                        'New home, new energy contract? Compare in 3 minutes.',
                },
                {
                    channel: 'email',
                    when: 'Sat 10 Oct 09:00',
                    message:
                        'Your first winter in the new house: compare before it gets cold.',
                },
            ],
        },
        {
            id: 'peeters-rec-advance',
            momentId: 'peeters-mom-energy',
            kind: 'no_sale',
            title: 'Raise your Engie advance by €15',
            body: 'Paying a bit more each month now avoids a bill of €180 in one go after winter.',
            cta: 'Show me how',
            valueToCustomer: 'No €180 surprise',
            scores: {
                relevance: 80,
                timing: 65,
                customerValue: 75,
                kbcValue: 0,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your advance fits your old flat. €15 more avoids a big bill.',
                },
                {
                    channel: 'kate',
                    when: 'if they ask about energy',
                    message:
                        'Here is how to change your Engie advance in the Engie app.',
                },
            ],
        },
        {
            id: 'peeters-rec-move-overview',
            momentId: 'peeters-mom-move',
            kind: 'no_sale',
            title: 'Your move, in one overview',
            body: 'Deposit, movers, IKEA, Action: €5.060 in total, of which the €3.450 deposit comes back one day. Your savings are untouched.',
            cta: 'See the overview',
            scores: {
                relevance: 70,
                timing: 80,
                customerValue: 60,
                kbcValue: 5,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message: 'The move so far: €1.600 spent, deposit safe.',
                },
                {
                    channel: 'push',
                    when: 'end of October',
                    message: 'Moving month done. Here is what it cost.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'peeters-evt-energy-bill',
            label: 'First variable energy bill arrives',
            description:
                'Engie sends the first bill for the new house: €276 instead of the usual €95.',
            transaction: {
                id: 'peeters-tx-evt-energy',
                date: '30 Sep',
                label: 'Engie factuur nieuwe woning',
                amountCents: -27600,
                category: 'utilities',
                flag: 'higher than usual',
            },
            effect: {
                balanceDeltaCents: -27600,
                addSignals: [
                    {
                        id: 'peeters-sig-energy-bill',
                        label: 'Your first energy bill for the new house',
                        detail: 'Engie charged you €276, almost 3 times your usual €95 advance.',
                        source: 'transactions',
                        strength: 0.92,
                        observedAt: 'just now',
                    },
                ],
                removeMomentIds: ['peeters-mom-energy'],
                addMoments: [
                    {
                        id: 'peeters-mom-energy-now',
                        title: 'Energy costs more than you pay',
                        narrative:
                            'Your first bill was €276. At this rate your advances are about €60/month too low for the winter.',
                        horizon: 'now',
                        daysAhead: 0,
                        confidence: 92,
                        impactCents: -18000,
                        signalIds: [
                            'peeters-sig-energy-bill',
                            'peeters-sig-energy-advance',
                            'peeters-sig-statbel',
                        ],
                    },
                ],
                removeRecommendationIds: [
                    'peeters-rec-advance',
                    'peeters-rec-energy-compare',
                ],
                addRecommendations: [
                    {
                        id: 'peeters-rec-advance-now',
                        momentId: 'peeters-mom-energy-now',
                        kind: 'no_sale',
                        title: 'Set your advance to €155',
                        body: 'That spreads the winter cost evenly. You can afford it: after rent and childcare you still have about €400 left each month.',
                        cta: 'Show me how',
                        valueToCustomer: 'No big bill after winter',
                        scores: {
                            relevance: 90,
                            timing: 95,
                            customerValue: 85,
                            kbcValue: 0,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Engie bill: €276. A €155 advance keeps winter smooth.',
                            },
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'Your new energy costs, and how to spread them.',
                            },
                        ],
                    },
                    {
                        id: 'peeters-rec-energy-compare',
                        momentId: 'peeters-mom-energy-now',
                        kind: 'partner',
                        partner: 'Mijnenergie',
                        title: 'Compare energy with your real usage',
                        body: 'Now that we know what the house uses, Mijnenergie can compare suppliers on real numbers.',
                        cta: 'Compare suppliers',
                        valueToCustomer: 'Families save ~€150 a year',
                        scores: {
                            relevance: 85,
                            timing: 85,
                            customerValue: 80,
                            kbcValue: 20,
                        },
                        channels: [
                            {
                                channel: 'app',
                                when: 'now',
                                message:
                                    'Your usage is known now. Compare in 3 minutes.',
                            },
                            {
                                channel: 'email',
                                when: 'if not opened in 3 days',
                                message:
                                    'Could your house run cheaper? A quick comparison.',
                            },
                        ],
                    },
                ],
                greeting:
                    'That energy bill was higher than usual. Here is how to spread it.',
                push: {
                    title: 'Engie: €276 for your new home',
                    body: 'Almost 3x your old advance. Raising it to €155 now keeps winter smooth.',
                },
            },
        },
    ],
    cohort: {
        label: '6,900 KBC households moved house this month',
        size: 6900,
    },
};
