<?php

namespace App\Listeners\Resident\Transaction;


use App\Events\Resident\Transactions\Delete;
use App\Models\Notification as NotificationModel;
use App\Models\Resident\Transactions\Category;
use App\Models\Resident\Transactions\Transaction;
use App\Services\Push\Contracts\PushContract;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CalculateCategory implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Delete $event): void
    {

        /** create category */
        foreach([Transaction::TYPE[0], Transaction::TYPE[1]] as $type) {
            $transaction = Transaction::selectRaw('distinct sys_transactions.category')
                ->leftJoin('sys_cats', 'sys_cats.name', '=','sys_transactions.category')
                ->whereNull('sys_cats.name')
                ->whereRaw("IF(sys_transactions.category > '',1,0) = 1")
                ->where('sys_transactions.type', $type)
                ->first();

            if($transaction) {
                $category = new Category();
                $category->type = $type;
                $category->name = $transaction->category;
                $category->save();

                Transaction::where('category', $transaction->category)->where('type', $type)->update(['cat_id' => $category->id]);
            }
        }

        /** set id */
        Transaction::whereRaw("IF(sys_transactions.category > '',1,0) = 1")
            ->where(function($query){
                $query->where('cat_id', 0)->orWhereNull('cat_id');
            })
            ->whereIn('type', Category::TYPE)
            ->each(function($item){
                $category = $item->categoryName;
                if($category) {
                    $item->cat_id = $category->id;
                    $item->save();
                }

            });

        Category::updateTotal();
    }
}
