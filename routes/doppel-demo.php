<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| DEMO ONLY
|--------------------------------------------------------------------------
| Rendert de Doppel-pagina vanuit de frontend-mocks tot de echte controller
| er is. De klant komt uit auth()->user(); er gaan geen klant-ID's over de lijn.
| Verwijderen zodra /doppel door de backend wordt bediend.
*/

Route::middleware(['auth', 'verified'])->get('/doppel-demo', function (Request $request) {
    $personas = ['lotte', 'peeters', 'karim', 'karim-after'];
    $persona = $request->query('persona', 'lotte');

    if (! in_array($persona, $personas, true)) {
        $persona = 'lotte';
    }

    $props = File::json(resource_path("js/mock/{$persona}.json"));

    return Inertia::render('doppel/index', [
        ...$props,
        'demo' => [
            'persona' => $persona,
            'canPostFeedback' => Route::has('predictions.feedback'),
            'canSimulate' => Route::has('demo.simulate-transaction'),
        ],
    ]);
})->name('doppel.demo');
