<?php

namespace App\Http\Controllers;

use App\Ai\Agents\AssistantAgent;
use Illuminate\Http\Request;
use Laravel\Ai\Streaming\Events\TextDelta;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class AiChatController extends Controller
{
    public function __invoke(Request $request, AssistantAgent $agent): StreamedResponse
    {
        $validated = $request->validate([
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.role' => ['required', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string'],
        ]);

        $history = $validated['messages'];
        $prompt = array_pop($history);

        $stream = $agent->withMessages($history)->stream($prompt['content']);

        return response()->stream(function () use ($stream) {
            try {
                foreach ($stream as $event) {
                    if ($event instanceof TextDelta) {
                        yield $event->delta;
                    }
                }
            } catch (Throwable $exception) {
                report($exception);

                yield "\n\n[The assistant stopped early: {$exception->getMessage()}]";
            }
        }, headers: [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'no-cache, no-transform',
        ]);
    }
}
