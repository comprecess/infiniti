<?php


namespace App\Models\Collection;


use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserSettingsCollection extends Collection
{
    public function getUser()
    {
        return User::getAuth();
    }

    public function getListDefSettings()
    {
        $user = $this->getUser();

        $settings = [
            'push' => [(bool) $user?->pushSubscriptions()?->count(), 'bool']
        ];

        return $settings;
    }

    public function typeData($type, $data)
    {
        switch ($type){
            case 'bool':
                $data = filter_var($data, FILTER_VALIDATE_BOOLEAN);
            break;
            case 'int':
                $data = (int) $data;
            break;

        }

        return $data;
    }

    public function getSettings()
    {
        $settings = [];
        foreach($this->getListDefSettings() as $name => $default){
            $settings[$name] = $this->typeData($default[1], $this->where('name', $name)->first()?->value ?? $default[0]);
        }

        return $settings;
    }


}
