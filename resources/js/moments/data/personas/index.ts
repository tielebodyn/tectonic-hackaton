import type { Persona } from '../../types';

/** Every persona file in this folder is picked up automatically; this array only fixes the roster order. */
const ORDER = [
    'karim',
    'lotte',
    'georgette',
    'peeters',
    'marc',
    'nora',
    'emma-wout',
    'yasmine',
    'sofie',
    'thomas',
    'arne',
    'mateo',
];

const modules = import.meta.glob<Record<string, Persona>>(
    ['./*.ts', '!./index.ts'],
    { eager: true },
);

export const personas: Persona[] = Object.values(modules)
    .flatMap((mod) => Object.values(mod))
    .filter(
        (p): p is Persona => typeof p === 'object' && p !== null && 'id' in p,
    )
    .sort((a, b) => {
        const ia = ORDER.indexOf(a.id);
        const ib = ORDER.indexOf(b.id);

        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
