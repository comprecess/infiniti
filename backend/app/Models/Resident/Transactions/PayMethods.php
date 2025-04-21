<?php

namespace App\Models\Resident\Transactions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayMethods extends Model
{
    use HasFactory;

    protected $table = "sys_pmethods";

}
