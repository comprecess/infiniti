<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clx_project_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique()->comment('Unique template identifier: exit_deal, fundraising, venture_building');
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->json('default_roles')->nullable()->comment('Default participant roles for this template type');
            $table->json('default_statuses')->nullable()->comment('Default project statuses/stages');
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clx_project_templates');
    }
};
