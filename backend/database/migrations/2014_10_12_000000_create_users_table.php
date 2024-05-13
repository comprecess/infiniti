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
        Schema::table('crm_accounts', function (Blueprint $table) {
            $table->rememberToken();
            $table->string('api_token', 70)->nullable();
        });

        Schema::table('sys_users', function (Blueprint $table) {
            $table->rememberToken();
            $table->string('api_token', 70)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crm_accounts', function (Blueprint $table) {
            $table->dropRememberToken();
            $table->dropColumn('api_token');
        });
        Schema::table('sys_users', function (Blueprint $table) {
            $table->dropRememberToken();
            $table->dropColumn('api_token');
        });

    }
};
