<?php


namespace App\Models\Traits;


use App\Models\Config;
use Illuminate\Support\Facades\DB;

trait HelperTrait
{
    public static function getNextCode($name, $limit = 5)
    {
        $table = (new self())->getTable();
//        $query = DB::select("SHOW TABLE STATUS LIKE '{$table}'");
//        $nextID = $query[0]->Auto_increment;
        $query = DB::select("SELECT `id` FROM `{$table}` ORDER BY `id` DESC LIMIT 1");
        $nextID =((int) $query[0]->id) + 1;
        $sep = '%0'.$limit.'d';
        return mb_strtoupper($name) . '-' . sprintf($sep, $nextID);
    }

    public static function getNextNum()
    {
        $table = (new self())->getTable();
//        $query = DB::select("SHOW TABLE STATUS LIKE '{$table}'");
//        $nextID = $query[0]->Auto_increment;
        $query = DB::select("SELECT `id` FROM `{$table}` ORDER BY `id` DESC LIMIT 1");
        $nextID =((int) $query[0]->id) + 1;
        return str_pad($nextID, Config::get('number_pad', 5), '0', STR_PAD_LEFT);
    }

    public function setRandomNum($nameColumn, $col = 6, $unicke = false, $onlyNum = false)
    {
        $random = $this->randomNum($col, $onlyNum);
        if($unicke) {
            $i = 0;
            while ($i < 1000) {
                if(self::where($nameColumn, $random)->count() == 0) {
                    break;
                }
                $random = $this->randomNum($col, $onlyNum, $i);
            }
        }
        $this->{$nameColumn} = $random;
    }

    public function randomNum($col = 6, $onlyNum = false, $i = 0)
    {
        if($onlyNum) {
            return substr(str_shuffle(str_repeat('0123456789', $col)), 0, $col);
        }
        return substr(md5(time() . rand(1, 1000) . $i),0, $col);
    }
}
