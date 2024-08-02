<?php

namespace App\Models\Resident\Client;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model implements InsertDefaultValueInterface
{
    use HasFactory, InsertDefaultValueTrait;

    protected $table = "crm_groups";

    protected $fillable = [
        'sorder',
    ];

    public function users()
    {
        return $this->hasMany(Client::class, 'gid');
    }

    public function getDefault(): array
    {
        return [
            'pid' => 0,
            'sorder' => 0
        ];
    }

    public static function getForSelect()
    {
        return self::orderBy('gname')->get();
    }
}
