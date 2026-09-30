import {
    Bot,
    Building2,
    Bell,
    Globe,
    HandHeart,
    Handshake,
    Heart,
    Landmark,
    Mail,
    MessageCircle,
    MousePointerClick,
    Package,
    Receipt,
    Shield,
    Smartphone,
    Sparkles,
    UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { ActionKind, Channel, SignalSource } from './types';
import { cn } from '@/lib/utils';

/** Shared primitives for the KBC Moments POC. Light theme only, tokens live in app.css. */

export const KIND_STYLE: Record<
    ActionKind,
    {
        label: string;
        text: string;
        bg: string;
        border: string;
        dot: string;
        icon: typeof Heart;
    }
> = {
    kbc: {
        label: 'KBC',
        text: 'text-k-kbc',
        bg: 'bg-k-kbc/8',
        border: 'border-k-kbc',
        dot: 'bg-k-kbc',
        icon: Landmark,
    },
    partner: {
        label: 'Partner',
        text: 'text-k-partner',
        bg: 'bg-k-partner/8',
        border: 'border-k-partner',
        dot: 'bg-k-partner',
        icon: Handshake,
    },
    no_sale: {
        label: 'Just help',
        text: 'text-k-nosale',
        bg: 'bg-k-nosale/8',
        border: 'border-k-nosale',
        dot: 'bg-k-nosale',
        icon: HandHeart,
    },
    human: {
        label: 'Human',
        text: 'text-k-human',
        bg: 'bg-k-human/8',
        border: 'border-k-human',
        dot: 'bg-k-human',
        icon: UserRound,
    },
    protect: {
        label: 'Protect',
        text: 'text-k-protect',
        bg: 'bg-k-protect/10',
        border: 'border-k-protect',
        dot: 'bg-k-protect',
        icon: Shield,
    },
};

export const SOURCE_STYLE: Record<
    SignalSource,
    { label: string; icon: typeof Heart }
> = {
    transactions: { label: 'Transactions', icon: Receipt },
    app_behaviour: { label: 'App behaviour', icon: MousePointerClick },
    products: { label: 'Products held', icon: Package },
    life_event: { label: 'Life event', icon: Sparkles },
    kate: { label: 'Kate conversation', icon: Bot },
    external: { label: 'External data', icon: Globe },
};

export const CHANNEL_STYLE: Record<
    Channel,
    { label: string; icon: typeof Heart }
> = {
    app: { label: 'KBC Mobile', icon: Smartphone },
    push: { label: 'Push', icon: Bell },
    kate: { label: 'Kate', icon: MessageCircle },
    advisor: { label: 'Advisor', icon: UserRound },
    email: { label: 'Email', icon: Mail },
    branch: { label: 'Branch', icon: Building2 },
};

export function KindChip({
    kind,
    className,
}: {
    kind: ActionKind;
    className?: string;
}) {
    const k = KIND_STYLE[kind];
    const Icon = k.icon;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                k.bg,
                k.text,
                className,
            )}
        >
            <Icon className="size-3" strokeWidth={2.25} />
            {k.label}
        </span>
    );
}

export function Eyebrow({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'text-ink-3 text-[11px] font-semibold tracking-[0.08em] uppercase',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function Panel({
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

/** Thin horizontal meter, value 0..100. */
export function Meter({
    value,
    className,
    tone = 'bg-kbc-navy',
}: {
    value: number;
    className?: string;
    tone?: string;
}) {
    return (
        <div
            className={cn(
                'bg-mist h-1.5 w-full overflow-hidden rounded-full',
                className,
            )}
        >
            <div
                className={cn(
                    'h-full rounded-full transition-[width] duration-500',
                    tone,
                )}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

export function Avatar({
    initials,
    hue,
    size = 36,
}: {
    initials: string;
    hue: number;
    size?: number;
}) {
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full font-semibold"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.36,
                background: `oklch(0.93 0.05 ${hue})`,
                color: `oklch(0.38 0.1 ${hue})`,
            }}
        >
            {initials}
        </div>
    );
}
