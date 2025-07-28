<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Client\GroupRequest;
use App\Http\Requests\Resident\Client\GroupSortRequest;
use App\Http\Resources\Resident\Client\GroupResource;
use App\Models\Resident\Client\Group;
use App\Models\Users\Client;

class GroupController extends MainClientController
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
        return $this->createOrUpdate($request, $group);
    }

    public function delete(Group $group)
    {
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

    public function deleteClient(Group $group, Client $client)
    {
        if($client->gid == $group->id) {
            $client->gid = null;
            $client->save();
            return response()->json(['success' => true]);
        }else{
            return response()->json(['success' => false]);
        }
    }
}
