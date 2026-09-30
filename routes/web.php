<?php

use App\Http\Controllers\Doppel\DemoController;
use App\Http\Controllers\Doppel\DoppelController;
use App\Http\Controllers\Doppel\FeedbackController;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/** Persona cards for the welcome screen (demo mode only). */
$welcome = function () {
    $personas = config('doppel.demo_mode')
        ? Customer::whereNotNull('persona_key')
            ->orderBy('id')
            ->get(['persona_key', 'display_name', 'age', 'city', 'life_stage', 'persona_summary'])
            ->map(fn (Customer $c) => [
                'persona_key' => $c->persona_key,
                'display_name' => $c->display_name,
                'age' => $c->age,
                'city' => $c->city,
                'mascot_variant' => $c->life_stage->mascotVariant(),
                'persona_summary' => $c->persona_summary,
            ])
        : [];

    return Inertia::render('welcome', ['personas' => $personas]);
};

// The welcome screen is the front door. ?as=lotte still logs in as a persona in one click (demo links).
Route::get('/', function (Request $request) use ($welcome) {
    $as = $request->query('as');

    if (config('doppel.demo_mode') && is_string($as) && preg_match('/^[a-z-]+$/', $as)) {
        $demo = Customer::where('persona_key', $as)->with('user')->first()?->user;
        abort_if($demo === null, 404);
        Auth::login($demo);
        $request->session()->regenerate();

        return redirect()->route('doppel', $request->except('as'));
    }

    return $welcome();
})->name('home');

Route::get('personas', $welcome)->name('personas');

Route::post('demo/login/{persona}', [DemoController::class, 'login'])
    ->where('persona', '[a-z-]+')
    ->name('demo.login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/doppel')->name('dashboard');

    Route::get('doppel', [DoppelController::class, 'show'])->name('doppel');
    Route::post('doppel/feedback', [FeedbackController::class, 'store'])->name('doppel.feedback');
    Route::post('doppel/events/{event}', [DemoController::class, 'event'])->name('doppel.events');
    Route::post('doppel/reset', [DemoController::class, 'reset'])->name('doppel.reset');
});

require __DIR__.'/settings.php';
