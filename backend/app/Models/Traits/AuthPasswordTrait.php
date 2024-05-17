<?php


namespace App\Models\Traits;


trait AuthPasswordTrait
{
    public function checkPassword($password)
    {
//        dd(crypt($password, $this->password), $this->password);
        return crypt($password, $this->password) == $this->password;
    }

    public function setNewPassword($password)
    {
        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }
}
