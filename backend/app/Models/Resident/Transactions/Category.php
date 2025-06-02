<?php

namespace App\Models\Resident\Transactions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    const TYPE = ['Expense', 'Income'];

    protected $table = "sys_cats";

    public function scopeIncome($query) :void
    {
        $query->where('type', self::TYPE[1]);
    }

    public function transactionsName()
    {
        return $this->hasMany(Transaction::class, 'category', 'name')
            ->where('type', $this->type);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'cat_id');
    }

    public static function updateTotal()
    {
        self::chunk(20, function($items){
            $items->each(function($item){
                $item->total_amount = $item->transactions()->sum('amount');
                $item->save();
            });
        });
    }

}
