<?php

namespace App\Models;

use App\Enums\ActionKind;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['prediction_id', 'kind', 'title', 'body', 'cta_label', 'partner_name', 'position'])]
class Action extends Model
{
    protected function casts(): array
    {
        return [
            'kind' => ActionKind::class,
            'position' => 'integer',
        ];
    }

    public function prediction(): BelongsTo
    {
        return $this->belongsTo(Prediction::class);
    }
}
