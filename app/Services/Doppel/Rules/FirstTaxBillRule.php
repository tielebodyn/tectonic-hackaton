<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Models\Customer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** A first salary means a first tax assessment letter, about two months later. */
class FirstTaxBillRule implements Rule
{
    public function key(): string
    {
        return 'first_tax_bill';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $salary = Ledger::firstSalary($tx, $today);

        if (! $salary) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'My first tax bill landed in the letterbox',
            body: 'My first job also meant my first tax assessment. Whether I had to pay extra or got money back depended on the tax withheld from my salary.',
            expectedOn: $today->addMonthsNoOverflow(2),
            confidence: 70,
            impactCents: null,
            urgency: 40,
            signals: [
                ['label' => 'First salary', 'detail' => $salary->counterparty.' paid your first salary on '.Ledger::date($salary->booked_on)],
                ['label' => 'No tax payments', 'detail' => 'There is not a single payment to the tax office (FOD Financiën) on your account yet'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Put a little aside',
                    body: 'Setting aside a few tenners a month saves you a surprise when the letter comes.',
                    ctaLabel: 'Set a reminder',
                ),
            ],
        );
    }
}
