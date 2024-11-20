<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    use HasFactory;

    const STATUS = ['Active','Inactive'];

    protected $table = 'sys_pg';

    public function scopeActive($query) :void
    {
        $query->where('status', self::STATUS[0]);
    }

}
