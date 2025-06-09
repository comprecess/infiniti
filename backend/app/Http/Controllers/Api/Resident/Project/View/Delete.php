<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Traits\CRUD;

class Delete extends View
{
    use CRUD;


    public function tasks()
    {
        $task = $this->model->tasks()->where('id', $this->request->route('id'))->first();
        if($task) {
            return $this->delete($task);
        }

        return response()->json(['success' => false]);
    }

}
