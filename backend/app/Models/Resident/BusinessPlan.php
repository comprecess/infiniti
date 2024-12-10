<?php

namespace App\Models\Resident;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;

class BusinessPlan extends Model
{
    use HasFactory;

    public $table = 'app_business_plan';

    protected $casts = [
        'updated_at' => 'datetime',
        'date' => 'date',
    ];

}
