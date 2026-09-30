<?php

namespace Tests\Unit\Doppel;

use App\Enums\TransactionCategory as Cat;
use App\Models\Transaction;
use Illuminate\Support\Collection;

/** Karim's demo month in memory: balance €1.450 today, €650 fixed costs to 20 Oct, €1.700 VAT. */
class KarimFixture
{
    public static function transactions(): Collection
    {
        $rows = [];

        foreach (['07', '08', '09'] as $m) {
            $rows[] = ["2026-{$m}-03", -3850, 'Farys', Cat::Utilities];
            $rows[] = ["2026-{$m}-05", -35000, 'KBC Autolening', Cat::Other];
            $rows[] = ["2026-{$m}-08", -15650, 'Xerius', Cat::Other];
            $rows[] = ["2026-{$m}-10", -2419, 'Adobe', Cat::Subscription];
            $rows[] = ["2026-{$m}-12", -1199, 'Canva', Cat::Subscription];
            $rows[] = ["2026-{$m}-14", -6882, 'Ethias', Cat::Insurance];
            $rows[] = ["2026-{$m}-15", 65000, 'Bakkerij Verhaeghe', Cat::Income];
            $rows[] = ["2026-{$m}-22", 42000, 'Fietsen Claes', Cat::Income];
            $rows[] = ["2026-{$m}-28", -85000, 'Huur', Cat::Rent];
            $rows[] = ["2026-{$m}-18", -6000 - (int) $m * 731, 'Colruyt', Cat::Groceries];
        }

        $rows[] = ['2026-07-03', 320000, 'Studio Noord', Cat::Income];
        $rows[] = ['2026-07-30', 320000, 'Studio Noord', Cat::Income];
        $rows[] = ['2026-07-20', -170000, 'FOD Financiën', Cat::Tax];
        $rows[] = ['2026-09-25', -8997, 'Klarna', Cat::Bnpl];

        $sum = array_sum(array_column($rows, 1));
        $rows[] = ['2026-07-02', 145000 - $sum, 'Beginsaldo', Cat::Income];

        return collect($rows)->map(fn (array $r) => self::tx(...$r))->sortBy('booked_on')->values();
    }

    public static function tx(string $on, int $cents, string $counterparty, Cat $category, bool $simulated = false): Transaction
    {
        return new Transaction([
            'booked_on' => $on,
            'amount_cents' => $cents,
            'counterparty' => $counterparty,
            'category' => $category,
            'description' => $counterparty === 'Beginsaldo' ? 'Beginsaldo' : null,
            'is_simulated' => $simulated,
        ]);
    }

    public static function invoicePaid(): Transaction
    {
        return self::tx('2026-09-30', 320000, 'Brouwerij De Leie', Cat::Income, true);
    }
}
