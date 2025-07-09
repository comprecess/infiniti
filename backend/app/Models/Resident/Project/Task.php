<?php

namespace App\Models\Resident\Project;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use App\Support\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Task extends Model implements InsertDefaultValueInterface
{
    use HasFactory, UserTrait, InsertDefaultValueTrait, SoftDeletes;

    const STATUS = ['Not Started', 'In Progress', 'Completed', 'Deferred', 'Waiting', 'Archived'];
    const STATUS_COMPLETED = [self::STATUS[2], self::STATUS[5]];

    protected $table = 'sys_tasks';

    protected $adminColumn = 'aid';

    protected $casts = [
        'started' => 'date',
        'due_date' => 'date',
        'date_finished' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'pid');
    }
/*
    public function Ticket()
    {
        return $this->belongsTo(Ticket::class, 'tid');
    }
*/

    public function getDefault(): array
    {
        return [
            'aid' => [User::getAuth()->id],
            'status' => [self::STATUS[0]],
            'due_date' => [now()]
        ];
    }

    public static function getStatusColumn() :Collection
    {
        return Cache::remember('task.status_column', config('cache.time.1year'), function(){
            return collect(config('data.task_columns'));
        });
    }

    public function statusColumn()
    {
        $status = self::getStatusColumn();
        return $status->where('title', $this->status)->first();
    }



}
