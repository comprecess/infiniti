<?php

namespace App\Models;


use App\Models\Collection\UserSettingsCollection;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\UserDefTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
    use HasFactory, UserDefTrait, CollectionTrait;


    protected $table = 'user_settings';

    protected $casts = [
        'data' => 'json',
    ];

    protected $collection = UserSettingsCollection::class;

    protected $fillable = [
        'name',
        'value',
        'data',
        'user_type',
        'user_id'
    ];


}
