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

/** Moving costs on the account: time to change the address everywhere. No sales pitch. */
class AddressChangesRule implements Rule
{
    private const CHECKLIST = ['de gemeente', 'je werkgever', 'je ziekenfonds', 'je energieleverancier', 'je internetprovider', 'je verzekeraar'];

    public function key(): string
    {
        return 'address_changes';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Moving;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $moving = Ledger::ofCategory(Ledger::between($tx, $today->subDays(60), $today), TransactionCategory::Moving);

        if ($moving->isEmpty()) {
            return null;
        }

        $count = count(self::CHECKLIST);
        $list = collect(self::CHECKLIST)->join(', ', ' en ');

        return new PredictionData(
            ruleKey: $this->key(),
            title: "Ik moest bij {$count} instanties mijn adres wijzigen",
            body: "Na de verhuis moest ik mijn nieuwe adres doorgeven aan {$list}. Wie ik vergat, stuurde mijn post nog naar het oude adres.",
            expectedOn: $today->addDays(14),
            confidence: 90,
            impactCents: null,
            urgency: 65,
            signals: [
                ['label' => 'Verhuiskosten', 'detail' => $moving->pluck('counterparty')->unique()->join(', ').' in de laatste 60 dagen'],
                ['label' => 'Totaal verhuis', 'detail' => Ledger::euro((int) $moving->sum('amount_cents')).' uitgegeven aan de verhuis'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Checklist adreswijziging',
                    body: 'Vink af wie je al verwittigd hebt: '.collect(self::CHECKLIST)->map(fn (string $who) => ucfirst($who))->join(', ').'.',
                    ctaLabel: 'Open de checklist',
                ),
            ],
        );
    }
}
