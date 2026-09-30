<?php

namespace App\Services\Doppel;

use Carbon\CarbonImmutable;

/**
 * Mocked KMI weather warnings per city. In production this would read the public KMI warnings
 * once a day for every municipality: one call per city, not per customer, so it scales.
 */
class WeatherForecast
{
    /**
     * First severe weather warning for the city within the next $days days.
     *
     * @return array{date: CarbonImmutable, type: string, code: string, detail: string}|null
     */
    public static function severeFor(string $city, CarbonImmutable $today, int $days = 30): ?array
    {
        foreach (self::warnings($city, $today) as $warning) {
            if ($warning['date']->gt($today) && $warning['date']->lte($today->addDays($days))) {
                return $warning;
            }
        }

        return null;
    }

    /** @return list<array{date: CarbonImmutable, type: string, code: string, detail: string}> */
    private static function warnings(string $city, CarbonImmutable $today): array
    {
        return match (mb_strtolower($city)) {
            'gent' => [
                ['date' => $today->addDays(4), 'type' => 'storm', 'code' => 'oranje', 'detail' => 'windstoten tot 100 km/u en hevige regen'],
            ],
            default => [],
        };
    }
}
