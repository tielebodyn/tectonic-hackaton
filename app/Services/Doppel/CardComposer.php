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
            title: 'Dit is groter dan een tip. Ik geef mijn dagboek door aan iemand van KBC als je dat wil.',
            body: 'Ik zag dat het krap werd. Dan is een app niet genoeg: een adviseur kijkt samen met jou, zonder iets te verkopen.',
            expectedOn: Ledger::today(),
            confidence: 100,
            impactCents: null,
            urgency: 100,
            signals: [
                ['label' => 'Saldo daalt', 'detail' => 'Je saldo is lager dan 30 dagen geleden'],
                ['label' => 'Achteraf betalen', 'detail' => 'Een recente aankoop met uitgestelde betaling'],
                ['label' => 'Tekort op komst', 'detail' => 'Ik kwam geld tekort voor een vaste betaling'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Human,
                    title: 'Laat een KBC-adviseur je bellen',
                    body: 'Je deelt alleen wat je zelf wil. Je kan altijd weigeren.',
                    ctaLabel: 'Ja, geef mijn dagboek door',
                ),
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Nu niet',
                    body: 'Ik blijf gewoon meekijken.',
                    ctaLabel: 'Nee, bedankt',
                ),
            ],
        );
    }

    private function allGood(): PredictionData
    {
        return new PredictionData(
            ruleKey: 'all_good',
            title: 'Voor de rest verliep mijn maand rustig',
            body: 'Ik zag niets anders waar je iets mee moet doen.',
            expectedOn: Ledger::today()->addDays(30),
            confidence: 70,
            impactCents: null,
            urgency: 0,
            signals: [['label' => 'Geen verrassingen', 'detail' => 'Je vaste kosten en inkomsten liepen zoals gewoonlijk']],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Alles in orde 👍',
                    body: 'Geen actie nodig.',
                    ctaLabel: 'Top',
                ),
            ],
        );
    }
}
