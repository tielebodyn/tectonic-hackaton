<?php

namespace App\Services\Doppel;

use App\Enums\Scenario;
use App\Enums\TransactionCategory;
use App\Models\Transaction;
use App\Services\Doppel\Rules\Ledger;
use Illuminate\Support\Collection;

/**
 * "What if I…": rewrites the transaction list in memory. Nothing is saved; the detector simply
 * runs on the changed list.
 */
class ScenarioTransform
{
    private const MONTHS_AHEAD = 12;

    public function apply(Collection $transactions, Scenario $scenario): Collection
    {
        return match ($scenario) {
            Scenario::Base => $transactions,
            Scenario::Save100 => $this->saveHundred($transactions),
            Scenario::FixedEnergy => $this->fixedEnergy($transactions),
        };
    }

    /** Virtual −€100 savings transfer on the 1st of every coming month. */
    private function saveHundred(Collection $transactions): Collection
    {
        $today = Ledger::today();
        $customerId = $transactions->first()?->customer_id;
        $virtual = collect(range(1, self::MONTHS_AHEAD))->map(fn (int $i) => new Transaction([
            'customer_id' => $customerId,
            'booked_on' => $today->startOfMonth()->addMonthsNoOverflow($i),
            'amount_cents' => -10000,
            'counterparty' => 'KBC Savings Account',
            'category' => TransactionCategory::Savings,
            'description' => 'Savings plan €100 a month (what if)',
            'is_simulated' => true,
        ]));

        return $transactions->concat($virtual)->values();
    }

    /** Energy payments become a fixed tariff, so the winter increase disappears. */
    private function fixedEnergy(Collection $transactions): Collection
    {
        return $transactions->map(function (Transaction $t) {
            if (! Ledger::isEnergy($t)) {
                return $t;
            }

            $fixed = $t->replicate();
            $fixed->description = trim(($t->description ?? '').' ('.Ledger::FIXED_TARIFF_MARKER.')');

            return $fixed;
        })->values();
    }
}
