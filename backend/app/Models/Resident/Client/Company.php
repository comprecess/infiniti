<?php

namespace App\Models\Resident\Client;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\FileStorageTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory, FileStorageTrait;

    protected $table = "sys_companies";

    public function users()
    {
        return $this->hasMany(Client::class, 'cid');
    }
}
