import type {
    ActionKind,
    Decision,
    Persona,
    PersonaView,
    RankedRecommendation,
    Recommendation,
    SuppressedRecommendation,
} from './types';

/**
 * The decision engine. Deterministic and explainable on purpose: in production this runs as a
 * batch/stream job over 2.3M customers; the LLM only writes wording, it never decides.
 */

export const WEIGHTS = {
    relevance: 0.35,
    timing: 0.3,
    customerValue: 0.25,
    kbcValue: 0.1,
} as const;

const SALES: ActionKind[] = ['kbc', 'partner'];

export function baseScore(rec: Recommendation): number {
    const s = rec.scores;

    return Math.round(
        s.relevance * WEIGHTS.relevance +
            s.timing * WEIGHTS.timing +
            s.customerValue * WEIGHTS.customerValue +
            s.kbcValue * WEIGHTS.kbcValue,
    );
}

export function decide(
    persona: Persona,
    dismissedIds: string[] = [],
): Decision {
    const log: string[] = [];
    const suppressed: SuppressedRecommendation[] = [];
    const { state } = persona;
    const momentIds = new Set(persona.moments.map((m) => m.id));

    log.push(
        `Scored ${persona.recommendations.length} candidate actions for ${persona.moments.length} predicted moments.`,
    );

    const candidates = persona.recommendations.filter((rec) => {
        if (dismissedIds.includes(rec.id)) {
            suppressed.push({
                rec,
                reason: 'Customer said "not relevant for me"',
            });

            return false;
        }

        if (!momentIds.has(rec.momentId)) {
            suppressed.push({
                rec,
                reason: 'The moment behind it no longer applies',
            });

            return false;
        }

        if (state.financialStress && SALES.includes(rec.kind)) {
            suppressed.push({
                rec,
                reason: 'Sales paused: signs of financial stress',
            });

            return false;
        }

        if (state.vulnerable && rec.kind === 'partner') {
            suppressed.push({
                rec,
                reason: 'No third-party offers for customers flagged as vulnerable',
            });

            return false;
        }

        if (state.sensitiveMoment && rec.kind === 'partner') {
            suppressed.push({
                rec,
                reason: `Sensitive moment (${state.sensitiveMoment}): no partner offers`,
            });

            return false;
        }

        return true;
    });

    if (dismissedIds.length) {
        log.push(
            `${dismissedIds.length} action(s) removed after customer feedback; similar actions are down-weighted.`,
        );
    }

    if (state.financialStress) {
        log.push(
            'Guardrail: financial stress detected → all KBC and partner sales suppressed, human help boosted.',
        );
    }

    if (state.vulnerable) {
        log.push(
            'Guardrail: vulnerability flag → protection actions first, partner offers blocked.',
        );
    }

    const boost = (rec: Recommendation): number => {
        if (state.financialStress && rec.kind === 'human') {
            return 20;
        }

        if (state.vulnerable && rec.kind === 'protect') {
            return 25;
        }

        return 0;
    };

    let ranked = candidates
        .map((rec) => ({
            rec,
            score: Math.min(100, baseScore(rec) + boost(rec)),
        }))
        .sort((a, b) => b.score - a.score);

    // At most one sales card in the top three.
    const topSales = ranked
        .slice(0, 3)
        .filter((r) => SALES.includes(r.rec.kind));

    if (topSales.length > 1) {
        const [, ...extra] = topSales;
        ranked = [...ranked.filter((r) => !extra.includes(r)), ...extra];
        log.push(
            `Diversity rule: kept 1 sales action in the top 3, moved ${extra.length} down.`,
        );
    }

    // Always at least one action that sells nothing.
    if (!ranked.some((r) => r.rec.kind === 'no_sale')) {
        log.push(
            'Trust rule: no "no-sale" action available, the app shows a plain status card instead.',
        );
    } else {
        log.push(
            'Trust rule: at least one action without a sales goal is shown.',
        );
    }

    const result: RankedRecommendation[] = ranked.map((r, i) => ({
        ...r,
        rank: i + 1,
    }));

    if (result[0]) {
        log.push(
            `Next best action: "${result[0].rec.title}" (score ${result[0].score}).`,
        );
    }

    return { ranked: result, suppressed, log };
}

/** Apply fired live events and feedback on top of the static persona. */
export function view(
    persona: Persona,
    firedEventIds: string[],
    dismissedIds: string[],
): PersonaView {
    let p: Persona = structuredClone(persona);

    for (const id of firedEventIds) {
        const event = persona.events.find((e) => e.id === id);

        if (!event) {
            continue;
        }

        const fx = event.effect;
        p = {
            ...p,
            accounts: p.accounts.map((a, i) =>
                i === 0 && fx.balanceDeltaCents
                    ? {
                          ...a,
                          balanceCents: a.balanceCents + fx.balanceDeltaCents,
                      }
                    : a,
            ),
            transactions: event.transaction
                ? [event.transaction, ...p.transactions]
                : p.transactions,
            signals: [
                ...(fx.addSignals ?? []),
                ...p.signals.filter((s) => !fx.removeSignalIds?.includes(s.id)),
            ],
            moments: [
                ...(fx.addMoments ?? []),
                ...p.moments.filter((m) => !fx.removeMomentIds?.includes(m.id)),
            ],
            recommendations: [
                ...(fx.addRecommendations ?? []),
                ...p.recommendations.filter(
                    (r) => !fx.removeRecommendationIds?.includes(r.id),
                ),
            ],
            state: { ...p.state, ...fx.setState },
            greeting: fx.greeting ?? p.greeting,
            push: fx.push ?? p.push,
        };
    }

    return {
        ...p,
        firedEventIds,
        dismissedIds,
        decision: decide(p, dismissedIds),
    };
}

/* ---------- formatting helpers ---------- */

export function euro(
    cents: number,
    opts: { sign?: boolean; decimals?: boolean } = {},
): string {
    const abs = Math.abs(cents) / 100;
    const str = abs.toLocaleString('nl-BE', {
        minimumFractionDigits: opts.decimals ? 2 : 0,
        maximumFractionDigits: opts.decimals ? 2 : 0,
    });
    const sign = cents < 0 ? '−' : opts.sign ? '+' : '';

    return `${sign}€${str}`;
}

export function compact(n: number): string {
    return n.toLocaleString('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    });
}

export const KIND_LABEL: Record<ActionKind, string> = {
    kbc: 'KBC',
    partner: 'Partner',
    no_sale: 'Just help',
    human: 'Human',
    protect: 'Protect',
};
