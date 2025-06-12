<?php


namespace App\Http\Controllers\Api\Resident\Project;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\Calendar\CalendarCreateRequest;
use App\Http\Requests\Calendar\CalendarListRequest;
use App\Http\Resources\Calendar\CalendarListResource;
use App\Models\Resident\Project\Calendar;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;

class CalendarController extends Controller
{
    const ACCESS = ['all', 'calendar'];

    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function list(CalendarListRequest $request)
    {
        $user = User::getAuth();
        if($user instanceof Client) {
            $query = $user->calendar();
        }else{
            $query = Calendar::checkAccess(...self::ACCESS);
        }

        $request->filter($query);

        return $this->index($query, CalendarListResource::class,(bool) $request->paginate);
    }

    public function createOrUpdate(Calendar $calendar, CalendarCreateRequest $request)
    {
        $this->isPut = true;

        return $this->createOrUpdateCRUD($request, $calendar, function($model, $request){
            $start = $request->getDate();
            $end = $request->getDate('end') ?? $start->copy();

            if($request->allDay) {
                $start->setHour(0)->setMinute(0)->setSecond(0);
                $end->setHour(23)->setMinute(59)->setSecond(59);
            }else{
                $start->setSecond(0);
                $end->setSecond(59);
            }

            if(($user = User::getAuth()) instanceof Admin) {
                $model->aid = $user->id;
            }else{
                $model->cid = $user->id;
            }

            $model->start = $start;
            $model->end = $end;
        });
    }

    public function delete(Calendar $calendar)
    {
        return $this->deleteCRUD($calendar);
    }

    public function item(Calendar $calendar)
    {
        return new CalendarListResource($calendar);
    }

}
