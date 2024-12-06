<?php


namespace App\Services\Currency\Contract;


use Carbon\Carbon;

interface CurrencyServiceContract
{
    public function setDto(DtoClientContract $dto) :CurrencyServiceContract;
    public function setDate(?Carbon $date = null) :CurrencyServiceContract;
    public function currentRate() :DtoClientContract;
}
