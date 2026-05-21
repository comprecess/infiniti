<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert all text columns of app_business_plan to utf8mb4
        // so GPT-generated content with emoji/special chars saves correctly
        DB::statement('ALTER TABLE app_business_plan
            MODIFY ex_summary  LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY description LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY m_analysis  LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY management  LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY product     LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY marketing   LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY budget      LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY investment  LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY finance     LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY appendix    LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        ');
    }

    public function down(): void
    {
        // Reversing to utf8mb3 would lose 4-byte chars — not worth doing
    }
};
