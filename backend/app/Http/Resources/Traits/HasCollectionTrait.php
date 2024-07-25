<?php


namespace App\Http\Resources\Traits;


trait HasCollectionTrait
{
    public static $isCollection = false;

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }
}
