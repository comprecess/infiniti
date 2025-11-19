<?php

namespace App\Models;

use App\Models\Collection\PersonalCollection;
use App\Models\Traits\CollectionTrait;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalModel extends Model
{
    use HasFactory, CollectionTrait;


    protected $table = 'personal_model';

    protected $casts = [
        'data' => 'json',
    ];

    protected $collection = PersonalCollection::class;


    public function model()
    {
        return $this->morphTo('model');
    }

    public function user()
    {
        return $this->morphTo('user');
    }

    public function personals()
    {
        return $this->morp();
    }

    public function setModel($model)
    {
        $this->model_type = $model::class;
        $this->model_id = $model->id;
    }

    public function setUser(Admin|Client $user)
    {
        $this->user_type = $user::class;
        $this->user_id = $user->id;
    }




}
