<?php


namespace App\Services\Zoom\Requests;


use Illuminate\Support\Arr;

abstract class Data
{
    private $data = [];

    public function __construct()
    {
        $this->setDefault();
    }

    public function __set(string $name, $value): void
    {
        if(in_array($name, $this->getListTag())) {
            $this->data[$name] = $value;
        }else{
            throw new \Exception("Property \"{$name}\" not found");
        }
    }

    public function pushArr($name, $value)
    {
        Arr::set($this->data, $name, $value);
        return $this;
    }

    public function __get(string $name)
    {
        return isset($this->data[$name]) ? $this->data[$name] : null;
    }

    protected function getListTag() :array
    {
        return [];
    }

    protected function default() :array
    {
        return [];
    }

    public function toJson()
    {
        return json_encode($this->data);
    }

    public function toArray()
    {
        return $this->data;
    }

    protected function setDefault()
    {
        $this->data = array_merge($this->default(), $this->data);
    }

}
