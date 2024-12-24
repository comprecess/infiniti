<?php


namespace App\Contracts;


interface FilterBusinessModelContract
{
    public function properties(array $data, $query);
}
