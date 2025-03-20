<?php

namespace App\Models\Resident;

use App\Models\Traits\CurrencyTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes, CurrencyTrait;

    public $table = 'clx_projects';

    protected $currencyColumnName = "currency";

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'estimate_finish_date' => 'date',
        'actual_finish_date' => 'date',
    ];
}
