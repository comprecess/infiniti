<?php

namespace App\Models\Resident\Project;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\DocumentTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model implements InsertDefaultValueInterface
{
    use HasFactory, UserTrait, CurrencyTrait, InsertDefaultValueTrait, SoftDeletes, DocumentTrait;

    const STATUS = ['Draft','Started','Completed'];

    const TYPE = ['Internal Project', 'Hourly Rate', 'Fixed Rate'];

    protected $table = 'clx_projects';

    protected $adminColumn = 'admin_id';
    protected $clientColumn = 'contact_id';

    protected $currencyColumnName = 'currency';

    public $documentName = 'project';

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'members' => 'array'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'pid');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'project_id');
    }

    public function transactionExpense()
    {
        return $this->hasMany(Transaction::class, 'project_id')
            ->where('type', Transaction::TYPE[1]);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'pid');
    }

    public function manager()
    {
        return $this->belongsTo(Admin::class, 'project_manager_id');
    }

    public function getTaskCompleted()
    {
        $count = $this->tasks()->count();
        $completed = $this->tasks()->whereIn('status', Task::STATUS_COMPLETED)->count();
        $percent = 0;

        if($count) {
            $percent = (int) ($completed / ($count / 100));
        }
        return [
            'completed' => $completed,
            'total' => $count,
            'percent' => $percent
        ];
    }

    public function getMembers()
    {
        if(!$this->members) {
            return collect([]);
        }

        return Admin::whereIn('id', $this->members)->with(['files', 'myRole'])->get();
    }

    public function getDefault(): array
    {
        return [
            'admin_id' => [User::getAuth()->id],
        ];
    }


}
