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
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Http\Requests\Resident\Task\TaskUpdateStatusRequest;
use App\Models\Resident\Document;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Project\Calendar;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Transactions\Transaction;
use Illuminate\Http\RedirectResponse;

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
        $id = $this->urlToMethod(true);
        $task = $id ? $this->model->tasks()->where('id', $id)->firstOrFail() : null;

        $controller = new TaskController();
        $method = strtolower($this->request->method());

        if(in_array($method, ['post', 'put', 'patch'])) {
            $request = app(TaskCreateRequest::class);
            $request->setData(['pid' => $this->model->id]);
            return $controller->createOrUpdate($task ?? new Task(), $request);
        } elseif ($method == 'patch' && $this->path[1] == 'status') {
            $request = app(TaskUpdateStatusRequest::class);
            return $controller->updateStatus($task, $request);
        }
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

}
