<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Resident\DocumentController;
use App\Http\Controllers\Api\Resident\Project\CalendarController;
use App\Http\Controllers\Api\Resident\Sale\InvoiceController;
use App\Http\Controllers\Api\Resident\Task\TaskController;
use App\Http\Controllers\Api\Resident\Transactions\TransactionsController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Calendar\CalendarCreateRequest;
use App\Http\Requests\Resident\DocumentFileCreateRequest;
use App\Http\Requests\Resident\Invoices\InvoiceRequest;
use App\Http\Requests\Resident\Project\View\AddTimeRequest;
use App\Http\Requests\Resident\Project\View\GanttChartRequest;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Http\Requests\Resident\Task\TaskUpdateStatusRequest;
use App\Models\Resident\Document;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Project\Calendar;
use App\Models\Resident\Project\ProjectLog;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Project\TaskTime;
use App\Models\Resident\Transactions\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class Edit extends View
{
    use CRUD;

    public function files()
    {
        $document = new DocumentController();
        $request = app(DocumentFileCreateRequest::class);
        $request->setModel($this->model);
        $result = $document->createOrUpdate(new Document(), $request);
        if($document->file) {
            $data = $document->file->toArray();
            $dopDescription = __('project_log.project.fileName',['fileName' => $document->file->original_name, 'fileId' => $document->file->id]);
        }
        ProjectLog::create($this->model, ProjectLog::TYPE[4], null, $data, null, $dopDescription);
        return $result;
    }

    private function getTask($id)
    {
        return $id ? $this->model->tasks()->where('id', $id)->firstOrFail() : null;
    }

    public function tasks()
    {
        $id = $this->urlToMethodInt();
        if(!is_int($id) && $id) {
            return $id;
        }
        $task = $this->getTask($id);

        $controller = new TaskController();
        $method = strtolower($this->request->method());

        if(in_array($method, ['post', 'put', 'patch']) && !isset($this->path[1])) {
            $request = app(TaskCreateRequest::class);
            $request->setData(['pid' => $this->model->id]);
            return $controller->createOrUpdate($task ?? new Task(), $request);
        } elseif ($method == 'patch' && $this->path[1] == 'status') {
            $request = app(TaskUpdateStatusRequest::class);
            $request->merge(['pid' => $this->model->id]);
            return $controller->updateStatus($task, $request);
        }
    }

    public function tasksTimes($integer)
    {
        $method = $this->request->getMethod();
        $task = $this->getTask(Arr::get($integer, 0));
        $request = app(AddTimeRequest::class);
        $time = null;

        if(in_array($method, ['POST', 'PUT'])) {

            $time = new TaskTime();
            $time->setUser(User::getAuth());
            $time->project_id = $this->model->id;
            $time->task_id = $task->id;
        }elseif ($method == 'PATCH') {
            $time = $task->time()->where('id', Arr::get($integer, 1))->where('project_id', $this->model->id)->firstOrFail();
        }

        if($time !== null) {
            $time->setTime($request->getTime());
            $time->description = $request->description;
            $time->save();

            return response()->json(['success' => true, 'id' => $time->id]);
        }
    }

    public function tasksStatus($integer)
    {
        $controller = new TaskController();
        $task = $this->getTask(Arr::get($integer, 0));
        $request = app(TaskUpdateStatusRequest::class);
        $request->merge(['pid' => $this->model->id]);
        return $controller->updateStatus($task, $request);
    }

    public function expenses()
    {
        $controller = new TransactionsController();
        $this->request->merge(['type' => Transaction::TYPE[1], 'project' => $this->model->id]);
        return $controller->createOrUpdate(new Transaction());
    }

    public function invoices()
    {
        $controller = new InvoiceController();
        $this->request->merge(['project' => $this->model->id]);
        $request = app(InvoiceRequest::class);
        return $controller->createOrUpdate($request, new Invoice());
    }

    public function timelog()
    {
        $controller = new CalendarController();
        $request = app(CalendarCreateRequest::class);
        return $controller->createOrUpdate(new Calendar(), $request);
    }

    public function ganttChart()
    {
        $id = $this->urlToMethod(true);
        $task = $this->model->tasks()->where('id', $id)->firstOrFail();
        $request = app(GanttChartRequest::class);

        if($request->start) {
            $task->started = $request->start;
        }

        if($request->end) {
            $task->due_date = $request->end;
        }

        $task->save();

        return $this->defResponse();

    }

}
