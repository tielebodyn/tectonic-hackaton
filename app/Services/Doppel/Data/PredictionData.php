<?php

namespace App\Services\Doppel\Data;

use Carbon\CarbonImmutable;

final readonly class PredictionData
{
    /**
     * @param  int  $confidence  0-100
     * @param  int  $urgency  0-100
     * @param  list<array{label: string, detail: string}>  $signals
     * @param  list<ActionData>  $actions
     */
    public function __construct(
        public string $ruleKey,
        public string $title,
        public ?string $body,
        public CarbonImmutable $expectedOn,
        public int $confidence,
        public ?int $impactCents,
        public int $urgency,
        public array $signals,
        public array $actions,
        public ?int $id = null,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'rule_key' => $this->ruleKey,
            'title' => $this->title,
            'body' => $this->body,
            'expected_on' => $this->expectedOn->format('Y-m-d'),
            'confidence' => $this->confidence,
            'impact_cents' => $this->impactCents,
            'urgency' => $this->urgency,
            'signals' => $this->signals,
            'actions' => array_map(fn (ActionData $action) => $action->toArray(), $this->actions),
        ];
    }
}
