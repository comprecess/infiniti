<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds a UNIQUE composite index to clx_shared_preferences to prevent duplicate keys
     * and enable efficient lookups by (relation_type, relation_id, key).
     */
    public function up(): void
    {
        Schema::table('clx_shared_preferences', function (Blueprint $table) {
            $table->unique(
                ['relation_type', 'relation_id', 'key'],
                'clx_shared_pref_type_id_key_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clx_shared_preferences', function (Blueprint $table) {
            $table->dropUnique('clx_shared_pref_type_id_key_unique');
        });
    }
};
