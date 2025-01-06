<?php

namespace Database\Seeders;

use App\Models\BusinessModel\Prop;
use Illuminate\Support\Facades\DB;

class BusinessModel extends Catalog
{

    public function clear()
    {
        DB::statement('DELETE FROM business_model_prop;');
        DB::statement('ALTER TABLE business_model_prop AUTO_INCREMENT = 1;');
        DB::statement('DELETE FROM business_model_prop_value;');
        DB::statement('ALTER TABLE business_model_prop_value AUTO_INCREMENT = 1;');
    }

    public function setCatalog()
    {
        $type = Prop::TYPE;
        $skills = ['*nix', '.NET', '.NET 4.0', '.NET 4.5', '.NET 5', '.NET 5, 6', '.NET 6', '.NET 7', '.NET API', '.NET Core', '.NET Core 3', '.NET Core 5', '.NET Forge CMS', '.NET Framework', '.NET Framework 4.7', '.NET Framework 4.8', '.NET Framework core', '.NET MVC', '.Net Remoting', '.NET 6 (NET Core)', '1C: 8+', '1C: 7.7', '1C: 8.2', '1C: 8.3', '1C: Bit.Construction', '1C: Enterprise 8.3', '1C: BP 3.0', '1C: ZUP 2.5', '1C: ZUP 3.1', '1C: BP 2.0', '1C: BP 3.0', '1C: Accounting 2.0', '1C: Accounting 3.0', '1C: ZUP 2.5', '1C: ZUP 3.1', '1C: Integrated automation 2.4', '1C: Trade Management 10.3', 'ActionScript 2.0', 'ActionScript 3.0', 'AdminLTE 2+', 'ADO.NET', 'Akka.Net', 'Alpine.js', 'Angular 1.6', 'Angular 1.7', 'Angular 2+', 'Angular 6'];
        $prop = [
            ['name' => 'Industries', 'id_name' => 'industries', 'type' => 'checkbox', 'filter' => 1, 'sort' => 100, 'required' => 1, 'has_add' => 1],
            ['name' => 'Technologies', 'id_name' => 'technologies', 'type' => 'checkbox', 'filter' => 1, 'sort' => 200, 'required' => 1, 'has_add' => 1],
            ['name' => 'Investments', 'id_name' => 'investments', 'filter' => 1, 'sort' => 300, 'child' => [
                ['name' => 'Investments price', 'id_name' => 'price', 'type' => 'integer', 'filter' => 1, 'has_add' => 1, 'options' => '{"placeholder": {"from": 1, "to": 8000}}', 'sort' => 10, 'required' => 1],
            ]
            ],
            ['name' => 'Location', 'id_name' => 'location', 'type' => 'checkbox', 'filter' => 1, 'sort' => 400, 'required' => 1, 'has_add' => 1],
            ['name' => 'Age', 'id_name' => 'age', 'type' => 'integer',  'has_add' => '1', 'sort' => 900, 'filter' => 1, 'required' => 1, 'options' => '{"placeholder": {"from": 1, "to": 65}}'],
            ['name' => 'Category', 'id_name' => 'category', 'type' => $type[0], 'has_add' => 1],
            ['name' => 'Profitability', 'id_name' => 'profitability', 'type' => $type[0], 'filter' => 1, 'sort' => 1000],
        ];

        $value = [
            'industries' => ['AgroTech', 'AI &amp; Robotics', 'BioTech &amp; Pharmacy', 'Blockchain', 'Cloud Services', 'E-commerce', 'Digital Marketing &amp; Ads', 'EdTech', 'FinTech', 'FoodTech', 'GameDev', 'Government &amp; Public Sector', 'Hardware', 'Health care &amp; Sports', 'Horeca', 'HRTech', 'Information Security', 'Insurance', 'IoT', 'LifeStyle', 'Logistics &amp; Transport', 'Manufacturing', 'Media', 'Realty &amp; Constructoring', 'R&amp;D', 'Social Networking', 'Telecom', 'Travel', 'UrbanTech', 'VR/AR/XR'],
            'technologies' => $skills,
            'location' => ['US state kansas', 'RF Moscow City'],
            'profitability' => ['Average', 'High', 'Very high'],
        ];

        $this->setProp($prop, Prop::class);

        foreach($value as $key => $val) {
            $prop = Prop::where('id_name', $key)->first();
            if($prop) {
                foreach($val as $v) {
                    $prop->values()->create(['value' => $v]);
                }
            }
        }
    }
}
