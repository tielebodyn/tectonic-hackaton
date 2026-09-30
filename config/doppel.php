<?php

return [
    // Fixed "today" for the demo, so predictions and balances are reproducible.
    'today' => env('DOPPEL_TODAY', '2026-09-30'),

    'demo_mode' => (bool) env('DEMO_MODE', false),

    'gemini_key' => env('GEMINI_API_KEY'),
    'gemini_model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
];
