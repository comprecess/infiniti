<?php
namespace App\Http\Controllers\Api\Resident\Project\Traits;

use App\Http\Resources\Log\UserResource;

trait PersonalTrait
{
    public function getLogMessage($diff, $request = null) :string
    {
        $message = '';
        foreach($diff as $name => $value) {

            if($name == 'ext' || $value->count() == 0) {
                continue;
            }

            $personall = collect(UserResource::collection($value)->toArray($request))->map(function($item){
                return "(".$item['userType'] .") ".$item['account'] . " [ID:".$item['id']."]";
            })->implode('; ');

            $message .= " ".  __("project_log.personal.{$name}", ['staff' => $personall]);
        }

        return $message;
    }
}
