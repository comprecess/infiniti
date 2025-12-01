<?php


namespace App\Models\Collection;

use Illuminate\Database\Eloquent\Collection;

class ProjectTaskTimeCollection extends Collection
{
    public function getHours()
    {
        $h = $m = 0;
        $this->each(function($item) use(&$h, &$m){
            list($hh,$mm) = explode(':', $item->time);
            $h += $hh;
            $m += $mm;
        });
        $h += ceil($m / 60);

        return (int) $h;
    }
}
