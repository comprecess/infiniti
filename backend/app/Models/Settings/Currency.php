<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class Currency extends Model
{
    use HasFactory;

    protected $table = 'sys_currencies';

    public function getInfo()
    {
        return Arr::get(config('data.currency'), $this->iso_code, null);
    }
}
