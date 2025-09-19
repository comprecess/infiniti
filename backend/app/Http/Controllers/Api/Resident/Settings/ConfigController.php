<?php


namespace App\Http\Controllers\Api\Resident\Settings;

use App\Models\Config;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ConfigController extends SettingsController
{
    const LIST = [
        'networth-goal' => ['networth_goal', 'integer']
    ];

    public function setConfig(Request $request, $name)
    {

        $user = User::getAuth();
        if(!$user->isFullAdmin()){
            abort(403);
        }

        $data = self::LIST[$name];
        $value = $request->value;

        if($value === null) {
            throw ValidationException::withMessages(['value' => "The \"value\" field is not set"]);
        }

        if(is_array($data)) {
            switch ($data[1]) {
                case 'integer':
                    $value = intval($value);
                    break;
            }

            Config::set($data[0], $value);
        }else{
            Config::set($data, $value);
        }

        return response()->json(['success' => true]);
    }
}
