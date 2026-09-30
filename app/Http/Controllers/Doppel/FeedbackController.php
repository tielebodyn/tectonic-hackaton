<?php

namespace App\Http\Controllers\Doppel;

use App\Enums\Scenario;
use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Services\Doppel\DoppelRefresher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/** "That's not me": the customer rejects a prediction, Doppel stops predicting that rule. */
class FeedbackController extends Controller
{
    public function store(Request $request, DoppelRefresher $refresher): RedirectResponse
    {
        $customer = DoppelController::customerFor($request);

        $validated = $request->validate([
            'prediction_id' => ['required', 'integer'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $prediction = $customer->predictions()->findOrFail($validated['prediction_id']);

        Feedback::create([
            'customer_id' => $customer->id,
            'rule_key' => $prediction->rule_key,
            'prediction_id' => $prediction->id,
            'reason' => $validated['reason'] ?? null,
        ]);

        // Feedback applies to every scenario: rebuild base now, forks lazily on next visit.
        $customer->predictions()->where('scenario', '!=', Scenario::Base)->delete();
        $refresher->refresh($customer, Scenario::Base);

        return back()->with('status', 'Got it, I\'ll keep that in mind from now on.');
    }
}
