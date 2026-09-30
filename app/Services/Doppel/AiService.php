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
 * empty answer) falls back to a deterministic Dutch sentence, so the
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
Je bent Doppel, de digitale dubbelganger van een KBC-klant. Je hebt de komende 30 dagen van de klant al "beleefd" en vertelt nu kort wat je meemaakte.
Regels:
- Schrijf in het Nederlands (Vlaams, informeel, "je"), in de ik-vorm en in de verleden tijd.
- Maximaal twee zinnen, samen hoogstens 40 woorden.
- Begin met "Hey <voornaam>," en noem het belangrijkste moment met bedrag en datum.
- Geen verkooppraat, geen productnamen, geen emoji, geen aanhalingstekens.
- Verzin geen bedragen of data die niet in de input staan.
PROMPT;
    }

    private function userPrompt(Customer $customer, Collection $predictions, Scenario $scenario): string
    {
        $lines = [
            'Klant: '.$customer->display_name.', '.$customer->age.' jaar, '.$customer->city.'.',
            'Profiel: '.($customer->persona_summary ?? 'onbekend'),
            'Scenario: '.$this->scenarioLabel($scenario),
            'Wat ik meemaakte (belangrijkste eerst):',
        ];

        foreach ($predictions as $prediction) {
            $amount = $this->field($prediction, 'impact_cents', 'impactCents');
            $date = $this->field($prediction, 'expected_on', 'expectedOn');

            $lines[] = '- '.$this->field($prediction, 'title', 'title')
                .($date ? ' (op '.$this->formatDate($date).')' : '')
                .($amount !== null ? ' [bedrag: '.$this->formatEuro((int) $amount).']' : '');
        }

        if ($predictions->isEmpty()) {
            $lines[] = '- Niets bijzonders: de maand verliep rustig.';
        }

        return implode("\n", $lines);
    }

    private function fallbackOpener(Customer $customer, Collection $predictions, Scenario $scenario): string
    {
        $firstName = strtok((string) $customer->display_name, ' ') ?: 'daar';
        $intro = $scenario === Scenario::Base
            ? "Hey {$firstName}, ik heb je komende maand al geleefd."
            : "Hey {$firstName}, ik heb je komende maand nog eens geleefd, {$this->scenarioLabel($scenario)}.";

        $top = $predictions->first();

        if ($top === null) {
            return $intro.' Het werd een rustige maand, zonder verrassingen.';
        }

        return $intro.' '.rtrim((string) $this->field($top, 'title', 'title'), '.').'.';
    }

    private function scenarioLabel(Scenario $scenario): string
    {
        return match ($scenario->value) {
            'save_100' => 'in de versie waarin je elke maand €100 opzij zette',
            'fixed_energy' => 'in de versie met een vast energiecontract',
            default => 'zoals het nu loopt',
        };
    }

    /** Predictions arrive as Prediction models or PredictionData DTOs. */
    private function field(mixed $prediction, string $snake, string $camel): mixed
    {
        return data_get($prediction, $snake) ?? data_get($prediction, $camel);
    }

    private function formatDate(mixed $date): string
    {
        return Carbon::parse($date)->locale('nl')->translatedFormat('j F');
    }

    private function formatEuro(int $cents): string
    {
        return '€'.number_format(abs($cents) / 100, 0, ',', '.');
    }
}
