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
        return $this->createOrUpdateCRUD($request, $task, function($model, $request, $isNew){
            if($isNew) {
                $admin = User::getAuth();
                $model->aid = $admin->id;
            }
            $date = now();
            $model->pid = $model->pid?->id ?? $model->pid;
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
        $tasks = Task::where('status',$request->status)
            ->sort()
            ->get();

        $positionNew = 0;
        foreach($tasks as $position => $taskEach) {
            $position += $positionNew;
            if($position == $request->position) {
                $task->position = $position;
                $position++;
                $positionNew++;
            }
            $taskEach->position = $position;
            $taskEach->save();
        }

        $task->status = $request->status;
//        $task->position = $request->position;
        $task->save();

        return $this->defResponse();
    }
}
