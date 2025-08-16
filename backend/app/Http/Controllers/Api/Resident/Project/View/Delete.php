<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Models\Resident\Project\Calendar;
use Illuminate\Database\Eloquent\Model;

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
