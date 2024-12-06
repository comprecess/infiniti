<?php


namespace App\Services\Currency;


use App\Services\Currency\Contract\CurrencyServiceContract;
use App\Services\Currency\Contract\DtoClientContract;
use App\Services\Currency\Contract\DtoServiceContract;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class CurrencyFreaks implements CurrencyServiceContract
{
    private $url = "https://api.currencyfreaks.com/";
    private $dto = null;
    private $date = null;

    public function setDto(DtoClientContract $dto) :CurrencyServiceContract
    {
        $this->dto = $dto;
        return $this;
    }

    public function setDate(?Carbon $date = null) :CurrencyServiceContract
    {
        $this->date = $date;
        return $this;
    }

    public function currentRate() :DtoClientContract
    {
        if(!($this->dto instanceof DtoServiceContract)) {
            throw new \Exception("is not a DtoServiceContract");
        }

        $listCur = $this->dto->getList();
        $key = env('CURRENCY_API_KEY', null);

        if(!$key) {
            throw new \Exception("Get the key in {$this->url} and set it to the parameter env[CURRENCY_API_KEY]");
        }

        $response = Http::get("{$this->url}v2.0/rates/latest", [
            'apikey' => $key,
            'base' => $this->dto->getBase(),
            'symbols' => implode(",", $listCur),
        ])->json();

        $rates = [];
        foreach(@$response['rates'] ?? [] as $cur => $rate) {
            if(in_array($cur, $listCur)) {
                $rates[$cur] = floatval($rate);
            }
        }

        $this->dto->setRate($rates);

        return $this->dto;
    }
}
