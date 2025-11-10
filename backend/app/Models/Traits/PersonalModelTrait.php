<?php


namespace App\Models\Traits;


use App\Models\PersonalModel;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Support\Collection;
use Illuminate\Database\Eloquent\Collection as CollectionModel;
use Illuminate\Support\Collection as CollectionSupport;
use Illuminate\Database\UniqueConstraintViolationException;

trait PersonalModelTrait
{
    public function personals()
    {
        return $this->morphMany(PersonalModel::class, 'model')->with('user');
    }

    public function personalAdmins()
    {
        return $this->personals()->where('user_type', Admin::class);
    }

    public function personalClients()
    {
        return $this->personals()->where('user_type', Client::class);
    }

    public function setPersonal(Collection|CollectionModel|CollectionSupport|User $users, array $data = null)
    {
        if($users instanceof User){
            $users = collect([$users]);
        }

        $personals = $this->personals->where('user', '!=', null)->pluck('user');

        foreach($users as $user) {
            if(!($user instanceof User)) {
                continue;
            }

            $hasUser = $personals->where(function($item, $key) use($user, $personals){
                $has = $item::class == $user::class && $item->id == $user->id;
                if($has) {
                    $personals->forget($key);
                }

                return $has;
            })->first();

            if(!$hasUser) {
                $personal = new PersonalModel();
                $personal->setUser($user);
                $personal->setModel($this);

                if ($data) {
                    $personal->data = $data;
                }

                try {
                    $personal->save();
                } catch (UniqueConstraintViolationException $e) {
                    continue;
                }
            }

        }

        if($personals->count()){
            $this->dropPersonal($personals);;
        }

        return $this;
    }

    public function dropPersonal(Collection|CollectionModel|CollectionSupport|User $users)
    {

        $query = $this->personals();

        $query->where(function($q) use($users){

            foreach($users as $user) {
                if(!($user instanceof User)) {
                    continue;
                }
                $q->orWhere(function($q2) use($user){
                    $q2->where('user_type', $user::class)->where('user_id', $user->id);
                });
            }
        });

        $query->delete();
    }
}
