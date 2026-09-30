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
    public const HOME_KEYWORDS = ['brand', 'woning', 'huurder', 'inboedel'];

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
            'label' => 'Weerbericht',
            'detail' => 'KMI-waarschuwing code '.$storm['code'].' voor '.$customer->city.' op '.Ledger::date($storm['date']).': '.$storm['detail'],
        ];
        $prepare = new ActionData(
            kind: ActionKind::NoSale,
            title: 'Maak je klaar voor de storm',
            body: 'Zet je fiets en losse spullen binnen, sluit je ramen en parkeer niet onder bomen.',
            ctaLabel: 'Bekijk de KMI-waarschuwing',
        );

        if (self::isHomeInsured($tx)) {
            return new PredictionData(
                ruleKey: $this->key(),
                title: 'Het stormde in '.$customer->city.', maar mijn woning was verzekerd',
                body: 'Er waaiden takken en dakpannen rond. Mijn brandverzekering dekte stormschade, en wat ik binnen had gezet bleef heel.',
                expectedOn: $storm['date'],
                confidence: 70,
                impactCents: null,
                urgency: 45,
                signals: [
                    $weather,
                    ['label' => 'Woning verzekerd', 'detail' => 'Maandelijkse premie voor een brandverzekering op je rekening'],
                ],
                actions: [$prepare],
            );
        }

        $renting = Ledger::ofCategory($tx, TransactionCategory::Rent)->isNotEmpty();

        return new PredictionData(
            ruleKey: $this->key(),
            title: $renting
                ? 'Het stormde in '.$customer->city.', en mijn inboedel was nergens verzekerd'
                : 'Het stormde in '.$customer->city.', en mijn woning was nergens verzekerd',
            body: $renting
                ? 'Het regende binnen langs een raam dat openwaaide. Mijn laptop en mijn zetel waren nat, en die schade betaalde ik helemaal zelf.'
                : 'Er waaiden dakpannen van mijn dak. Die schade betaalde ik helemaal zelf.',
            expectedOn: $storm['date'],
            confidence: 70,
            impactCents: null,
            urgency: 60,
            signals: [
                $weather,
                ['label' => 'Geen woningverzekering', 'detail' => $renting
                    ? 'Je betaalt huur, maar er gaat geen premie naar een brand- of huurdersverzekering'
                    : 'Geen premie voor een brandverzekering gevonden op je rekening'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: $renting ? 'KBC Brandverzekering voor huurders' : 'KBC Brandverzekering',
                    body: $renting
                        ? 'Je inboedel en je aansprakelijkheid als huurder verzekerd, ook bij storm. In Vlaanderen is ze verplicht voor huurcontracten sinds 2019.'
                        : 'Brand, waterschade en storm gedekt. Vandaag geregeld, dus verzekerd voor de storm er is.',
                    ctaLabel: 'Bereken je premie',
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
