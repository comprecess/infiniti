<?php

namespace Database\Seeders;

use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\UserBlock;
use App\Models\Catalog\Value;
use App\Models\Users\Client;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Generator;

class TestUser extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('DELETE FROM catalog_user;');
        DB::statement('ALTER TABLE catalog_user AUTO_INCREMENT = 1;');
        DB::statement('DELETE FROM catalog_user_value;');
        DB::statement('ALTER TABLE catalog_user_value AUTO_INCREMENT = 1;');
        DB::statement('DELETE FROM catalog_user_block;');
        DB::statement('ALTER TABLE catalog_user_block AUTO_INCREMENT = 1;');

        $users = Client::all()->random(25);

        foreach($users as $user) {
            $userCatalog = new User();
            $userCatalog->id_client = $user->id;
            if(rand(1, 30) < 10) {
                $now = now();
                $now->addDay(rand(0, 100));
                $userCatalog->start = $now;
            }
            $userCatalog->save();

            $lvl = Prop::where('id_name', 'lvl')->first()->values;
            $values = Value::whereNotIn('id', $lvl->pluck('id'))->get()->random(20);
            foreach ($values as $v) {
                $v->users()->attach($userCatalog);
            }

            $isLevelProp = $userCatalog->values()
                ->join('catalog_prop', 'catalog_prop.id', '=', 'catalog_prop_value.id_prop')
                ->where('catalog_prop.id_name', 'lvl');

            if($isLevelProp->count() == 0 && rand(0 , 15) < 13) {
                $lvlRand = $lvl->random();
                $lvlRand->users()->attach($userCatalog);
            }


            $prop = Prop::where('id_name', 'russian')->first();
            $prop->users()->sync($userCatalog);

            #block
            $ex = rand(1, 4);
            for($i = 0 ; $i < $ex; $i++) {
                $y1 = rand(1, 40);
                $y2 = $y1 - rand(1, 5);

                $carb1 = Carbon::createFromDate(2024 - $y2, rand(1, 11), rand(1, 28));
                $carb2 = Carbon::createFromDate(2024 - $y1, rand(1, 11), rand(1, 28));

                $block = new UserBlock();
                $block->id_catalog_user = $userCatalog->id;
                $block->position = fake()->word();
                $block->to = $carb1;
                $block->from = $carb2;
                $block->responsibilities = fake()->text(rand(1,5) * 100);
                $block->save();
            }
        }

//        $value = Value::find(231);
//        dd($value->users);

    }
}
