<?php

namespace App\Models;

use App\Enums\Scenario;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_id', 'scenario', 'rule_key', 'title', 'body', 'expected_on', 'confidence',
    'impact_cents', 'urgency', 'signals',
])]
class Prediction extends Model
{
    protected function casts(): array
    {
        return [
            'scenario' => Scenario::class,
            'expected_on' => 'immutable_date',
            'confidence' => 'integer',
            'impact_cents' => 'integer',
            'urgency' => 'integer',
            'signals' => 'array',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function actions(): HasMany
    {
        return $this->hasMany(Action::class)->orderBy('position');
    }
}
