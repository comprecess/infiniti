<?php

namespace App\Models\Resident\Transactions;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model implements InsertDefaultValueInterface
{
    use HasFactory, UserTrait, CurrencyTrait, InsertDefaultValueTrait;

    public $adminColumn = 'employee_id';

    protected $casts = [
        'date_purchased' => 'date',
        'supported_until' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(AssetCategory::class, 'category_id');
    }

    public function getDefault(): array
    {
        return [
            'asset' => [''],
            'brand' => [''],
        ];
    }

}
