<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** Moved house, but no insurance payment anywhere: offer a home insurance. */
class HomeInsuranceRule implements Rule
{
    public function key(): string
    {
        return 'home_insurance';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Moving;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $moving = Ledger::ofCategory(Ledger::between($tx, $today->subDays(60), $today), TransactionCategory::Moving);

        if ($moving->isEmpty() || Ledger::ofCategory($tx, TransactionCategory::Insurance)->isNotEmpty()) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'I lived in my new home without home insurance',
            body: 'After the move my new home was not insured anywhere. A leak or a short circuit would have been mine to pay in full.',
            expectedOn: $today->addDays(14),
            confidence: 80,
            impactCents: null,
            urgency: 50,
            signals: [
                ['label' => 'Moved house', 'detail' => 'Moving costs at '.$moving->pluck('counterparty')->unique()->join(', ')],
                ['label' => 'No insurance', 'detail' => 'No payments to an insurer found'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: 'KBC Home Insurance',
                    body: 'Fire, water damage and storms covered from the day you get the keys.',
                    ctaLabel: 'Calculate your premium',
                ),
            ],
        );
    }
}
