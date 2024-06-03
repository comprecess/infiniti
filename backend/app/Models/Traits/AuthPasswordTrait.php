<?php


namespace App\Models\Traits;


use Illuminate\Support\Facades\Log;

trait AuthPasswordTrait
{
    public function checkPassword($password)
    {
//        dd(crypt($password, $this->password), $this->password);
        Log::alert('CHECK PASSWORD', [$password, $this->password ,crypt($password, $this->password)]);
        return crypt($password, $this->password) == $this->password;
    }

    public function setNewPassword($password)
    {
        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }
}
