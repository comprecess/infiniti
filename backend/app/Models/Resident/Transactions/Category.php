<?php

namespace App\Models\Resident\Transactions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    const TYPE = ['Expense', 'Income'];

    protected $table = "sys_cats";

}
