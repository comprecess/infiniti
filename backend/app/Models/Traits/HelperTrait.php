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

    public function setRandomNum($nameColumn, $col = 6)
    {
        $this->{$nameColumn} = substr(str_shuffle(str_repeat('0123456789', $col)), 0, $col);
    }
}
