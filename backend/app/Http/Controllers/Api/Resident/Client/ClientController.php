<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ClientController extends ResidentController
{
    use CRUD;

    public function list(Request $request)
    {
        $pagination = true;
        $clients = Client::query()->with(['group', 'companyClient']);

        $requestAll = $request->all();
        if($group = Arr::get($requestAll, 'filter.group')) {
            $pagination = false;
            $clients->where('gid', $group);
        }

        return $this->index($clients, ClientResource::class, $pagination);
    }

}
