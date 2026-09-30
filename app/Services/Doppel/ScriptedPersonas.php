<?php

namespace App\Services\Doppel;

use App\Enums\ActionKind;
use App\Enums\Mood;
use App\Models\Customer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use App\Services\Doppel\Rules\Ledger;

/**
 * Extra demo personas whose diary is scripted in database/data/personas/{key}.json instead of
 * derived by rules. They still flow through the same refresher, composer, feedback and reset.
 */
class ScriptedPersonas
{
    public static function path(?string $key): ?string
    {
        if ($key === null || ! preg_match('/^[a-z-]+$/', $key)) {
            return null;
        }

        $path = database_path("data/personas/{$key}.json");

        return is_file($path) ? $path : null;
    }

    public static function has(?Customer $customer): bool
    {
        return self::path($customer?->persona_key) !== null;
    }

    /** @return array<string, mixed>|null */
    public static function load(?string $key): ?array
    {
        $path = self::path($key);

        return $path ? json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR) : null;
    }

    /** @return list<array<string, mixed>> */
    public static function all(): array
    {
        return collect(glob(database_path('data/personas/*.json')) ?: [])
            ->map(fn (string $path) => json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR))
            ->sortBy('order')
            ->values()
            ->all();
    }

    /** @return list<PredictionData> */
    public static function predictions(Customer $customer): array
    {
        $script = self::load($customer->persona_key) ?? ['cards' => []];
        $today = Ledger::today();

        return collect($script['cards'])->map(fn (array $card) => new PredictionData(
            ruleKey: $card['rule_key'],
            title: $card['title'],
            body: $card['body'] ?? null,
            expectedOn: $today->addDays((int) $card['days_ahead']),
            confidence: (int) $card['confidence'],
            impactCents: isset($card['impact_cents']) ? (int) $card['impact_cents'] : null,
            urgency: (int) $card['urgency'],
            signals: $card['signals'] ?? [],
            actions: collect($card['actions'] ?? [])->map(fn (array $a) => new ActionData(
                kind: ActionKind::from($a['kind']),
                title: $a['title'],
                body: $a['body'] ?? null,
                ctaLabel: $a['cta_label'],
                partnerName: $a['partner_name'] ?? null,
            ))->all(),
        ))->all();
    }

    public static function mood(Customer $customer): ?Mood
    {
        $script = self::load($customer->persona_key);

        return $script ? Mood::from($script['mood'] ?? 'neutral') : null;
    }

    /** @return array{income_cents: int, spend_cents: int}|null */
    public static function monthly(Customer $customer): ?array
    {
        $script = self::load($customer->persona_key);

        return $script['monthly'] ?? null;
    }
}
