import { BookOpen, Home, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'home' | 'diary' | 'actions' | 'profile';

const tabs: { key: Tab; icon: typeof Home; label: string }[] = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'diary', icon: BookOpen, label: 'Dagboek' },
    { key: 'actions', icon: Sparkles, label: 'Acties' },
    { key: 'profile', icon: User, label: 'Profiel' },
];

export default function TabBar({
    active,
    onChange,
}: {
    active: Tab;
    onChange: (tab: Tab) => void;
}) {
    return (
        <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-ink/6 bg-white/90 px-2 pt-2 pb-4 backdrop-blur-xl">
            {tabs.map(({ key, icon: Icon, label }) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key)}
                    className={cn(
                        'flex min-w-16 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] transition-colors',
                        active === key
                            ? 'font-semibold text-ink'
                            : 'font-medium text-ink/40 hover:text-ink/70',
                    )}
                >
                    <span
                        className={cn(
                            'grid size-8 place-items-center rounded-xl transition-colors',
                            active === key && 'bg-kbc/12 text-kbc',
                        )}
                    >
                        <Icon className="size-5" />
                    </span>
                    {label}
                </button>
            ))}
        </nav>
    );
}
