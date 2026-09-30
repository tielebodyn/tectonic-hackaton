<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use App\Services\Doppel\WeatherForecast;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** Moved house, but no insurance payment anywhere: offer a home insurance. A storm warning makes it urgent. */
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

        $signals = [
            ['label' => 'Moved house', 'detail' => 'Moving costs at '.$moving->pluck('counterparty')->unique()->join(', ')],
            ['label' => 'No insurance', 'detail' => 'No payments to an insurer found'],
        ];
        $storm = WeatherForecast::severeFor($customer->city, $today, 14);

        if ($storm !== null) {
            $signals[] = [
                'label' => 'Weather forecast',
                'detail' => 'KMI code '.$storm['code'].' warning for '.$customer->city.' on '.Ledger::date($storm['date']).': '.$storm['detail'],
            ];

            return new PredictionData(
                ruleKey: $this->key(),
                title: 'A storm hit, and my new home was not insured yet',
                body: 'A few days after the move, roof tiles blew off my roof and it rained into the nursery. I paid for that damage in full myself.',
                expectedOn: $storm['date'],
                confidence: 75,
                impactCents: null,
                urgency: 75,
                signals: $signals,
                actions: [
                    new ActionData(
                        kind: ActionKind::Kbc,
                        title: 'KBC Home Insurance',
                        body: 'Fire, water damage and storms covered. Arrange it today and you are covered before the storm arrives.',
                        ctaLabel: 'Calculate your premium',
                    ),
                    new ActionData(
                        kind: ActionKind::NoSale,
                        title: 'Get ready for the storm',
                        body: 'Bring loose items and moving boxes inside, close your windows and do not park under trees.',
                        ctaLabel: 'See the KMI warning',
                    ),
                ],
            );
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'I lived in my new home without home insurance',
            body: 'After the move my new home was not insured anywhere. A leak or a short circuit would have been mine to pay in full.',
            expectedOn: $today->addDays(14),
            confidence: 80,
            impactCents: null,
            urgency: 50,
            signals: $signals,
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
