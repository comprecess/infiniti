<?php

namespace App\Models\Resident\Project;

use App\Http\Requests\Traits\TimeZoneTrait;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\PersonalModelTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Task extends Model implements InsertDefaultValueInterface
{
    use HasFactory, UserTrait, InsertDefaultValueTrait, SoftDeletes, TimeZoneTrait, PersonalModelTrait;

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
    public function times()
    {
        return $this->hasMany(TaskTime::class, 'task_id');
    }

    public function log()
    {
        return $this->hasMany(ProjectLog::class, 'task_id');
    }

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

    public function scopeSort($query) :void
    {
        $query->orderBy('position')->orderBy('id');
    }

    public function ganttCharProgressDate() :int
    {
        $tz = $this->getTimeTimezone();
        $startTask = $this->started?->setTimezone($tz);
        $endTask = $this->due_date?->setTimezone($tz);
        $now = now()->setHour(0)->setMinute(0)->setSecond(0)->setMillisecond(0)->setTimezone($tz);

        if($startTask > $now) {
            return 0;
        }

        if(
            ($startTask <= $now && !$endTask)
            || ($startTask <= $now && $endTask < $now)
        ) {
            return 100;
        }

        $startDiff = $startTask->diff($now);
        $endDiff = $startTask->diff($endTask);
        $endDays = $endDiff->days + 1;
//        dd($startDiff, $endDiff, round(($startDiff->days * 100) / ($endDiff->days + 1)));
        return (int) round(($startDiff->days * 100) / $endDays);
    }



}
