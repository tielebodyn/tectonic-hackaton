<?php

use App\Http\Controllers\AiChatController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::post('ai/chat', AiChatController::class)->name('ai.chat');
});

require __DIR__.'/settings.php';
