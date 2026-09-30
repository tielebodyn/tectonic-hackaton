import type { Persona } from '../../types';

export const sofie: Persona = {
    id: 'sofie',
    name: 'Sofie Claes',
    firstName: 'Sofie',
    age: 52,
    city: 'Hasselt',
    avatar: { initials: 'SC', hue: 60 },
    segment: 'Business owners',
    lifeStage: 'Growing company, thinking ahead',
    tagline:
        'Runs a 14-person industrial cleaning company with €280k sitting idle',
    headline: '€280k idle while vans need renewing',
    greeting:
        'Business is growing, Sofie. Your cash is doing nothing for you yet.',
    push: {
        title: 'Your cash buffer: 4.2 months of payroll',
        body: 'You have €280.000 more than your business needs day to day. Here is what that means.',
    },
    kateOpener:
        'Hi Sofie. Last week you asked what happens to your company when you retire. Shall I show you the three questions most owners start with? No rush, and nothing to sign.',
    advisorBrief:
        'Sofie Claes (52), sole director of Claes Industrial Cleaning BV, Hasselt, 14 staff. €280k above operating needs on the business current account for 9 months. Payroll +12% in 6 months, new 3-year contract with a Genk logistics park. Asked Kate about succession ("what happens to my company when I retire?"). Private pension saving and VAPZ already maxed. She is the only signing authority (key-person risk). Goal of the call: listen first, map her 5–10 year horizon, no product pitch in the first meeting.',
    accounts: [
        {
            label: 'KBC Business Zichtrekening',
            iban: 'BE71 •••• 2208',
            balanceCents: 31245000,
            kind: 'business',
        },
        {
            label: 'KBC Zichtrekening',
            iban: 'BE43 •••• 9051',
            balanceCents: 987000,
            kind: 'current',
        },
        {
            label: 'KBC Pensioenspaarfonds',
            iban: 'BE09 •••• 6630',
            balanceCents: 3820000,
            kind: 'investment',
        },
    ],
    monthly: { incomeCents: 11850000, spendCents: 10420000 },
    products: [
        'KBC Business Zichtrekening',
        'KBC Business Card',
        'KBC Zichtrekening',
        'KBC Pensioenspaarfonds',
        'VAPZ via KBC',
        'KBC Business Insurance (fire & liability)',
    ],
    transactions: [
        {
            id: 'sofie-tx-payroll-sep',
            date: '29 Sep',
            label: 'Payroll September — 14 employees',
            amountCents: -6670000,
            category: 'business',
            flag: 'payroll +12%',
        },
        {
            id: 'sofie-tx-genk-invoice',
            date: '28 Sep',
            label: 'Genk Logistics Park NV — invoice 2026-118',
            amountCents: 3860000,
            category: 'income',
            flag: 'new client',
        },
        {
            id: 'sofie-tx-rsz',
            date: '26 Sep',
            label: 'RSZ — social contributions Q3',
            amountCents: -1940000,
            category: 'tax',
        },
        {
            id: 'sofie-tx-fuel',
            date: '24 Sep',
            label: 'TotalEnergies fuel cards',
            amountCents: -284000,
            category: 'transport',
        },
        {
            id: 'sofie-tx-karcher',
            date: '23 Sep',
            label: 'Kärcher Belgium — scrubber dryer',
            amountCents: -620000,
            category: 'business',
        },
        {
            id: 'sofie-tx-stad',
            date: '22 Sep',
            label: 'Stad Hasselt — invoice 2026-104',
            amountCents: 1430000,
            category: 'income',
        },
        {
            id: 'sofie-tx-vat',
            date: '20 Sep',
            label: 'FOD Financiën — VAT Q2',
            amountCents: -2160000,
            category: 'tax',
        },
        {
            id: 'sofie-tx-lease',
            date: '18 Sep',
            label: 'Mercedes-Benz Financial — van lease (3 vans)',
            amountCents: -198000,
            category: 'transport',
            flag: 'ends in Dec',
        },
        {
            id: 'sofie-tx-brico',
            date: '16 Sep',
            label: 'Brico Pro Hasselt',
            amountCents: -74000,
            category: 'business',
        },
        {
            id: 'sofie-tx-umicore',
            date: '15 Sep',
            label: 'Umicore Olen — invoice 2026-097',
            amountCents: 2790000,
            category: 'income',
        },
    ],
    signals: [
        {
            id: 'sofie-sig-idle-cash',
            label: 'About €280.000 has been sitting still since January',
            detail: 'Your business account has stayed around €280.000 above what your company needs each month, and it earns 0% there.',
            source: 'transactions',
            strength: 0.9,
            observedAt: 'today',
        },
        {
            id: 'sofie-sig-contract',
            label: 'You landed a new long-term client',
            detail: 'Genk Logistics Park NV paid its first invoice of €38.600 on 28 Sep.',
            source: 'transactions',
            strength: 0.7,
            observedAt: '2 days ago',
        },
        {
            id: 'sofie-sig-van-quote',
            label: 'You looked at a quote for electric vans',
            detail: 'You opened your KBC Autolease quote for 3 electric vans twice this week.',
            source: 'app_behaviour',
            strength: 0.75,
            observedAt: '3 days ago',
        },
        {
            id: 'sofie-sig-lease-end',
            label: 'Your current van leases end in December',
            detail: 'You pay €1.980 a month to Mercedes-Benz Financial on a 48-month lease that started in December 2022.',
            source: 'transactions',
            strength: 0.8,
            observedAt: '12 days ago',
        },
        {
            id: 'sofie-sig-payroll',
            label: 'Your team is growing',
            detail: 'Your monthly payroll went up 12% in 6 months, from 12 to 14 people.',
            source: 'transactions',
            strength: 0.6,
            observedAt: '1 day ago',
        },
        {
            id: 'sofie-sig-kate-succession',
            label: 'You asked Kate about retiring',
            detail: "You asked Kate: 'What happens to my company when I retire?'",
            source: 'kate',
            strength: 0.85,
            observedAt: '6 days ago',
        },
        {
            id: 'sofie-sig-pension-max',
            label: 'Your private pension saving is at the maximum',
            detail: 'Your pension saving and VAPZ are both at their 2026 maximum, so there is no extra tax benefit left there this year.',
            source: 'products',
            strength: 0.55,
            observedAt: '3 weeks ago',
        },
        {
            id: 'sofie-sig-sole-director',
            label: 'You are the only one who can sign',
            detail: 'The company register (KBO) lists you as sole director, and nobody else can approve payments on your business account.',
            source: 'external',
            strength: 0.65,
            observedAt: '1 month ago',
        },
    ],
    moments: [
        {
            id: 'sofie-mom-idle-cash',
            title: '€280k is losing value on a current account',
            narrative:
                'You keep more than four months of payroll as a buffer. That is safe, but the part above it earns nothing while prices keep rising.',
            horizon: 'now',
            daysAhead: 0,
            confidence: 90,
            impactCents: 700000,
            signalIds: [
                'sofie-sig-idle-cash',
                'sofie-sig-contract',
                'sofie-sig-payroll',
            ],
        },
        {
            id: 'sofie-mom-fleet',
            title: 'Your van leases end in December',
            narrative:
                'Your three vans go back in December and you are already comparing electric ones. Deciding before November avoids a gap in your fleet.',
            horizon: 'in ~2.5 months',
            daysAhead: 75,
            confidence: 82,
            signalIds: [
                'sofie-sig-lease-end',
                'sofie-sig-van-quote',
                'sofie-sig-contract',
            ],
        },
        {
            id: 'sofie-mom-succession',
            title: 'First steps towards handing over your company',
            narrative:
                'Retirement is 5 to 10 years away, but owners who start now keep more choices: selling, family, or management buy-out.',
            horizon: '~6 months',
            daysAhead: 180,
            confidence: 68,
            signalIds: [
                'sofie-sig-kate-succession',
                'sofie-sig-pension-max',
                'sofie-sig-sole-director',
            ],
        },
        {
            id: 'sofie-mom-keyperson',
            title: 'Your company leans on you alone',
            narrative:
                'You are the only director and the only one who can sign payments. If you were out for months, payroll and clients would feel it.',
            horizon: 'now',
            daysAhead: 7,
            confidence: 62,
            signalIds: ['sofie-sig-sole-director', 'sofie-sig-payroll'],
        },
    ],
    recommendations: [
        {
            id: 'sofie-rec-term-deposit',
            momentId: 'sofie-mom-idle-cash',
            kind: 'kbc',
            title: 'Put €200k on a KBC business term deposit',
            body: 'Keep €80k as your day-to-day buffer and park the rest for 6 or 12 months at a fixed rate. You can still see it next to your current account.',
            cta: 'See rates for €200k',
            valueToCustomer: '~€5.000 interest a year instead of €0',
            scores: {
                relevance: 88,
                timing: 82,
                customerValue: 78,
                kbcValue: 70,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your buffer is healthy. €200k could earn a fixed rate for 6 or 12 months.',
                },
                {
                    channel: 'email',
                    when: 'Thu 09:00',
                    message:
                        'A one-page overview of term deposit options for Claes Industrial Cleaning BV.',
                },
                {
                    channel: 'advisor',
                    when: 'if not opened in 5 days',
                    message:
                        'Your relationship manager offers a 15-minute call about your cash.',
                },
            ],
        },
        {
            id: 'sofie-rec-succession',
            momentId: 'sofie-mom-succession',
            kind: 'human',
            title: 'A first talk about succession with a private banker',
            body: 'One hour, no paperwork. A KBC private banker maps your options and what to prepare now: valuation, family, taxes.',
            cta: 'Pick a time in Hasselt',
            valueToCustomer: 'Clear picture of your options, years ahead',
            scores: {
                relevance: 80,
                timing: 60,
                customerValue: 88,
                kbcValue: 65,
            },
            channels: [
                {
                    channel: 'kate',
                    when: 'next time you open Kate',
                    message:
                        'You asked about retiring. Want to talk it through with a person?',
                },
                {
                    channel: 'app',
                    when: 'Mon 10:00',
                    message:
                        'A first conversation about succession. One hour, nothing to decide.',
                },
                {
                    channel: 'branch',
                    when: 'on booking',
                    message: 'KBC Private Banking Hasselt, Kempische Steenweg.',
                },
            ],
        },
        {
            id: 'sofie-rec-cash-insight',
            momentId: 'sofie-mom-idle-cash',
            kind: 'no_sale',
            title: 'Your cash buffer covers 4.2 months of payroll',
            body: 'Most companies your size keep 2 to 3 months. Here is how your buffer moved this year, and what a normal quarter looks like.',
            cta: 'See my buffer',
            valueToCustomer: 'Know how much you really need',
            scores: {
                relevance: 85,
                timing: 80,
                customerValue: 75,
                kbcValue: 10,
            },
            channels: [
                {
                    channel: 'push',
                    when: 'Tue 08:00',
                    message: 'Your cash buffer covers 4.2 months of payroll.',
                },
                {
                    channel: 'app',
                    when: 'on tap',
                    message:
                        'Buffer chart for 2026 with your VAT and RSZ peaks marked.',
                },
            ],
        },
        {
            id: 'sofie-rec-autolease',
            momentId: 'sofie-mom-fleet',
            kind: 'kbc',
            title: 'KBC Autolease for your 3 new vans',
            body: 'Electric vans with maintenance, tyres and insurance in one monthly price. Order by early November to have them in December.',
            cta: 'Finish my quote',
            valueToCustomer: 'Fixed monthly cost, no gap in your fleet',
            scores: {
                relevance: 78,
                timing: 75,
                customerValue: 60,
                kbcValue: 80,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'now',
                    message:
                        'Your quote for 3 electric vans is saved. Two questions left.',
                },
                {
                    channel: 'email',
                    when: 'if not finished in 7 days',
                    message:
                        'Your saved quote, with delivery times for December.',
                },
            ],
        },
        {
            id: 'sofie-rec-keyperson',
            momentId: 'sofie-mom-keyperson',
            kind: 'kbc',
            title: 'Key-person insurance',
            body: 'Pays your company if you cannot work for a long time, so payroll and contracts keep running while you recover.',
            cta: 'Estimate the cover',
            valueToCustomer: 'Protects 14 jobs and your contracts',
            scores: {
                relevance: 70,
                timing: 55,
                customerValue: 72,
                kbcValue: 75,
            },
            channels: [
                {
                    channel: 'app',
                    when: 'after the succession talk',
                    message:
                        'What happens to Claes Industrial Cleaning if you are out for 6 months?',
                },
                {
                    channel: 'advisor',
                    when: 'during the succession talk',
                    message:
                        'If you want, we also look at who can sign and keep things running if you are away.',
                },
            ],
        },
    ],
    state: { financialStress: false, vulnerable: false },
    events: [
        {
            id: 'sofie-evt-tender',
            label: 'Wins €420k public tender',
            description:
                'Provincie Limburg awards Sofie a 3-year cleaning contract. A 5% performance bond is due within 30 days.',
            effect: {
                addSignals: [
                    {
                        id: 'sofie-sig-tender',
                        label: 'You won a €420.000 public tender',
                        detail: 'Provincie Limburg awarded you a 3-year contract. For public contracts you need a 5% guarantee within 30 days.',
                        source: 'external',
                        strength: 0.95,
                        observedAt: 'just now',
                    },
                ],
                addMoments: [
                    {
                        id: 'sofie-mom-tender-bond',
                        title: 'A €21.000 performance bond is due in 30 days',
                        narrative:
                            'Congratulations on the tender. The province needs a 5% guarantee before work starts, and you will likely need 2 more vans and people.',
                        horizon: 'in 30 days',
                        daysAhead: 30,
                        confidence: 94,
                        impactCents: -2100000,
                        signalIds: ['sofie-sig-tender', 'sofie-sig-payroll'],
                    },
                ],
                addRecommendations: [
                    {
                        id: 'sofie-rec-bank-guarantee',
                        momentId: 'sofie-mom-tender-bond',
                        kind: 'kbc',
                        title: 'KBC bank guarantee for the tender',
                        body: 'We issue the 5% performance bond to Provincie Limburg, so your €21.000 stays in your company instead of being blocked.',
                        cta: 'Request the guarantee',
                        valueToCustomer:
                            'Keeps €21.000 free, ready in 5 working days',
                        scores: {
                            relevance: 92,
                            timing: 95,
                            customerValue: 85,
                            kbcValue: 65,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Tender won. Your performance bond is due in 30 days, we can handle it.',
                            },
                            {
                                channel: 'app',
                                when: 'on tap',
                                message:
                                    'Pre-filled request with the award notice attached.',
                            },
                            {
                                channel: 'advisor',
                                when: 'if not requested in 7 days',
                                message:
                                    'Your relationship manager calls to make sure you make the deadline.',
                            },
                        ],
                    },
                ],
                greeting:
                    'You won the Limburg tender, Sofie. Let us make sure the paperwork is not what slows you down.',
                push: {
                    title: 'Congratulations on the tender',
                    body: 'A 5% performance bond is due within 30 days. We can issue it for you.',
                },
            },
        },
        {
            id: 'sofie-evt-payroll',
            label: 'Payroll run for new hires',
            description:
                'Two new cleaners join. Payroll rises to €75.900 and the buffer shrinks to 3.7 months.',
            transaction: {
                id: 'sofie-tx-payroll-new-hires',
                date: '30 Sep',
                label: 'Payroll — 16 employees (2 new hires)',
                amountCents: -7590000,
                category: 'business',
                flag: '+2 employees',
            },
            effect: {
                balanceDeltaCents: -7590000,
                removeSignalIds: ['sofie-sig-payroll'],
                addSignals: [
                    {
                        id: 'sofie-sig-payroll-16',
                        label: 'Your team grew to 16 people',
                        detail: 'Two new colleagues were on this month’s payroll, which came to €75.900 (+14%).',
                        source: 'transactions',
                        strength: 0.8,
                        observedAt: 'just now',
                    },
                ],
                removeRecommendationIds: ['sofie-rec-cash-insight'],
                addRecommendations: [
                    {
                        id: 'sofie-rec-cash-insight-16',
                        momentId: 'sofie-mom-idle-cash',
                        kind: 'no_sale',
                        title: 'Your buffer now covers 3.7 months of payroll',
                        body: 'With 16 people your monthly payroll is €75.900. Your buffer is still comfortable, the part you can safely park is now closer to €160k.',
                        cta: 'See my updated buffer',
                        valueToCustomer: 'An honest update after hiring',
                        scores: {
                            relevance: 90,
                            timing: 88,
                            customerValue: 80,
                            kbcValue: 10,
                        },
                        channels: [
                            {
                                channel: 'push',
                                when: 'now',
                                message:
                                    'Payroll grew. Your buffer now covers 3.7 months.',
                            },
                            {
                                channel: 'app',
                                when: 'on tap',
                                message:
                                    'Updated buffer chart with the 2 new hires included.',
                            },
                        ],
                    },
                ],
                push: {
                    title: 'Payroll grew to 16 people',
                    body: 'Your cash buffer now covers 3.7 months. Still comfortable.',
                },
            },
        },
    ],
    cohort: {
        label: '46,200 KBC business clients hold more than 3 months of payroll idle',
        size: 46200,
    },
};
