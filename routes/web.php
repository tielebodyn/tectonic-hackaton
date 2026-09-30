<?php

use App\Http\Controllers\Doppel\DemoController;
use App\Http\Controllers\Doppel\DoppelController;
use App\Http\Controllers\Doppel\FeedbackController;
use App\Models\Customer;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
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
})->name('home');

Route::post('demo/login/{persona}', [DemoController::class, 'login'])
    ->where('persona', 'lotte|peeters|karim')
    ->name('demo.login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/doppel')->name('dashboard');

    Route::get('doppel', [DoppelController::class, 'show'])->name('doppel');
    Route::post('doppel/feedback', [FeedbackController::class, 'store'])->name('doppel.feedback');
    Route::post('doppel/events/{event}', [DemoController::class, 'event'])->name('doppel.events');
    Route::post('doppel/reset', [DemoController::class, 'reset'])->name('doppel.reset');
});

require __DIR__.'/settings.php';
