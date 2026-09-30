<?php

namespace App\Services\Doppel;

use App\Enums\Scenario;
use App\Models\Customer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Writes the short diary opener Doppel shows on top of the page.
 *
 * Calls Gemini when a key is configured; any failure (no key, timeout,
 * empty answer) falls back to a deterministic English sentence, so the
 * demo never breaks on the network.
 */
class AiService
{
    private const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    private const TIMEOUT_SECONDS = 8;

    public function writeOpener(Customer $customer, Collection $predictions, Scenario $scenario): string
    {
        $top = $predictions->take(3)->values();

        try {
            $text = $this->askGemini($customer, $top, $scenario);
        } catch (Throwable $e) {
            Log::warning('Doppel AI opener failed, using fallback', ['error' => $e->getMessage()]);
            $text = null;
        }

        return $text ?? $this->fallbackOpener($customer, $top, $scenario);
    }

    private function askGemini(Customer $customer, Collection $predictions, Scenario $scenario): ?string
    {
        $key = config('doppel.gemini_key');

        if (blank($key)) {
            return null;
        }

        $response = Http::timeout(self::TIMEOUT_SECONDS)
            ->withHeaders(['x-goog-api-key' => $key])
            ->post(sprintf(self::ENDPOINT, config('doppel.gemini_model')), [
                'system_instruction' => ['parts' => [['text' => $this->systemPrompt()]]],
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => $this->userPrompt($customer, $predictions, $scenario)]]],
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 1024,
                ],
            ]);

        if ($response->failed()) {
            Log::warning('Doppel AI opener HTTP error', ['status' => $response->status()]);

            return null;
        }

        $text = collect($response->json('candidates.0.content.parts', []))
            ->pluck('text')
            ->filter()
            ->implode('');

        $text = trim($text, " \n\r\t\"");

        return $text === '' ? null : $text;
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are Doppel, the digital double of a KBC customer. You have already "lived" the customer's next 30 days and now briefly tell what happened to you.
Rules:
- Write in English: short, warm, plain and informal ("you"), in the first person and in the past tense.
- At most two sentences, no more than 40 words together.
- Start with "Hey <first name>, I've already lived your next month." and name the most important moment with its amount and date.
- Never use future time words such as "next week", "tomorrow" or "in three weeks" with the past tense. Name a date: "On 7 October I was ... short."
- Write dates as "7 October" and amounts as "€1,262.03".
- No sales talk, no product names, no emoji, no quotation marks.
- Never make up amounts or dates that are not in the input.
PROMPT;
    }

    private function userPrompt(Customer $customer, Collection $predictions, Scenario $scenario): string
    {
        $lines = [
            'Customer: '.$customer->display_name.', '.$customer->age.' years old, '.$customer->city.'.',
            'Profile: '.($customer->persona_summary ?? 'unknown'),
            'Scenario: '.$this->scenarioLabel($scenario),
            'What happened to me (most important first):',
        ];

        foreach ($predictions as $prediction) {
            $amount = $this->field($prediction, 'impact_cents', 'impactCents');
            $date = $this->field($prediction, 'expected_on', 'expectedOn');

            $lines[] = '- '.$this->field($prediction, 'title', 'title')
                .($date ? ' (on '.$this->formatDate($date).')' : '')
                .($amount !== null ? ' [amount: '.$this->formatEuro((int) $amount).']' : '');
        }

        if ($predictions->isEmpty()) {
            $lines[] = '- Nothing special: the month was calm.';
        }

        return implode("\n", $lines);
    }

    private function fallbackOpener(Customer $customer, Collection $predictions, Scenario $scenario): string
    {
        $firstName = strtok((string) $customer->display_name, ' ') ?: 'there';
        $intro = $scenario === Scenario::Base
            ? "Hey {$firstName}, I've already lived your next month."
            : "Hey {$firstName}, I lived your next month once more, {$this->scenarioLabel($scenario)}.";

        $top = $predictions->first();

        if ($top === null) {
            return $intro.' It turned out to be a calm month, with no surprises.';
        }

        return $intro.' '.rtrim((string) $this->field($top, 'title', 'title'), '.').'.';
    }

    private function scenarioLabel(Scenario $scenario): string
    {
        return match ($scenario->value) {
            'save_100' => 'in the version where you put €100 aside every month',
            'fixed_energy' => 'in the version with a fixed-rate energy contract',
            default => 'the way things are going now',
        };
    }

    /** Predictions arrive as Prediction models or PredictionData DTOs. */
    private function field(mixed $prediction, string $snake, string $camel): mixed
    {
        return data_get($prediction, $snake) ?? data_get($prediction, $camel);
    }

    private function formatDate(mixed $date): string
    {
        return Carbon::parse($date)->format('j F');
    }

    private function formatEuro(int $cents): string
    {
        return '€'.number_format(abs($cents) / 100, 0, '.', ',');
    }
}
