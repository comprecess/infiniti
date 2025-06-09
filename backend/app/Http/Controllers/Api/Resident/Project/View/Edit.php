<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Resident\DocumentController;
use App\Http\Controllers\Api\Resident\Task\TaskController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\DocumentFileCreateRequest;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Models\Resident\Document;
use App\Models\Resident\Project\Task;

class Edit extends View
{
    use CRUD;

    public function files()
    {
        $document = new DocumentController();
        $request = app(DocumentFileCreateRequest::class);
        $request->setModel($this->model);
        return $document->createOrUpdate(new Document(), $request);
    }

    public function tasks()
    {
        $controller = new TaskController();
        $request = app(TaskCreateRequest::class);
        $request->setData(['pid' => $this->model->id]);
        return $controller->createOrUpdate(new Task(), $request);
    }

}
