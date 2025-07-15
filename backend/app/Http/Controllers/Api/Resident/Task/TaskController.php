<?php


namespace App\Http\Controllers\Api\Resident\Task;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Http\Requests\Resident\Task\TaskUpdateStatusRequest;
use App\Models\Resident\Project\Task;
use App\Models\User;

class TaskController extends TaskAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function createOrUpdate(Task $task, TaskCreateRequest $request)
    {
        $this->isPut = true;
        if(!$task->id) {
            $task = Task::newDefault();
        }
        return $this->createOrUpdateCRUD($request, $task, function($model, $request){
            $date = now();
            $admin = User::getAuth();
            $model->pid = $model->pid?->id ?? $model->pid;
            $model->aid = $admin->id;
            $model->started = $request->startDate ?? $date->format('Y-m-d');
            $model->due_date = $request->dueDate ?? null;
        });
    }

    public function delete(Task $task)
    {
        return $this->deleteCRUD($task);
    }

    public function updateStatus(Task $task, TaskUpdateStatusRequest $request)
    {
        $task->status = $request->status;
        $task->position = $request->position;
        $task->save();

        return $this->defResponse();
    }
}
