<?php


namespace App\Services\Currency;


use App\Models\Resident\Settings\Currency;
use App\Services\Currency\Contract\DtoClientContract;
use App\Services\Currency\Contract\DtoServiceContract;

class Dto implements DtoServiceContract, DtoClientContract
{
    private $base = null;
    private $list = [];
    private $rate = [];

    public function __construct()
    {
        $this->base = Currency::BASE;
    }

    public function set(string|array $cur) :void
    {
        if(is_string($cur)) {
            $cur = [$cur];
        }

        $this->list = array_unique(array_merge($this->list, $cur));
    }

    public function getRate() :array
    {
        return $this->rate;
    }

    public function setRate(array $curArray) :void
    {
        foreach($this->list as $cur)
        {
            $this->rate[$cur] = $curArray[$cur];
        }
    }

    public function getList() :array
    {
        return $this->list;
    }

    public function getBase() :string
    {
        return $this->base;
    }

}
