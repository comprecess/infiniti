<?php


namespace App\Models\Users\Interfaces;


interface LoginIntarface
{
    public function login($username, $password);
    public function checkedPassword();
    public function failPassword();
}
