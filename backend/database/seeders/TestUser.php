<?php

namespace Database\Seeders;

use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\Value;
use App\Models\Users\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestUser extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = Client::all()->random();

        $userCatalog = new User();
        $userCatalog->id_client = $user->id;
        $userCatalog->save();

        $values = Value::all()->random(20);
        foreach($values as $v) {
            $v->users()->sync($userCatalog);
        }

        $prop = Prop::where('id_name', 'russian')->first();
        $prop->users()->sync($userCatalog);

//        $value = Value::find(231);
//        dd($value->users);

    }
}
