<?php


namespace App\Models\Traits;


use App\Models\PersonalModel;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Support\Collection;
use Illuminate\Database\Eloquent\Collection as CollectionModel;
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

    public function setPersonal(Collection|CollectionModel|User $users, array $data = null)
    {
        if($users instanceof User){
            $users = collect([$users]);
        }

        foreach($users as $user) {
            if(!($user instanceof User)) {
                continue;
            }
            $personal = new PersonalModel();
            $personal->setUser($user);
            $personal->setModel($this);

            if($data) {
                $personal->data = $data;
            }

            try {
                $personal->save();
            }catch (UniqueConstraintViolationException $e){
                continue;
            }

        }

        return $this;
    }
}
