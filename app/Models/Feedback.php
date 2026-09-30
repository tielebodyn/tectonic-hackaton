<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['customer_id', 'rule_key', 'prediction_id', 'reason'])]
class Feedback extends Model
{
    protected $table = 'feedback';

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function prediction(): BelongsTo
    {
        return $this->belongsTo(Prediction::class);
    }
}
