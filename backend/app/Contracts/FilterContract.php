<?php


namespace App\Contracts;


interface FilterContract
{
    public function properties(array $data, $query);
}
