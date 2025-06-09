<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Project\View\FilesListRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\DocumentResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Http\Resources\Resident\Project\View\TaskResource;
use App\Models\Resident\Project\Task;
use App\Models\Users\Client;

class Get extends View
{
    use CRUD;

    public function view()
    {
        return new ProjectListResource($this->model);
    }

    public function tasks()
    {
        if($result = $this->urlToMethod()) {
            return $result;
        }
//        $tasks = $this->model->tasks->groupBy('status');
        $tasks = $this->model->tasks()->with(['admin.files', 'admin.myRole'])->get();
        return TaskResource::collection($tasks);

    }

    public function tasksInputData()
    {
        $client = Client::with(['files', 'companyClient', 'group'])->get();

        return response()->json([
            'client' => ClientResource::collection($client),
            'status' => Task::STATUS
        ]);
    }

    public function files()
    {
        $request = app(FilesListRequest::class);
        $query = $this->model->documents();

        $request->searchModel($query);
        $request->sortModel($query);

        return $this->index($query, DocumentResource::class, true);

    }

}
