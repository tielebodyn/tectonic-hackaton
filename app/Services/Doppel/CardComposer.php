<?php

namespace App\Services\Doppel;

use App\Enums\ActionKind;
use App\Enums\Mood;
use App\Models\Action;
use App\Models\Prediction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use App\Services\Doppel\Rules\Ledger;
use Illuminate\Support\Collection;

/**
 * Turns stored predictions into the diary the customer sees: sorted, never two sales cards on
 * top, always one card that sells nothing, and no selling at all when Doppel is paused.
 */
class CardComposer
{
    public const HANDOVER_RULE = 'handover';

    private const SALES_KINDS = [ActionKind::Kbc, ActionKind::Partner];

    /**
     * @param  Collection<int, Prediction|PredictionData>  $predictions
     * @return Collection<int, PredictionData>
     */
    public function compose(Collection $predictions, Mood $mood): Collection
    {
        $cards = $predictions
            ->map(fn (Prediction|PredictionData $p) => $p instanceof Prediction ? self::fromModel($p) : $p)
            ->sort(fn (PredictionData $a, PredictionData $b) => [$b->urgency, $a->expectedOn] <=> [$a->urgency, $b->expectedOn])
            ->values();

        if ($mood === Mood::Paused) {
            $cards = $cards->map(fn (PredictionData $p) => self::withActions($p, array_values(array_filter(
                $p->actions,
                fn (ActionData $a) => ! in_array($a->kind, self::SALES_KINDS, true),
            ))));
            $cards->prepend($this->handover());
        }

        $cards = $this->oneSalesCardOnTop($cards);

        if (! $cards->contains(fn (PredictionData $p) => self::has($p, ActionKind::NoSale))) {
            $cards->push($this->allGood());
        }

        return $cards->values();
    }

    public static function fromModel(Prediction $prediction): PredictionData
    {
        return new PredictionData(
            ruleKey: $prediction->rule_key,
            title: $prediction->title,
            body: $prediction->body,
            expectedOn: $prediction->expected_on,
            confidence: $prediction->confidence,
            impactCents: $prediction->impact_cents,
            urgency: $prediction->urgency,
            signals: $prediction->signals ?? [],
            actions: $prediction->actions->map(fn (Action $a) => new ActionData(
                kind: $a->kind,
                title: $a->title,
                body: $a->body,
                ctaLabel: $a->cta_label,
                partnerName: $a->partner_name,
            ))->all(),
            id: $prediction->id,
        );
    }

    /** If the first two cards both sell something, pull the first non-sales card up to second place. */
    private function oneSalesCardOnTop(Collection $cards): Collection
    {
        if ($cards->count() < 3 || ! self::sells($cards[0]) || ! self::sells($cards[1])) {
            return $cards;
        }

        $index = $cards->search(fn (PredictionData $p) => ! self::sells($p));

        if ($index === false) {
            return $cards;
        }

        $calm = $cards->pull($index);
        $cards = $cards->values();
        $cards->splice(1, 0, [$calm]);

        return $cards;
    }

    private static function sells(PredictionData $p): bool
    {
        return collect($p->actions)->contains(fn (ActionData $a) => in_array($a->kind, self::SALES_KINDS, true));
    }

    private static function has(PredictionData $p, ActionKind $kind): bool
    {
        return collect($p->actions)->contains(fn (ActionData $a) => $a->kind === $kind);
    }

    /** @param  list<ActionData>  $actions */
    private static function withActions(PredictionData $p, array $actions): PredictionData
    {
        return new PredictionData(
            ruleKey: $p->ruleKey,
            title: $p->title,
            body: $p->body,
            expectedOn: $p->expectedOn,
            confidence: $p->confidence,
            impactCents: $p->impactCents,
            urgency: $p->urgency,
            signals: $p->signals,
            actions: $actions,
            id: $p->id,
        );
    }

    private function handover(): PredictionData
    {
        return new PredictionData(
            ruleKey: self::HANDOVER_RULE,
            title: 'This is bigger than a tip. I\'ll hand my diary to someone at KBC if you want.',
            body: 'I saw money getting tight. An app is not enough then: an adviser looks at it with you, without selling you anything.',
            expectedOn: Ledger::today(),
            confidence: 100,
            impactCents: null,
            urgency: 100,
            signals: [
                ['label' => 'Balance dropping', 'detail' => 'Your balance is lower than 30 days ago'],
                ['label' => 'Buy now, pay later', 'detail' => 'A recent purchase paid in instalments'],
                ['label' => 'Shortfall ahead', 'detail' => 'I was short of money for a fixed payment'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Human,
                    title: 'Have a KBC adviser call you',
                    body: 'You only share what you want to. You can always say no.',
                    ctaLabel: 'Yes, share my diary',
                ),
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Not now',
                    body: 'I will just keep watching.',
                    ctaLabel: 'No thanks',
                ),
            ],
        );
    }

    private function allGood(): PredictionData
    {
        return new PredictionData(
            ruleKey: 'all_good',
            title: 'The rest of my month was calm',
            body: 'I saw nothing else you need to act on.',
            expectedOn: Ledger::today()->addDays(30),
            confidence: 70,
            impactCents: null,
            urgency: 0,
            signals: [['label' => 'No surprises', 'detail' => 'Your fixed costs and income ran as usual']],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'All good',
                    body: 'Nothing to do.',
                    ctaLabel: 'Great',
                ),
            ],
        );
    }
}
