<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use App\Http\Controllers\Api\Resident\Project\CalendarController;
use App\Http\Controllers\Api\Resident\Sale\InvoiceController;
use App\Http\Controllers\Api\Resident\Transactions\TransactionsController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceListRequest;
use App\Http\Requests\Resident\Project\View\FilesListRequest;
use App\Http\Requests\Resident\Transactions\TransactionsListRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\DocumentResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Http\Resources\Resident\Project\View\LogResource;
use App\Http\Resources\Resident\Project\View\TaskGanttChartResource;
use App\Http\Resources\Resident\Project\View\TaskResource;
use App\Http\Resources\Resident\Project\View\TaskTimeResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Http\Resources\UserResource;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Users\Client;
use App\Services\TaskRecommendationService;
use Illuminate\Support\Arr;

class Get extends View
{
    use CRUD;

    public function view()
    {
        return new ProjectListResource($this->model);
    }

    private function getTask($id)
    {
        return $id ? $this->model->tasks()->where('id', $id)->firstOrFail() : null;
    }

    public function tasks()
    {
        $id = $this->urlToMethodInt();
        $tasqQuery = $tasks = $this->model->tasks()
            ->with(['admin.files', 'admin.myRole', 'client.companyClient', 'client.files', 'personals', 'personals.user', 'personals.user.files']);

        if(!is_int($id) && $id) {
            return $id;
        }elseif(is_int($id) && $id){
            return new TaskResource($tasqQuery->where('id', $id)->firstOrFail());
        }

        $tasks = $tasqQuery->sort()->get();
        $group = $tasks->groupBy('status');

        $taskColumns = Task::getStatusColumn()->sortBy('sort');
        $data = [];

        foreach($taskColumns as $column) {
            $data[$column['title']] =  TaskResource::collection($group->get($column['title']) ?? []);
        }
        return ['data' => $data];
//        return TaskResource::collection($tasks);

    }

    public function tasksInputData()
    {
//        $client = Client::with(['files', 'companyClient', 'group'])->get();

        return response()->json([
//            'client' => ClientResource::collection($client),
            'users' => UserResource::collection($this->getProjectUser()),
            'status' => Task::getStatusColumn()
        ]);
    }

    public function tasksTimes($integer)
    {
        $task = $this->getTask(Arr::get($integer, 0));
        $times = $task->times()->with(['user', 'user.files'])->where('project_id', $this->model->id)->get();

        return TaskTimeResource::collection($times);
    }

    public function tasksLogs($integer)
    {
        $task = $this->getTask(Arr::get($integer, 0));
        $queryLog = $task->log()->orderBy('id', 'desc')->with(['user', 'user.files']);

        return $this->index($queryLog, LogResource::class, true);
    }

    public function files()
    {
        $request = app(FilesListRequest::class);
        $query = $this->model->documents()->filesExists();

        $request->searchModel($query);
        $request->sortModel($query);

        return $this->index($query, DocumentResource::class, true);

    }

    public function expenses()
    {
        if($result = $this->urlToMethod()) {
            return $result;
        }

        $request = app(TransactionsListRequest::class);
        $query = $this->model->transactions();
        $request->filter($query);

        return $this->index($query, TransactionsListResource::class, true);
    }

    public function expensesInputData()
    {
        return redirect()->action(
            [TransactionsController::class, 'inputData'],
            ['type' => Transaction::TYPE[1]]
        );
    }

    public function invoices()
    {
        if($result = $this->urlToMethod()) {
            return $result;
        }

        $request = app(InvoiceListRequest::class);
        $query = $this->model->invoices();

        $request->filter($query);
        return $this->index($query, InvoiceListResource::class, true);
    }

    public function invoicesInputData()
    {
        return redirect()->action(
            [InvoiceController::class, 'inputData']
        );
    }

    public function timelog()
    {
        return redirect()->action(
            [CalendarController::class, 'list'],
            $this->request->all()
        );
    }

    public function analytics()
    {
        $now = now();
        $day7Complate = [];
        $statusCount = [];
        for($i=0; $i < 7; $i++) {
            $date = $now->copy();
            $date->subDays($i);
            $date = $date->format('Y-m-d');

            $tasks = $this->model
                ->tasks()
                ->whereIn('status', Task::STATUS_COMPLETED)
                ->where('date_finished', $date)
                ->count();

            $day7Complate[$date] = $tasks;
        }

        $tasks = $this->model->tasks;
        foreach(Task::STATUS as $status) {
            $statusCount[$status] = $tasks->where('status', $status)->count();
        }

        return response()->json([
            'lastCompleted' => $day7Complate,
            'statusCount' => $statusCount
        ]);
    }

    public function ganttChart()
    {
        $tasks = $this->model->tasks()
            ->with(['project'])
            ->sort();

        return $this->index($tasks, TaskGanttChartResource::class);
    }

    public function logs()
    {
        $queryLog = $this->model->log()->orderBy('id', 'desc')->with(['user', 'user.files']);
        return $this->index($queryLog, LogResource::class, true);
    }

    public function aiRecommend()
    {
        $title = request()->get('title', '');
        $description = request()->get('description', '');

        if (empty($title)) {
            return response()->json(['recommendations' => []], 200);
        }

        $service = new TaskRecommendationService();
        $recommendations = $service->recommend($this->model, $title, $description);

        return response()->json(['recommendations' => $recommendations]);
    }

    public function aiFinancials()
    {
        $service = new \App\Services\ProjectFinancialService();
        $result = $service->calculate($this->model);

        return response()->json(['financials' => $result]);
    }
}