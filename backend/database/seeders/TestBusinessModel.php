<?php

namespace Database\Seeders;

use App\Models\BusinessModel\Prop;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestBusinessModel extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected $inserRandom = [
        'industries' => [1, 10],
        'technologies' => [1, 10],
        'price' => [100, 600],
        'location' => [1, 1],
        'age' => [2, 10],
        'profitability' => [1, 1]
    ];

    public function run(): void
    {
        DB::statement('DELETE FROM business_model;');
        DB::statement('ALTER TABLE business_model AUTO_INCREMENT = 1;');
        DB::statement('DELETE FROM business_model_value;');
        DB::statement('ALTER TABLE business_model_value AUTO_INCREMENT = 1;');

        $rand = rand(50, 100);
        for($i = 0; $i < $rand; $i++) {
            $businessModel = new \App\Models\BusinessModel\BusinessModel();
            $businessModel->start = now();
            $businessModel->description = fake()->text();
            $businessModel->full_description = fake()->text();
            $businessModel->save();


            foreach($this->inserRandom as $nameId => $value) {
                $prop = Prop::where('id_name', $nameId)->first();
                try {
                    $childrens = $prop->children;
                }catch (\Exception $e) {
                    dd($nameId, $e);
                }

                if($childrens->count()) {
                    $this->setProp($prop, $childrens, $value, $businessModel);
                } else {
                    $this->setValue($prop, $value, $businessModel);
                }
            }
        }

    }

    protected function setValue(Prop $prop, $deff, $userCatalog)
    {
        if(is_array($deff)) {
            $rand = rand($deff[0], $deff[1]);
        } else {
            $rand = fake()->word();
        }
        if(strpos($prop->type, 'checkbox') !== false) {
            $values = $prop->values->random($rand);
            foreach($values as $value) {
                $value->users()->attach($userCatalog);
            }
        } else if(in_array($prop->type, [Prop::TYPE[1], Prop::TYPE[3]])) {
            $value = $prop->values()->create(['value' => $rand]);
            $value->users()->attach($userCatalog);
        }

    }


    protected function setProp(Prop $prop, $childrens, $deff, $userCatalog)
    {
        $child = $childrens->random(1)->first();
        if(in_array($prop->type, [Prop::TYPE[0], Prop::TYPE[5]])) {
            $child->users()->attach($userCatalog);
        }
        $this->setValue($child, $deff, $userCatalog);
    }
}
