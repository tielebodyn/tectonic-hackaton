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
            title: 'Ik woonde in mijn nieuwe huis zonder brandverzekering',
            body: 'Na de verhuis was mijn nieuwe huis nergens verzekerd. Een lek of een kortsluiting had ik helemaal zelf moeten betalen.',
            expectedOn: $today->addDays(14),
            confidence: 80,
            impactCents: null,
            urgency: 50,
            signals: [
                ['label' => 'Verhuisd', 'detail' => 'Verhuiskosten bij '.$moving->pluck('counterparty')->unique()->join(', ')],
                ['label' => 'Geen verzekering', 'detail' => 'Geen betalingen aan een verzekeraar gevonden'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: 'KBC Brandverzekering',
                    body: 'Brand, waterschade en storm gedekt vanaf de dag dat je de sleutels krijgt.',
                    ctaLabel: 'Bereken je premie',
                ),
            ],
        );
    }
}
