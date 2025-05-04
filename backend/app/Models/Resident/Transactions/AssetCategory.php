<?php

namespace App\Models\Resident\Transactions;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetCategory extends Model implements InsertDefaultValueInterface
{
    use HasFactory, InsertDefaultValueTrait;

    public $table = 'asset_categories';

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('name', 'asc');
    }

    public function childrenAll()
    {
        return $this->children()->with('children');
    }

    public static function getHead()
    {
        return self::where('parent_id', 0)
            ->where('is_active', 1)
            ->with('childrenAll')
            ->get();
    }


    public function getDefault(): array
    {
        return [
          'parent_id' => [0],
          'api_name' => [''],
          'plural' => [''],
          'slug' => [''],
          'prefix' => [''],
          'sl' => [''],
        ];
    }
}
