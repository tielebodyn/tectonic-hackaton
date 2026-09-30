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

/**
 * Balance today, minus the fixed outflows until the next quarterly VAT deadline, minus a VAT
 * payment as big as the previous one. Negative means Doppel came up short.
 */
class VatShortfallRule implements Rule
{
    public function key(): string
    {
        return 'vat_shortfall';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::SelfEmployed;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $previousVat = Ledger::ofCategory($tx, TransactionCategory::Tax)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0 && $t->booked_on->lte($today))
            ->sortBy('booked_on')
            ->last();

        if (! $previousVat) {
            return null;
        }

        $deadline = self::nextVatDeadline($today);
        $balance = Ledger::balance($tx, $today);
        $outflows = Ledger::projectedOutflows($tx, $today, $deadline);
        $outflowCents = (int) $outflows->sum('amount_cents');
        $vatCents = (int) abs($previousVat->amount_cents);
        $shortfall = $balance - $outflowCents - $vatCents;

        if ($shortfall >= 0) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Over '.self::weeks($today, $deadline).' kwam ik '.Ledger::euro($shortfall).' tekort voor mijn btw',
            body: 'Op '.Ledger::date($deadline).' moest mijn btw voor dit kwartaal betaald zijn. Na mijn vaste kosten stond er niet genoeg meer op de rekening.',
            expectedOn: $deadline,
            confidence: 85,
            impactCents: $shortfall,
            urgency: 90,
            signals: [
                ['label' => 'Saldo vandaag', 'detail' => Ledger::euro($balance).' op je zakelijke rekening'],
                ['label' => 'Vaste uitgaven tot '.Ledger::date($deadline), 'detail' => Ledger::euro($outflowCents).' aan '.$outflows->count().' vaste betalingen'],
                ['label' => 'Btw vorig kwartaal', 'detail' => Ledger::euro($vatCents).' betaald op '.Ledger::date($previousVat->booked_on)],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: 'KBC Business kaskrediet',
                    body: 'Een flexibele kredietlijn voor je zaak. Je betaalt alleen rente op wat je echt gebruikt.',
                    ctaLabel: 'Bekijk kaskrediet',
                ),
            ],
        );
    }

    /** Quarterly VAT is due on the 20th of January, April, July and October. */
    public static function nextVatDeadline(CarbonImmutable $today): CarbonImmutable
    {
        $candidate = $today->startOfMonth()->setDay(20);

        while ($candidate->lte($today) || ! in_array($candidate->month, [1, 4, 7, 10], true)) {
            $candidate = $candidate->addMonthNoOverflow();
        }

        return $candidate;
    }

    private static function weeks(CarbonImmutable $from, CarbonImmutable $to): string
    {
        $weeks = max(1, (int) round($from->diffInDays($to) / 7));

        return match ($weeks) {
            1 => 'een week',
            2 => 'twee weken',
            3 => 'drie weken',
            4 => 'vier weken',
            default => "{$weeks} weken",
        };
    }
}
