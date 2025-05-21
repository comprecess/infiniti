<?php


namespace App\Http\Resources\Collection;

use App\Http\Resources\Contracts\CRUDCollectionContract;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection as ResourceCollectionJson;


abstract class ResourceCollection extends ResourceCollectionJson implements CRUDCollectionContract
{
    private $myData = null;

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection
        ];
    }

    public function setData(array $data) :void
    {
        $this->myData = $data;
    }

    public function getData() :array
    {
        return $this->myData;
    }

}
