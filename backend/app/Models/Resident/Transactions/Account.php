<?php

namespace App\Models\Resident\Transactions;

use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory, UserTrait, CurrencyTrait;

    protected $table = "sys_accounts";

    protected $adminColumn = 'owner_id';

}
