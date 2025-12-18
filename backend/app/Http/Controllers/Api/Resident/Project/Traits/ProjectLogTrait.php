<?php


namespace App\Http\Controllers\Api\Resident\Project\Traits;


use App\Http\Resources\Log\UserResource;
use App\Models\Resident\Project\ProjectLog;
use App\Models\Log;

trait ProjectLogTrait
{
    protected $oldModel = null;

    public function setOldModel($model)
    {
        $this->oldModel = clone $model;
        $this->oldModel->load('personals');
    }

    public function sendLog($model, $type = null, $dopDescription = null, $data = false)
    {
        $model->refresh();
        $data = null;
        if($this->oldModel?->id) {
            //edit
            $type = $type ?? ProjectLog::TYPE[1];
            $diff = [];
            $personal = $model->personals->filter(function($value){
                return (bool) $value->user;
            });

            if($personal->count()){
                $diff = $personal->diffUser($this->oldModel->personals->filter(function($value){
                    return (bool) $value->user;
                }));
                $dopDescription .= $this->getLogPersonal($diff);
            }
            $data = array_merge(Log::comparisonModelsMismatch($model, $this->oldModel), ['personal' =>collect($diff)->toArray()]);
        }else{
            //new
            $type = $type ?? ProjectLog::TYPE[0];

            if($data === false) {
                $data = null;
            }else {
                $personal = $model->personals?->getUser();
                $data = $data ?? ['class' => $model::class, 'data' => $model->toArray(), 'personal' => $personal?->toArray()];
                if($type == ProjectLog::TYPE[0]) {
                    $dopDescription .= $this->getLogPersonal(['new' => $personal]);
                }
            }
        }

        ProjectLog::create($model, $type, null, $data, null, $dopDescription);
    }

    public function getLogPersonal($diff) :string
    {
        $message = '';
        foreach($diff as $name => $value) {

            if($name == 'ext' || $value->count() == 0) {
                continue;
            }

            $personall = collect(UserResource::collection($value)->toArray(request()))->map(function($item){
                return "(".$item['userType'] .") ".$item['account'] . " [ID:".$item['id']."]";
            })->implode('; ');

            $message .= " ".  __("project_log.personal.{$name}", ['staff' => $personall]);
        }

        return $message;
    }
}
