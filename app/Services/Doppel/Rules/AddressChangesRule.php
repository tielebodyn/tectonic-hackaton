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
    private const CHECKLIST = ['the town hall', 'your employer', 'your health insurance fund', 'your energy supplier', 'your internet provider', 'your insurer'];

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
        $list = collect(self::CHECKLIST)->join(', ', ' and ');

        return new PredictionData(
            ruleKey: $this->key(),
            title: "I had to change my address in {$count} places",
            body: "After the move I had to give my new address to {$list}. Whoever I forgot still sent my post to the old address.",
            expectedOn: $today->addDays(14),
            confidence: 90,
            impactCents: null,
            urgency: 65,
            signals: [
                ['label' => 'Moving costs', 'detail' => $moving->pluck('counterparty')->unique()->join(', ').' in the last 60 days'],
                ['label' => 'Total move', 'detail' => Ledger::euro((int) $moving->sum('amount_cents')).' spent on the move'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Change of address checklist',
                    body: 'Tick off who you have already told: '.collect(self::CHECKLIST)->map(fn (string $who) => ucfirst($who))->join(', ').'.',
                    ctaLabel: 'Open the checklist',
                ),
            ],
        );
    }
}
