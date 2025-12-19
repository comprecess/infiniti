<?php


namespace App\Models\Traits;


use App\Models\PersonalModel;
use App\Models\Resident\Project\Task;
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

    public function scopeJoinPersonalTable($query)
    {
        $query->join('personal_model', function($join){
            $join->on('personal_model.model_id', '=', 'sys_tasks.id')
                ->where('personal_model.model_type', self::class);
        });
    }

    public function scopeJoinPersonal($query, User $user)
    {
        $query->join('personal_model', function($join){
            $join->on('personal_model.model_id', '=', 'sys_tasks.id')
                ->where('personal_model.model_type', self::class);
        })
            ->where(function($q) use($user){
                $q->where('personal_model.user_type', $user::class)
                    ->where('personal_model.user_id', $user->id);
            });
    }

    public function getPersonaleSerilize()
    {
        $data = [];
        foreach($this->personals as $personal) {
            $user = $personal->user;
            $data[] = ['type' => $user->getNameClass(), 'id' => $user->id];
        }

        return $data;
    }

    public static function findByUser(User $user, $getQuery = false)
    {
        $query = self::query();
        $query->select("{$query->from}.*")
            ->join('personal_model', function($join) use($query){
            $join->on('personal_model.model_id', '=', "{$query->from}.id")
                ->where('personal_model.model_type', self::class);
        })->where(function($query) use($user){
                $query->where('personal_model.user_type', $user::class)
                    ->where('personal_model.user_id', $user->id);
        });

        return $getQuery ? $query : $query->get();
    }
}
