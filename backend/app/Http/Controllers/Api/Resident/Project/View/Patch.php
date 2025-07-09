<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Resident\Task\TaskController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Models\Resident\Project\Task;

class Patch extends View
{
    use CRUD;

    public function tasks()
    {
        dd('123');
    }

}
