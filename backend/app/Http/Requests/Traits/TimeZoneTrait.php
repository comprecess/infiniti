<?php


namespace App\Http\Requests\Traits;


use Carbon\Carbon;
use Illuminate\Support\Arr;

trait TimeZoneTrait
{
    public $timezoneFormat = 'Y-m-d H:i';
    private $step = 15;
    public $default = "+00:00";

    public function getTimeTimezone(string $name = null, string $formatRequest = null)
    {
        $format = $formatRequest ?? $this->timezoneFormat;

        if($name) {
            $data = $this->all();
            $date = Arr::get($data, $name);
        }else{
            $date = request()->header('Client-Date');
        }

        if($date) {
            $timeUser = Carbon::createFromFormat($format, $date);
            $interval = now()->diff($timeUser);

            if($interval->d) {
                return $this->default;
            }

            $h = $interval->h;
            $i = (int) $this->myRand($interval->i, $this->step);

            $ii = (int) ($i / 60);
            if($ii) {
                $h += $ii;
                $i = "00";
            }

            $tz = ($interval->invert && $h != 0 ? "-" : "+") . str_pad($h, 2, '0', STR_PAD_LEFT) .":" . $i;
        } else {
            $tz = $this->default;
            $interval = null;
        }

        return $tz;

    }

    private function myRand($count, $step){
        return $step*round($count/$step);
    }

    public function toTimeZoneClient(Carbon|string $date, ?string $format = null) :Carbon|string
    {
        if(is_string($date)) {
            #use resources
            $date = $this->{$date};
        }

        if(!($date instanceof Carbon)) {
            throw new \Exception("Date not found");
        }

        $date->setTimezone($this->getTimeTimezone());

        if($format) {
            return $date->format($format);
        }

        return $date;
    }

    #use request
    public function parseDate($name)
    {
        $date = Carbon::parse($this->{$name}, $this->getTimeTimezone());
        return $date->setTimezone($this->default);
    }

}
