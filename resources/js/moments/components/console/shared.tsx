import type { ReactNode } from 'react';
import type { Channel, PersonaView, SignalSource } from '../../types';
import { Eyebrow } from '../../ui';
import { cn } from '@/lib/utils';

/** Ids that appeared (or changed) with the last live event, prefixed: s: signal, m: moment, r: ranked, x: suppressed, st: state. */
export type Fresh = Set<string>;

export function collectIds(view: PersonaView): Set<string> {
    const ids = new Set<string>();

    view.signals.forEach((s) => ids.add(`s:${s.id}`));
    view.moments.forEach((m) => ids.add(`m:${m.id}`));
    view.decision.ranked.forEach((r) => ids.add(`r:${r.rec.id}`));
    view.decision.suppressed.forEach((s) => ids.add(`x:${s.rec.id}`));

    if (view.state.financialStress) {
        ids.add('st:stress');
    }

    if (view.state.vulnerable) {
        ids.add('st:vulnerable');
    }

    if (view.state.sensitiveMoment) {
        ids.add(`st:sensitive:${view.state.sensitiveMoment}`);
    }

    if (
        !view.state.financialStress &&
        !view.state.vulnerable &&
        !view.state.sensitiveMoment
    ) {
        ids.add('st:stable');
    }

    ids.add(`push:${view.push.title}`);

    return ids;
}

/** Visual treatment for something the last event just produced. Fades back out when the flag clears. */
export function freshClass(on: boolean): string {
    return cn(
        'transition-[background-color,box-shadow] duration-1000',
        on &&
            'bg-kbc-sky/[0.07] animate-in shadow-[0_0_0_1px_rgba(0,174,239,0.45)] fade-in slide-in-from-top-1',
    );
}

export function NewTag({ show }: { show: boolean }) {
    if (!show) {
        return null;
    }

    return (
        <span className="bg-kbc-sky animate-in rounded px-1 py-px text-[9px] font-bold tracking-[0.06em] text-white uppercase fade-in">
            New
        </span>
    );
}

export function SectionHeader({
    eyebrow,
    title,
    aside,
    className,
}: {
    eyebrow: string;
    title?: ReactNode;
    aside?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mb-3 flex items-end justify-between gap-4',
                className,
            )}
        >
            <div className="min-w-0">
                <Eyebrow>{eyebrow}</Eyebrow>
                {title && (
                    <div className="mt-1 text-[14px] font-semibold tracking-tight text-ink">
                        {title}
                    </div>
                )}
            </div>
            {aside && (
                <div className="text-ink-3 shrink-0 text-[12px]">{aside}</div>
            )}
        </div>
    );
}

export function EmptyNote({ children }: { children: ReactNode }) {
    return (
        <div className="border-line text-ink-3 rounded-xl border border-dashed px-4 py-6 text-center text-[12px]">
            {children}
        </div>
    );
}

/* ---------- customer-facing copy & preferences ---------- */

export type Prefs = {
    pauseOffers: boolean;
    sources: Record<SignalSource, boolean>;
    channels: Record<Channel, boolean>;
    quietHours: boolean;
    notMe: string[]; // signal ids the customer said were wrong
    confirmed: string[]; // signal ids the customer confirmed
};

export const DEFAULT_PREFS: Prefs = {
    pauseOffers: false,
    sources: {
        transactions: true,
        app_behaviour: true,
        products: true,
        life_event: true,
        kate: true,
        external: true,
    },
    channels: {
        app: true,
        push: true,
        kate: true,
        advisor: true,
        email: false,
        branch: true,
    },
    quietHours: true,
    notMe: [],
    confirmed: [],
};

export type SetPrefs = (update: (prev: Prefs) => Prefs) => void;

/** Signal sources in the customer's own words. */
export const SOURCE_COPY: Record<
    SignalSource,
    { label: string; explain: string }
> = {
    transactions: {
        label: 'Your payments',
        explain: 'Money coming in and going out of your KBC accounts',
    },
    app_behaviour: {
        label: 'How you use the app',
        explain: 'Which screens you open in KBC Mobile, never what you type',
    },
    products: {
        label: 'Your KBC products',
        explain: 'Accounts, cards, loans and insurance you have with us',
    },
    life_event: {
        label: 'Life events',
        explain: 'Things you told us or that show in your banking, like a move',
    },
    kate: {
        label: 'Chats with Kate',
        explain: 'Questions you asked Kate, our assistant',
    },
    external: {
        label: 'Public information',
        explain:
            'Open data like energy prices or school holidays, never about you',
    },
};

export function sureness(confidence: number): string {
    if (confidence >= 85) {
        return 'Very likely';
    }

    if (confidence >= 70) {
        return 'Likely';
    }

    if (confidence >= 50) {
        return 'Possible';
    }

    return 'Early sign';
}

export function Toggle({
    on,
    onChange,
    label,
    disabled,
}: {
    on: boolean;
    onChange: (on: boolean) => void;
    label: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange(!on)}
            className={cn(
                'relative inline-flex h-[20px] w-[34px] shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-40',
                on ? 'bg-kbc-navy' : 'bg-[#d5dde6]',
            )}
        >
            <span
                className={cn(
                    'inline-block size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200',
                    on ? 'translate-x-[16px]' : 'translate-x-[2px]',
                )}
            />
        </button>
    );
}

/** Soft white card, the consumer-app surface. */
export function Card({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'border-line rounded-2xl border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
                className,
            )}
        >
            {children}
        </div>
    );
}
