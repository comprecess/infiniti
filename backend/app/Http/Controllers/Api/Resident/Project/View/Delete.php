<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Models\Resident\Project\Calendar;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class Delete extends View
{
    use CRUD;

    private function getTask($id)
    {
        return $id ? $this->model->tasks()->where('id', $id)->firstOrFail() : null;
    }

    public function tasks()
    {
        $id = $this->urlToMethodInt();
        if(!is_int($id)) {
            return $id;
        }
        $task = $this->getTask($id);
        if($task) {
            return $this->delete($task);
        }

        return response()->json(['success' => false]);
    }

    public function tasksTimes($integer)
    {
        $task = $this->getTask(Arr::get($integer, 0));
        $time = $task->time()->where('id', Arr::get($integer, 1))->where('project_id', $this->model->id)->firstOrFail();
        return $this->delete($time);
    }

    public function timelog()
    {
        $calendar = Calendar::checkAccess('delete', 'calendar')->where('id', $this->request->route('id'))->first();
        return $this->deleteModel($calendar);
    }

    private function deleteModel(?Model $model = null)
    {
        if($model) {
            return $this->delete($model);
        }

        return response()->json(['success' => false]);
    }

    public function files()
    {
        $id = $this->urlToMethod(true);
        $result = $this->model->deleteDocument($id);
        return response()->json(['success' => $result]);
    }

}
