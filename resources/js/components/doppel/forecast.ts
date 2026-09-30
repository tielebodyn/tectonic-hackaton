import type {
    Card,
    Horizon,
    Monthly,
    SeasonalMoment,
    WhatIf,
} from '@/components/doppel/types';
import { euro } from '@/components/doppel/types';

/** Rekenwerk voor het dagboek over langere tijd en de geldprojectie. Datums als YYYY-MM-DD, in UTC. */

const DAY = 86_400_000;
export const DAYS_PER_MONTH = 30.44;

export const noWhatIf: WhatIf = {
    spend_delta_cents: 0,
    income_pct: 0,
    one_off_cents: 0,
    one_off_month: null,
    saving_cents: 0,
};

const parse = (iso: string) => {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    return Date.UTC(y, m - 1, d);
};
const fmt = (t: number) => new Date(t).toISOString().slice(0, 10);

export const daysBetween = (from: string, to: string) =>
    Math.round((parse(to) - parse(from)) / DAY);

export const addDays = (iso: string, days: number) =>
    fmt(parse(iso) + days * DAY);

/** Einde van de horizon: dertig dagen, of n kalendermaanden verder. */
export function horizonEnd(today: string, horizon: Horizon): string {
    if (horizon === 1) return addDays(today, 30);
    const d = new Date(parse(today));
    d.setUTCMonth(d.getUTCMonth() + horizon);
    return fmt(d.getTime());
}

export const monthKey = (iso: string) => iso.slice(0, 7);

export const monthName = (iso: string) =>
    new Intl.DateTimeFormat('nl-BE', { month: 'long', timeZone: 'UTC' }).format(
        new Date(parse(iso)),
    );

export const monthShort = (iso: string) =>
    new Intl.DateTimeFormat('nl-BE', { month: 'short', timeZone: 'UTC' })
        .format(new Date(parse(iso)))
        .replace('.', '');

export const monthLabel = (iso: string) =>
    new Intl.DateTimeFormat('nl-BE', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(parse(iso)));

/** De eerste dag van elke maand tussen vandaag (exclusief) en het einde (inclusief). */
export function monthStarts(today: string, end: string): string[] {
    const out: string[] = [];
    const d = new Date(parse(today));
    d.setUTCDate(1);
    for (;;) {
        d.setUTCMonth(d.getUTCMonth() + 1);
        const iso = fmt(d.getTime());
        if (iso > end) return out;
        out.push(iso);
    }
}

/** Maanden waarin iets eenmaligs kan landen: de 15de moet binnen de horizon vallen. */
export function pickableMonths(today: string, end: string): string[] {
    const firsts = [`${monthKey(today)}-01`, ...monthStarts(today, end)].map(
        (m) => `${monthKey(m)}-15`,
    );
    const inside = firsts.filter((d) => d > today && d <= end);
    return inside.length > 0 ? inside.map(monthKey) : [monthKey(end)];
}

const round10 = (cents: number) => Math.round(cents / 1000) * 1000;

type Template = {
    month: number;
    day: number;
    key: string;
    title: string;
    short: string;
    share: number;
    body: (amount: string) => string;
};

const templates: Template[] = [
    {
        month: 12,
        day: 15,
        key: 'year_end',
        title: 'Eindejaar: cadeaus en feestdagen',
        short: 'Feestdagen',
        share: 0.15,
        body: (a) =>
            `In december gaf ik zo'n ${a} uit aan cadeaus en feestdagen. Dat komt elk jaar terug, dus ik had het zien aankomen.`,
    },
    {
        month: 1,
        day: 20,
        key: 'winter_energy',
        title: 'Winterfactuur energie',
        short: 'Energie',
        share: 0.08,
        body: (a) =>
            `In januari viel de winterafrekening van je energie binnen, zo'n ${a}. Koude maanden tikken aan.`,
    },
    {
        month: 6,
        day: 15,
        key: 'tax_return',
        title: 'Belastingaangifte',
        short: 'Belastingen',
        share: 0,
        body: () =>
            'In juni vulde ik je belastingaangifte in. Kostte niets, wel een kwartiertje. Een eventuele terugbetaling telde ik pas als ze er was.',
    },
    {
        month: 7,
        day: 12,
        key: 'summer',
        title: 'Zomervakantie',
        short: 'Vakantie',
        share: 0.2,
        body: (a) =>
            `In juli trok ik er even tussenuit en gaf ik zo'n ${a} uit. Omdat ik het wist, voelde het niet als een verrassing.`,
    },
];

/** Jaarmomenten die in de horizon vallen, op maat van de eigen maanduitgaven. */
export function seasonalMoments(
    today: string,
    end: string,
    monthly: Monthly,
): SeasonalMoment[] {
    const years = [Number(today.slice(0, 4)), Number(today.slice(0, 4)) + 1];
    return years
        .flatMap((y) =>
            templates.map((t) => {
                const cents = -round10(monthly.spend_cents * t.share);
                return {
                    key: `${t.key}-${y}`,
                    title: t.title,
                    short: t.short,
                    body: t.body(euro(-cents)),
                    expected_on: `${y}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`,
                    impact_cents: cents,
                };
            }),
        )
        .filter((m) => m.expected_on > today && m.expected_on <= end);
}

export const cardsWithin = (cards: Card[], end: string) =>
    cards.filter((c) => c.expected_on <= end);

export type Cost = {
    key: string;
    day: number;
    cents: number;
    title: string;
    date: string;
    kind: 'card' | 'season' | 'one_off';
};

export type Point = { day: number; balance: number; saved: number };

/** Saldo per dag: gemiddelde maand lineair verdeeld, plus de kosten op hun dag. */
export function project(
    balanceCents: number,
    monthly: Monthly,
    totalDays: number,
    costs: Cost[],
    w: WhatIf,
): Point[] {
    const income = monthly.income_cents * (1 + w.income_pct / 100);
    const net =
        (income - monthly.spend_cents - w.spend_delta_cents - w.saving_cents) /
        DAYS_PER_MONTH;
    const step = totalDays <= 31 ? 2 : totalDays <= 93 ? 7 : 14;
    const days = new Set<number>([0, totalDays]);
    for (let d = step; d < totalDays; d += step) days.add(d);
    for (const c of costs) {
        days.add(c.day);
        if (c.day > 0) days.add(c.day - 1);
    }

    return [...days]
        .sort((a, b) => a - b)
        .map((day) => ({
            day,
            balance: Math.round(
                balanceCents +
                    net * day +
                    costs
                        .filter((c) => c.day <= day)
                        .reduce((s, c) => s + c.cents, 0),
            ),
            saved: Math.round((w.saving_cents / DAYS_PER_MONTH) * day),
        }));
}

/** Waarde op een willekeurige dag, lineair tussen twee punten. */
export function valueAt(
    points: Point[],
    day: number,
    field: 'balance' | 'saved' = 'balance',
): number {
    const i = points.findIndex((p) => p.day >= day);
    if (i <= 0) return points[Math.max(0, i)][field];
    const a = points[i - 1];
    const b = points[i];
    return a[field] + ((b[field] - a[field]) * (day - a.day)) / (b.day - a.day);
}

/** "a, b en c" */
export const joinNl = (parts: string[]) =>
    parts.length <= 1
        ? (parts[0] ?? '')
        : `${parts.slice(0, -1).join(', ')} en ${parts[parts.length - 1]}`;
