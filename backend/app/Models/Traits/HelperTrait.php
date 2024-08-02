<?php


namespace App\Models\Traits;


use Illuminate\Support\Facades\DB;

trait HelperTrait
{
    public static function getNextCode($name, $limit = 5)
    {
        $table = (new self())->getTable();
        $query = DB::select("SHOW TABLE STATUS LIKE '{$table}'");
        $nextID = $query[0]->Auto_increment;
        $sep = '%0'.$limit.'d';
        return mb_strtoupper($name) . '-' . sprintf($sep, $nextID);
    }
}
