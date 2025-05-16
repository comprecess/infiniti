<?php

namespace App\Http\Controllers\Api;

use App\Contracts\MeetingContract as MeetingContractService;
use App\Events\Catalog\MeetingCreate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\EmploymentRequest;
use App\Http\Requests\MeetingRequest;
use App\Models\Meeting;
use App\Models\Resident\BusinessPlan;
use App\Models\User;
use App\Services\Zoom\Timezone;
use Illuminate\Http\Request;
use App\Models\Catalog\User as UserCatalog;
use \App\Models\Contracts\MeetingContract as MeetingContractModel;
use Illuminate\Validation\ValidationException;

class MeetingController extends Controller
{
    const MEET_TYPE = [
        'cart',
        'individual',
        'business-plan'
    ];

    private function getModel($request)
    {
        switch ($request->route('name')) {
            case 'cart':
                $model = User::getAuth()->myCart;
                break;
            case 'individual':
                $model = UserCatalog::find((int) $request->route('id'));
                break;
            case 'business-plan':
                $model = BusinessPlan::find((int) $request->route('id'));
                break;
        }

        if(!$model || !($model instanceof MeetingContractModel)) {
            abort(404);
        }

        return $model;

    }


    public function create(MeetingRequest $request)
    {
        $tz = new Timezone();
        $tz->searchTimezone($request->timezone['name'], $request->getTimeTimezone('timezone.date'));
        dd($request->timezone['name'], $request->getTimeTimezone('timezone.date'));
        $meetingModel = new Meeting();
        $model = $this->getModel($request);

        $users = $model->getUsersToMeeting();
        if(!$users) {
            throw ValidationException::withMessages(['talent' => "Talents not found"]);
        }

        foreach($model->getUsersToMeeting() as $email => $name) {
            if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw ValidationException::withMessages(['noEmail' => "Talent: \"{$name}\" no email"]);
            }
        }

        $meetingModel->setModel($model);
        $meetingModel->setUser();
        $meetingModel->timezone = $request->timezone['name'];
        $meetingModel->timezone_time = $request->getTimeTimezone('timezone.date');
        $meetingModel->date_timezone = $request->date;
        $meetingModel->date = $request->getDateArbitr();
        $meetingModel->save();

        event(new MeetingCreate($meetingModel));
//        $meetingService = app(MeetingContractService::class);
//        $meetingService->create($meetingModel);

        return response()->json(['success' => true]);
    }

    public function employment(EmploymentRequest $request)
    {
        $usersData = [];
        $model = $this->getModel($request);

        $users = $model->getUsersCatalog();
        foreach ($users as $user) {
            foreach($user->employmentNow()->orderBy('from', 'asc')->get() as $employment) {
                if($request->timezone) {
                    $usersData[$user->id][] = [
                        'from' => $employment->from->setTimezone($request->timezone)->format(MeetingRequest::FORMAT_DATE),
                        'to' => $employment->to->setTimezone($request->timezone)->format(MeetingRequest::FORMAT_DATE),
                    ];
                } else {
                    $usersData[$user->id][] = [
                        'from' => $employment->from->format(MeetingRequest::FORMAT_DATE),
                        'to' => $employment->to->format(MeetingRequest::FORMAT_DATE),
                    ];
                }
            }
        }

        return response()->json(['data' => $usersData]);
    }
}
