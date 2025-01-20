<?php

namespace App\Models\BusinessModel;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatGPT extends Model
{
    use HasFactory;

    const TYPE = [
        'DetailedDescription',
        'MarketAnalysis',
        'FinancialModel',
        'CurrentInvestors',
        'StagesOfImplementation',
        'PartnershipOptions',
        ];

    protected $table = 'business_model_chat_gpt';
}
