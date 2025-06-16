<?php


namespace App\Http\Controllers\Api\Resident\Task;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Models\Resident\Project\Task;

class TaskController extends TaskAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function createOrUpdate(Task $task, TaskCreateRequest $request)
    {
        $this->isPut = true;
        if($task->id) {
            $task = Task::newDefault();
        }
        return $this->createOrUpdateCRUD($request, $task);
    }

    public function delete(Task $task)
    {
        return $this->deleteCRUD($task);
    }
}
