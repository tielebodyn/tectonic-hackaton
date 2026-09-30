<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('persona_key')->nullable()->unique();
            $table->string('display_name');
            $table->unsignedTinyInteger('age');
            $table->string('city');
            $table->string('life_stage');
            $table->string('mood')->default('neutral');
            $table->text('persona_summary')->nullable();
            $table->text('diary_opener')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
