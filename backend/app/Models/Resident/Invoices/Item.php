<?php

namespace App\Models\Resident\Invoices;


use App\Http\Resources\Resident\Invoices\Service\ItemResource;
use App\Models\Contracts\ModelServiceInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Item extends Model implements ModelServiceInterface
{
    use HasFactory, InsertDefaultValueTrait;

    protected $table = "sys_items";

    public function getServiceResources()
    {
        return ItemResource::class;
    }
}
