<?php


namespace App\Http\Requests\Interfaces;


use Illuminate\Database\Eloquent\Model;

interface SortModelInterface
{
    public function sort() :array;
    public function sortModel(Model $model);

}
