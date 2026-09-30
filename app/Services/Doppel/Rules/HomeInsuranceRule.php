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
            ['label' => 'Verhuisd', 'detail' => 'Verhuiskosten bij '.$moving->pluck('counterparty')->unique()->join(', ')],
            ['label' => 'Geen verzekering', 'detail' => 'Geen betalingen aan een verzekeraar gevonden'],
        ];
        $storm = WeatherForecast::severeFor($customer->city, $today, 14);

        if ($storm !== null) {
            $signals[] = [
                'label' => 'Weerbericht',
                'detail' => 'KMI-waarschuwing code '.$storm['code'].' voor '.$customer->city.' op '.Ledger::date($storm['date']).': '.$storm['detail'],
            ];

            return new PredictionData(
                ruleKey: $this->key(),
                title: 'Het stormde, en mijn nieuwe huis was nog nergens verzekerd',
                body: 'Een paar dagen na de verhuis waaiden er dakpannen van mijn dak en regende het binnen in de kinderkamer. Die schade betaalde ik helemaal zelf.',
                expectedOn: $storm['date'],
                confidence: 75,
                impactCents: null,
                urgency: 75,
                signals: $signals,
                actions: [
                    new ActionData(
                        kind: ActionKind::Kbc,
                        title: 'KBC Brandverzekering',
                        body: 'Brand, waterschade en storm gedekt. Vandaag geregeld, dus verzekerd voor de storm er is.',
                        ctaLabel: 'Bereken je premie',
                    ),
                    new ActionData(
                        kind: ActionKind::NoSale,
                        title: 'Maak je klaar voor de storm',
                        body: 'Zet losse spullen en verhuisdozen binnen, sluit je ramen en parkeer niet onder bomen.',
                        ctaLabel: 'Bekijk de KMI-waarschuwing',
                    ),
                ],
            );
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Ik woonde in mijn nieuwe huis zonder brandverzekering',
            body: 'Na de verhuis was mijn nieuwe huis nergens verzekerd. Een lek of een kortsluiting had ik helemaal zelf moeten betalen.',
            expectedOn: $today->addDays(14),
            confidence: 80,
            impactCents: null,
            urgency: 50,
            signals: $signals,
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
