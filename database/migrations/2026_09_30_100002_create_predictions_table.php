<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('scenario')->default('base');
            $table->string('rule_key');
            $table->string('title');
            $table->text('body')->nullable();
            $table->date('expected_on');
            $table->unsignedTinyInteger('confidence');
            $table->integer('impact_cents')->nullable();
            $table->unsignedTinyInteger('urgency');
            $table->json('signals');
            $table->timestamps();

            $table->unique(['customer_id', 'scenario', 'rule_key']);
        });

        Schema::create('actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prediction_id')->constrained()->cascadeOnDelete();
            $table->string('kind');
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('cta_label');
            $table->string('partner_name')->nullable();
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actions');
        Schema::dropIfExists('predictions');
    }
};
