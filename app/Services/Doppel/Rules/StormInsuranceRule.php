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

/**
 * Weather meets insurance: a KMI storm warning for the customer's city, combined with what the
 * account shows about home insurance. Moving customers get this through HomeInsuranceRule.
 */
class StormInsuranceRule implements Rule
{
    public const HOME_KEYWORDS = ['home', 'fire', 'tenant', 'contents', 'brand', 'woning', 'huurder', 'inboedel'];

    public function key(): string
    {
        return 'storm_insurance';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage !== LifeStage::Moving;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $storm = WeatherForecast::severeFor($customer->city, $today);

        if ($storm === null) {
            return null;
        }

        $weather = [
            'label' => 'Weather forecast',
            'detail' => 'KMI code '.$storm['code'].' warning for '.$customer->city.' on '.Ledger::date($storm['date']).': '.$storm['detail'],
        ];
        $prepare = new ActionData(
            kind: ActionKind::NoSale,
            title: 'Get ready for the storm',
            body: 'Bring your bike and loose items inside, close your windows and do not park under trees.',
            ctaLabel: 'See the KMI warning',
        );

        if (self::isHomeInsured($tx)) {
            return new PredictionData(
                ruleKey: $this->key(),
                title: 'A storm hit '.$customer->city.', but my home was insured',
                body: 'Branches and roof tiles were flying around. My home insurance covered storm damage, and what I had brought inside stayed intact.',
                expectedOn: $storm['date'],
                confidence: 70,
                impactCents: null,
                urgency: 45,
                signals: [
                    $weather,
                    ['label' => 'Home insured', 'detail' => 'Monthly home insurance premium on your account'],
                ],
                actions: [$prepare],
            );
        }

        $renting = Ledger::ofCategory($tx, TransactionCategory::Rent)->isNotEmpty();

        return new PredictionData(
            ruleKey: $this->key(),
            title: $renting
                ? 'A storm hit '.$customer->city.', and my belongings were not insured anywhere'
                : 'A storm hit '.$customer->city.', and my home was not insured anywhere',
            body: $renting
                ? 'Rain came in through a window that blew open. My laptop and my sofa got soaked, and I paid for that damage in full myself.'
                : 'Roof tiles blew off my roof. I paid for that damage in full myself.',
            expectedOn: $storm['date'],
            confidence: 70,
            impactCents: null,
            urgency: 60,
            signals: [
                $weather,
                ['label' => 'No home insurance', 'detail' => $renting
                    ? 'You pay rent, but no premium goes to a home or tenant insurance'
                    : 'No home insurance premium found on your account'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: $renting ? 'KBC Tenant Insurance' : 'KBC Home Insurance',
                    body: $renting
                        ? 'Your belongings and your liability as a tenant covered, storms included.'
                        : 'Fire, water damage and storms covered. Arrange it today and you are covered before the storm arrives.',
                    ctaLabel: 'Calculate your premium',
                ),
                $prepare,
            ],
        );
    }

    public static function isHomeInsured(Collection $tx): bool
    {
        return Ledger::ofCategory($tx, TransactionCategory::Insurance)
            ->contains(fn ($t) => Ledger::mentions($t, self::HOME_KEYWORDS));
    }
}
