<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Resident\Project\Traits\ProjectLogTrait;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Models\Resident\Project\Calendar;
use App\Models\Resident\Project\ProjectLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class Delete extends View
{
    use CRUD, ProjectLogTrait;

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
            $this->sendLog($task, ProjectLog::TYPE[2]);
            return $this->delete($task);
        }
        ProjectLog::create($task, ProjectLog::TYPE[2]);
        return response()->json(['success' => false]);
    }

    public function tasksTimes($integer)
    {
        $task = $this->getTask(Arr::get($integer, 0));
        $time = $task->times()->where('id', Arr::get($integer, 1))->where('project_id', $this->model->id)->firstOrFail();
        ProjectLog::create($task, ProjectLog::TYPE[10]);
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
        // Capture file details before deletion for audit log
        $document = \App\Models\Resident\Document::find($id);
        $fileName = $document ? $document->title : 'Unknown';
        $fileId = $document ? $document->id : $id;

        $result = $this->model->deleteDocument($id);

        $dopDescription = " File name: {$fileName}, ID: {$fileId};";
        ProjectLog::create($this->model, ProjectLog::TYPE[11], null, null, null, $dopDescription);
        return response()->json(['success' => $result]);
    }

}
