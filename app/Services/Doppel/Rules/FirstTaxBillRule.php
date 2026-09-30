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
            title: 'Over twee maanden viel mijn eerste belastingbrief in de bus',
            body: 'Mijn eerste job betekende ook mijn eerste aanslagbiljet. Of ik moest bijbetalen of iets terugkreeg, hing af van de voorheffing op mijn loon.',
            expectedOn: $today->addMonthsNoOverflow(2),
            confidence: 70,
            impactCents: null,
            urgency: 40,
            signals: [
                ['label' => 'Eerste loon', 'detail' => $salary->counterparty.' stortte je eerste loon op '.Ledger::date($salary->booked_on)],
                ['label' => 'Geen belastingbetalingen', 'detail' => 'Er staat nog geen enkele betaling aan de FOD Financiën op je rekening'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Zet een klein potje opzij',
                    body: 'Een paar tientjes per maand opzij zetten voorkomt een verrassing als de brief komt.',
                    ctaLabel: 'Zet een herinnering',
                ),
            ],
        );
    }
}
