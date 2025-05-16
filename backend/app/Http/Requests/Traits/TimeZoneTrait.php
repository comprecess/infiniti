<?php


namespace App\Http\Requests\Traits;


use Carbon\Carbon;
use Illuminate\Support\Arr;

trait TimeZoneTrait
{
    public $timezoneFormat = 'Y-m-d H:i';
    private $step = 15;

    public function getTimeTimezone(string $name, string $formatRequest = null)
    {
        $format = $formatRequest ?? $this->timezoneFormat;
        $data = $this->all();
        $date = Arr::get($data, $name);

        if($date) {
            $timeUser = Carbon::createFromFormat($format, $date);
            $interval = now()->diff($timeUser);

            $h = $interval->h;
            $i = (int) $this->myRand($interval->i, $this->step);

            $ii = (int) ($i / 60);
            if($ii) {
                $h += $ii;
                $i = "00";
            }

            $tz = ($interval->invert && $h != 0 ? "-" : "+") . str_pad($h, 2, '0', STR_PAD_LEFT) .":" . $i;
        } else {
            $tz = "+00:00";
            $interval = null;
        }

        return $tz;

    }

    private function myRand($count, $step){
        return $step*round($count/$step);
        //return $step*floor($count/$step); //в меньшую сторону
        //return $step*ceil($count/$step); //в большую сторону
    }

}
