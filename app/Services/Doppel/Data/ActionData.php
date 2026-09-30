<?php

namespace App\Services\Doppel\Data;

use App\Enums\ActionKind;

final readonly class ActionData
{
    public function __construct(
        public ActionKind $kind,
        public string $title,
        public ?string $body,
        public string $ctaLabel,
        public ?string $partnerName = null,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'kind' => $this->kind->value,
            'title' => $this->title,
            'body' => $this->body,
            'cta_label' => $this->ctaLabel,
            'partner_name' => $this->partnerName,
        ];
    }
}
