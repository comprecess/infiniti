<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Models\User;
use App\Models\Users\Client;
use Illuminate\Support\Arr;

class MainClientController extends ResidentController
{

    const TYPE_ACCESS = [
        Client::TYPE[0] => 'customers', Client::TYPE[1] => 'suppliers'
    ];

    public function clientAccess($type, $mod = 'view')
    {
        $type = Arr::get(self::TYPE_ACCESS, $type);
        if(!$type) {
            throw new \Exception("Type not found");
        }
        $admin = User::getAuth();
        if($admin->checkAccess($mod, $type) === 0) {
            abort(403);
        }
    }

    public static function getTypes($shortname = self::TYPE_ACCESS, string $mod = 'create')
    {
        $types = [];
        $accessTypeData = User::getAuth()->getListAccess($shortname, $mod, true, true);
        foreach(self::TYPE_ACCESS as $type => $access) {
            if(in_array($access, $accessTypeData)) {
                $types[] = $type;
            }
        }

        return $types;
    }

    public static function clientTypeToAccess(array $types, string $mod = 'create')
    {
        $typeAccess = self::TYPE_ACCESS;
        $newType = [];
        foreach($typeAccess as $type => $access) {
            if(in_array($type, $types)){
                $newType[$type] = $access;
            }
        }

        return self::getTypes($newType, $mod);
    }

}
