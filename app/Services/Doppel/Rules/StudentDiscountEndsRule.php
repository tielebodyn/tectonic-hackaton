<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** Student-priced subscriptions plus a first salary: the student discount is about to end. */
class StudentDiscountEndsRule implements Rule
{
    public function key(): string
    {
        return 'student_discount_ends';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $salary = Ledger::firstSalary($tx, $today);
        $studentSubs = Ledger::ofCategory(Ledger::between($tx, $today->subDays(45), $today), TransactionCategory::Subscription)
            ->filter(fn (Transaction $t) => Ledger::mentions($t, ['student']))
            ->unique(fn (Transaction $t) => mb_strtolower($t->counterparty ?? ''))
            ->values();

        if (! $salary || $studentSubs->isEmpty()) {
            return null;
        }

        $names = $studentSubs->pluck('counterparty')->join(', ', ' en ');
        // Regular price is roughly double the student price.
        $extra = (int) abs($studentSubs->sum('amount_cents'));

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Op '.Ledger::date($today->addDays(7)).' verloor ik mijn studentenkorting',
            body: "Met mijn eerste vaste job was ik geen student meer. {$names} schakelden over naar het gewone tarief: ongeveer ".Ledger::euro($extra).' per maand meer.',
            expectedOn: $today->addDays(7),
            confidence: 85,
            impactCents: -$extra,
            urgency: 70,
            signals: [
                ['label' => 'Studententarief', 'detail' => $studentSubs->map(fn (Transaction $t) => $t->counterparty.' ('.Ledger::euro($t->amount_cents).'/maand)')->join(', ')],
                ['label' => 'Eerste loon', 'detail' => $salary->counterparty.' stortte '.Ledger::euro($salary->amount_cents).' op '.Ledger::date($salary->booked_on)],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Zet je abonnementen op een rij',
                    body: 'Kijk welke je echt gebruikt voor de korting wegvalt. Opzeggen kan meestal per maand.',
                    ctaLabel: 'Bekijk abonnementen',
                ),
            ],
        );
    }
}
