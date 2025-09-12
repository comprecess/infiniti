<?php


namespace App\Services\Document;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

class FactoryDocument
{

    public function __construct
    (
        protected Builder|Relation $builder,
        protected $resource,
        protected DocumentVariables $varibles
    )
    {}

    public function creator(string $document)
    {
        $document = ucfirst($document) . "Document";
        $class = __NAMESPACE__ . "\\{$document}";
        if(class_exists($class)) {
            $class = new $class($this->builder, $this->resource, $this->varibles);
            if($class instanceof Document && method_exists($class, 'generate')) {
                return $class->generate();
            }
        }

        return null;
    }

}
