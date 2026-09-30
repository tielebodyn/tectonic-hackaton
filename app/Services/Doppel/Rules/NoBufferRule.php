<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * No savings and less than one month of spending on the account. When the customer does save
 * (really or in the save_100 scenario) the same rule reports the growing buffer instead.
 */
class NoBufferRule implements Rule
{
    public function key(): string
    {
        return 'no_buffer';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $savings = Ledger::ofCategory($tx, TransactionCategory::Savings);

        if ($savings->isNotEmpty()) {
            return $this->buffer($savings, $today);
        }

        $balance = Ledger::balance($tx, $today);
        $spending = Ledger::monthlySpending($tx, $today);

        if ($spending === 0 || $balance >= $spending) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'By the end of the month my account was almost at zero',
            body: 'I had no savings buffer. One unexpected bill, like a broken laptop, and money would have been tight.',
            expectedOn: $today->addMonthNoOverflow()->endOfMonth()->startOfDay(),
            confidence: 75,
            impactCents: null,
            urgency: 60,
            signals: [
                ['label' => 'No savings account', 'detail' => 'No transfers to a savings account found'],
                ['label' => 'Balance today', 'detail' => Ledger::euro($balance).' in your current account'],
                ['label' => 'Spending per month', 'detail' => Ledger::euro($spending).' in the last 30 days'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: 'Automatic saving with KBC',
                    body: 'Put a fixed amount aside automatically every month, from €25. You can stop or pause at any time.',
                    ctaLabel: 'Start a savings plan',
                ),
            ],
        );
    }

    private function buffer(Collection $savings, CarbonImmutable $today): PredictionData
    {
        $monthly = (int) abs($savings->sortByDesc('booked_on')->first()->amount_cents);
        $firstUpcoming = $savings->filter(fn (Transaction $t) => $t->booked_on->gt($today))->sortBy('booked_on')->first();
        $horizon = $today->addDays(30);
        $saved = (int) abs($savings->filter(fn (Transaction $t) => $t->booked_on->lte($horizon))->sum('amount_cents'));

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'I put '.Ledger::euro($monthly).' aside and had my first buffer',
            body: 'Every month '.Ledger::euro($monthly).' went to my savings account automatically. After one month I already had a first buffer for an unexpected bill.',
            expectedOn: $firstUpcoming?->booked_on ?? $horizon,
            confidence: 90,
            impactCents: $saved,
            urgency: 20,
            signals: [
                ['label' => 'Monthly saving', 'detail' => Ledger::euro($monthly).' a month to your savings account'],
                ['label' => 'Buffer in 30 days', 'detail' => Ledger::euro($saved).' saved'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Your buffer is growing',
                    body: 'Nothing to do. I will keep an eye on it for you.',
                    ctaLabel: 'Great',
                ),
            ],
        );
    }
}
