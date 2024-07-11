<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\Client\GroupRequest;
use App\Http\Requests\Resident\Client\GroupSortRequest;
use App\Http\Resources\Resident\Client\GroupResource;
use App\Models\Resident\Client\Group;

class GroupController extends Controller
{
    use CRUD {
        index as myIndex;
        delete as myDelete;
    }

    public function index()
    {
        return $this->myIndex(Group::orderBy('sorder'), GroupResource::class);
    }

    public function create(GroupRequest $request, Group $group)
    {
//        $group = $group->id ? $group : new Group();
//        $group->gname = $request->name;
//        $group->save();
//
//        return response()->json(['success' => true]);

        return $this->createOrUpdate($request, $group);
    }

    public function delete(Group $group)
    {
//        $group->delete();
//        return response()->json(['success' => true]);
        return $this->myDelete($group);
    }

    public function sort(GroupSortRequest $request)
    {
        foreach($request->groups as $sort => $groupId)
        {
            Group::find($groupId)->update(['sorder' => $sort + 1]);
        }

        return response()->json(['success' => true]);
    }
}
