<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** Income comfortably covers rent and fixed costs: a card that sells nothing. */
class BudgetOkRule implements Rule
{
    public function key(): string
    {
        return 'budget_ok';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $income = (int) Ledger::income(Ledger::between($tx, $today->subDays(30), $today))
            ->filter(fn (Transaction $t) => $t->booked_on->lte($today))
            ->sum('amount_cents');
        $fixed = (int) Ledger::recurringOutflows($tx, $today)->sum('amount_cents');
        $left = $income - $fixed;

        if ($income === 0 || $left <= 0) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'After rent and fixed costs I had '.Ledger::euro($left).' left',
            body: 'My salary easily covered my fixed costs. What I spent after that was my own choice.',
            expectedOn: $today->addMonthNoOverflow()->endOfMonth()->startOfDay(),
            confidence: 80,
            impactCents: $left,
            urgency: 10,
            signals: [
                ['label' => 'Income', 'detail' => Ledger::euro($income).' in the last 30 days'],
                ['label' => 'Fixed costs', 'detail' => Ledger::euro($fixed).' a month on rent and subscriptions'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Your budget is in good shape',
                    body: 'Nothing to do. I will keep an eye on it for you.',
                    ctaLabel: 'Great',
                ),
            ],
        );
    }
}
