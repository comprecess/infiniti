<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Models\User;
use Illuminate\Support\Arr;


class MainClientController extends ResidentController
{
    const TYPE_ACCESS = [
        'Customer' => 'customers', 'Supplier' => 'suppliers'
    ];

    public function viewAccess($type)
    {
        $type = Arr::get(self::TYPE_ACCESS, $type, 'customers');
        $admin = User::getAuth();
        if($admin->checkAccess(...['view', $type]) === 0) {
            abort(403);
        }
    }
}
