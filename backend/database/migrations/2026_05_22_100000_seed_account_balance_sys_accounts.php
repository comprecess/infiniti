<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the "Account Balance" platform account used for business plan
     * charge transactions. This account is queried by name in
     * BusinessPlanController so plan-generation expenses are booked there
     * instead of the first random account (Tbank).
     */
    public function up(): void
    {
        $exists = DB::table('sys_accounts')
            ->where('account', 'Account Balance')
            ->exists();

        if (!$exists) {
            DB::table('sys_accounts')->insert([
                'account'     => 'Account Balance',
                'description' => 'Platform account for client balance transactions (business plan charges)',
                'balance'     => 0.00,
                'currency'    => 'USD',
                'sorder'      => 0,          // sorder=0 → sorts before all others (Tbank has sorder=1)
                'status'      => 'Active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('sys_accounts')
            ->where('account', 'Account Balance')
            ->delete();
    }
};
