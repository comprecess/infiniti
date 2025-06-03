<?php

namespace App\Models\Resident\Project;

use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory, UserTrait, CurrencyTrait;

    const STATUS = ['Draft','Started','Completed'];

    const TYPE = ['Internal Project', 'Hourly Rate', 'Fixed Rate'];

    protected $table = 'clx_projects';

    protected $adminColumn = 'admin_id';

    protected $currencyColumnName = 'currency';

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'members' => 'array'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'pid');
    }

    public function getTaskCompleted()
    {
        $count = $this->tasks()->count();
        $completed = $this->tasks()->whereIn('status', Task::STATUS_COMPLETED)->count();
        $percent = 0;

        if($count) {
            $percent = (int) $completed / ($count / 100);
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


}
