<?php

use App\Http\Controllers\Doppel\DemoController;
use App\Http\Controllers\Doppel\DoppelController;
use App\Http\Controllers\Doppel\FeedbackController;
use App\Models\Customer;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// POC: the app is the front door. In demo mode guests land straight in Keano's app as Karim.
Route::get('/', function (Illuminate\Http\Request $request) {
    if (! config('doppel.demo_mode')) {
        return redirect()->route('personas');
    }

    // ?as=lotte switches persona in one click (demo links, screenshots).
    $as = $request->query('as');
    if (! $request->user() || is_string($as)) {
        $key = is_string($as) && preg_match('/^[a-z-]+$/', $as) ? $as : 'karim';
        $demo = Customer::where('persona_key', $key)->with('user')->first()?->user;
        abort_if($demo === null, 503, 'Run ddev artisan migrate:fresh --seed first.');
        Illuminate\Support\Facades\Auth::login($demo);
        $request->session()->regenerate();
    }

    return redirect()->route('doppel', $request->except('as'));
})->name('home');

Route::get('personas', function () {
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
})->name('personas');

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
