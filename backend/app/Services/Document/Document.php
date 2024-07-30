<?php


namespace App\Services\Document;


use Illuminate\Database\Eloquent\Builder;

class Document
{
    public function __construct(
        protected Builder $builder,
        protected $resorce,
        protected DocumentVariables $varibles
    )
    {

    }

    public function generate()
    {
        return null;
    }
}
