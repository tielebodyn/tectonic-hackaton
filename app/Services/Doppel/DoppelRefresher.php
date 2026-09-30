<?php

namespace App\Services\Doppel;

use App\Enums\Mood;
use App\Enums\Scenario;
use App\Models\Customer;
use App\Models\Feedback;
use App\Models\Prediction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Recomputes a customer's diary for one scenario and stores it. Called when something happens
 * (seed, demo event, feedback), never on page load.
 */
class DoppelRefresher
{
    public function __construct(
        private SignalDetector $detector,
        private ScenarioTransform $transform,
        private CardComposer $composer,
    ) {}

    public function refresh(Customer $customer, Scenario $scenario = Scenario::Base): void
    {
        DB::transaction(function () use ($customer, $scenario) {
            $transactions = $this->transform->apply(
                $customer->transactions()->orderBy('booked_on')->get(),
                $scenario,
            );

            $dismissed = Feedback::where('customer_id', $customer->id)->pluck('rule_key')->all();
            $predictions = array_values(array_filter(
                $this->detector->detect($customer, $transactions, $scenario),
                fn (PredictionData $p) => ! in_array($p->ruleKey, $dismissed, true),
            ));

            $stale = Prediction::where('customer_id', $customer->id)->where('scenario', $scenario)->get();
            foreach ($stale as $old) {
                $old->actions()->delete();
                $old->delete();
            }

            foreach ($predictions as $data) {
                $this->store($customer, $scenario, $data);
            }

            // The fork is a "what if": it never changes how the real Doppel feels or speaks.
            if ($scenario !== Scenario::Base) {
                return;
            }

            $customer->mood = $this->detector->mood($transactions, $predictions, $customer->mood);
            $customer->save();

            $this->writeOpener($customer, $scenario);
        });
    }

    private function store(Customer $customer, Scenario $scenario, PredictionData $data): void
    {
        $prediction = Prediction::create([
            'customer_id' => $customer->id,
            'scenario' => $scenario,
            'rule_key' => $data->ruleKey,
            'title' => $data->title,
            'body' => $data->body,
            'expected_on' => $data->expectedOn,
            'confidence' => $data->confidence,
            'impact_cents' => $data->impactCents,
            'urgency' => $data->urgency,
            'signals' => $data->signals,
        ]);

        foreach (array_values($data->actions) as $position => $action) {
            /** @var ActionData $action */
            $prediction->actions()->create([
                'kind' => $action->kind,
                'title' => $action->title,
                'body' => $action->body,
                'cta_label' => $action->ctaLabel,
                'partner_name' => $action->partnerName,
                'position' => $position,
            ]);
        }
    }

    /** AI only writes the opener line. Any failure keeps the previous opener. */
    private function writeOpener(Customer $customer, Scenario $scenario): void
    {
        try {
            $stored = Prediction::with('actions')
                ->where('customer_id', $customer->id)
                ->where('scenario', $scenario)
                ->get();
            $cards = $this->composer->compose($stored, $customer->mood ?? Mood::Neutral);
            $opener = app(AiService::class)->writeOpener($customer, $cards, $scenario);

            if (trim($opener) !== '') {
                $customer->diary_opener = $opener;
                $customer->save();
            }
        } catch (Throwable $e) {
            report($e);
        }
    }
}
