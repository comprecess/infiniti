<?php


namespace App\Models\Contracts;


use Illuminate\Database\Eloquent\Collection;

interface ModelServiceInterface
{
    public function getServiceResources();

    public function getServiceData() :?Collection;

    public function getPrice() :float|int;

    public function getDescription();
}
