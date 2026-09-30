import type { Moment, PersonaView } from '../types';

/**
 * "Your year ahead": the customer's own look at their next 12 months (Oct 2026 → Sep 2027).
 * Pure functions over a PersonaView, so the view recomputes live when events fire or a what-if changes.
 * Money is integer cents everywhere.
 */

export const MONTHS = [
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
];
export const MONTHS_LONG = [
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
];

/** Month index 1..12 for something `days` ahead of today (30 Sep 2026). */
export function monthOf(days: number): number {
    return Math.min(12, Math.max(1, Math.ceil(Math.max(days, 1) / 30.42)));
}

export function monthName(i: number): string {
    const name = MONTHS_LONG[Math.min(12, Math.max(1, i)) - 1];

    return i >= 4 ? `${name} 2027` : name;
}

/** Round to a "nice" amount (1, 2, 2.5, 5 × 10ⁿ) so what-if steps read like real choices. */
export function nice(cents: number): number {
    const euros = Math.max(1, Math.abs(cents) / 100);
    const pow = 10 ** Math.floor(Math.log10(euros));
    const step = [1, 2, 2.5, 5, 10].find((s) => euros <= s * pow * 1.25) ?? 10;

    return Math.round(step * pow) * 100;
}

/** Short money for chart axes and chips: €850, €4.2k, €1.3M. */
export function short(cents: number): string {
    const e = cents / 100;
    const abs = Math.abs(e);
    const sign = e < 0 ? '−' : '';

    if (abs >= 1_000_000) {
        return `${sign}€${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
    }

    if (abs >= 10_000) {
        return `${sign}€${Math.round(abs / 1000)}k`;
    }

    if (abs >= 1000) {
        return `${sign}€${(abs / 1000).toFixed(1)}k`;
    }

    return `${sign}€${Math.round(abs)}`;
}

/* ---------- what's on the calendar ---------- */

export type YearItem = {
    id: string;
    title: string;
    days: number;
    month: number;
    impactCents: number;
    kind: 'moment' | 'seasonal';
    moment?: Moment;
    note?: string;
};

/** Things that happen to almost everyone, scaled to this customer's own spending. */
function seasonal(spend: number): YearItem[] {
    return [
        {
            id: 'season-december',
            title: 'Holiday season',
            days: 80,
            month: 3,
            impactCents: -Math.round(spend * 0.15),
            kind: 'seasonal',
            note: 'December spending is usually ~15% higher',
        },
        {
            id: 'season-energy',
            title: 'Winter energy bills',
            days: 115,
            month: 4,
            impactCents: -Math.round(spend * 0.05),
            kind: 'seasonal',
            note: 'Heating peaks in January and February',
        },
        {
            id: 'season-tax',
            title: 'Tax return',
            days: 245,
            month: 9,
            impactCents: 0,
            kind: 'seasonal',
            note: 'Tax-on-web opens, usually pre-filled',
        },
        {
            id: 'season-summer',
            title: 'Summer holidays',
            days: 290,
            month: 10,
            impactCents: -Math.round(spend * 0.2),
            kind: 'seasonal',
            note: 'July is your most expensive month on average',
        },
    ];
}

export function yearItems(view: PersonaView): YearItem[] {
    const moments: YearItem[] = [...view.moments]
        .sort((a, b) => a.daysAhead - b.daysAhead)
        .map((m) => ({
            id: m.id,
            title: m.title,
            days: Math.min(365, m.daysAhead),
            month: monthOf(m.daysAhead),
            impactCents: m.impactCents ?? 0,
            kind: 'moment' as const,
            moment: m,
        }));

    return [...moments, ...seasonal(view.monthly.spendCents)];
}

/* ---------- money on hand ---------- */

export function liquidCents(view: PersonaView): number {
    return view.accounts
        .filter(
            (a) =>
                a.kind === 'current' ||
                a.kind === 'savings' ||
                a.kind === 'business',
        )
        .reduce((sum, a) => sum + a.balanceCents, 0);
}

export function loanOf(view: PersonaView) {
    return view.accounts.find((a) => a.kind === 'credit' && a.balanceCents < 0);
}

/** Recurring subscriptions in the recent transactions, as a monthly amount (positive cents). */
export function subscriptionsCents(view: PersonaView): number {
    return -view.transactions
        .filter((t) => t.category === 'subscriptions' && t.amountCents < 0)
        .reduce((sum, t) => sum + t.amountCents, 0);
}

/* ---------- what if ---------- */

export type Scenario = {
    saveStep: number; // 0..3, index into saveOptions()
    purchase: boolean;
    purchaseMonth: number; // 1..12
    incomeDrop: boolean; // −20% from January
    extra: boolean; // pay off the loan early / cut subscriptions / trim groceries
};

export const NO_SCENARIO: Scenario = {
    saveStep: 0,
    purchase: false,
    purchaseMonth: 6,
    incomeDrop: false,
    extra: false,
};

export function saveOptions(view: PersonaView): number[] {
    const s = view.monthly.spendCents;

    return [0, nice(s * 0.03), nice(s * 0.06), nice(s * 0.12)];
}

export function purchaseAmount(view: PersonaView): number {
    return nice(view.monthly.spendCents * 1.6);
}

export type Extra = {
    label: string;
    hint: string;
    now: number; // one-off effect in month 1
    monthly: number; // effect per month afterwards
};

export function extraOption(view: PersonaView): Extra {
    const loan = loanOf(view);

    if (loan) {
        const owed = -loan.balanceCents;
        const instalment = Math.round(owed / 24);

        return {
            label: `Pay off your ${loan.label.replace(/^KBC\s+/, '').toLowerCase()} early`,
            hint: `${short(owed)} now, then ${short(instalment)} a month stays with you`,
            now: -owed,
            monthly: instalment,
        };
    }

    const subs = subscriptionsCents(view);

    if (subs > 1500) {
        const cut = Math.round(subs * 0.5);

        return {
            label: 'Cancel subscriptions you rarely use',
            hint: `About half of your ${short(subs)} a month`,
            now: 0,
            monthly: cut,
        };
    }

    const trim = nice(view.monthly.spendCents * 0.05);

    return {
        label: 'Trim everyday spending by 5%',
        hint: `${short(trim)} a month, groceries and small buys`,
        now: 0,
        monthly: trim,
    };
}

/** 13 points: today, then the end of each month Oct → Sep. */
export function project(
    view: PersonaView,
    items: YearItem[],
    sc: Scenario,
): number[] {
    const { incomeCents, spendCents } = view.monthly;
    const save = saveOptions(view)[sc.saveStep] ?? 0;
    const extra = extraOption(view);
    const points = [liquidCents(view)];

    for (let m = 1; m <= 12; m++) {
        const income =
            sc.incomeDrop && m >= 4
                ? Math.round(incomeCents * 0.8)
                : incomeCents;
        // Only costs are counted: money that might come in (a late invoice, a possible saving)
        // stays out of the projection until it actually arrives.
        const events = items
            .filter((i) => i.month === m)
            .reduce((sum, i) => sum + Math.min(0, i.impactCents), 0);
        let delta = income - spendCents + save + events;

        if (sc.purchase && m === sc.purchaseMonth) {
            delta -= purchaseAmount(view);
        }

        if (sc.extra) {
            delta +=
                (m === 1 ? extra.now : 0) +
                (m > 1 || extra.now === 0 ? extra.monthly : 0);
        }

        points.push(points[m - 1] + delta);
    }

    return points;
}

export function bufferMonths(balance: number, view: PersonaView): number {
    return view.monthly.spendCents > 0 ? balance / view.monthly.spendCents : 0;
}
