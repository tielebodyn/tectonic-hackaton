<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Models\Customer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** Income fell by 30% or more compared to the months before: offer a human, not a product. */
class AdvisorCallRule implements Rule
{
    public function key(): string
    {
        return 'advisor_call';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::SelfEmployed;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $income = Ledger::income($tx);
        $lastMonth = (int) Ledger::between($income, $today->subDays(30), $today)->sum('amount_cents');
        $before = (int) round(Ledger::between($income, $today->subDays(90), $today->subDays(30))->sum('amount_cents') / 2);

        if ($before === 0 || $lastMonth > $before * 0.7) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Mijn inkomsten zakten van '.Ledger::euro($before).' naar '.Ledger::euro($lastMonth).' per maand',
            body: 'Ik wilde er met iemand over praten die zelfstandigen kent, niet met een app.',
            expectedOn: $today->addDays(7),
            confidence: 80,
            impactCents: $lastMonth - $before,
            urgency: 60,
            signals: [
                ['label' => 'Inkomsten laatste 30 dagen', 'detail' => Ledger::euro($lastMonth)],
                ['label' => 'Gemiddeld de 2 maanden ervoor', 'detail' => Ledger::euro($before).' per maand'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Human,
                    title: 'Wil je dat een adviseur je belt?',
                    body: 'Een KBC-adviseur voor zelfstandigen belt je, zonder verkooppraatje.',
                    ctaLabel: 'Ja, bel me',
                ),
            ],
        );
    }
}
