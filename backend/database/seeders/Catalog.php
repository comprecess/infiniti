<?php

namespace Database\Seeders;

use App\Models\Catalog\Prop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Catalog extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->clear();
        $this->setCatalog();
    }

    public function clear()
    {
        DB::statement('DELETE FROM catalog_prop;');
        DB::statement('ALTER TABLE catalog_prop AUTO_INCREMENT = 1;');
        DB::statement('DELETE FROM catalog_prop_value;');
        DB::statement('ALTER TABLE catalog_prop_value AUTO_INCREMENT = 1;');
    }

    public function setCatalog()
    {
        $type = Prop::TYPE;
        $skills = ['*nix', '.NET', '.NET 4.0', '.NET 4.5', '.NET 5', '.NET 5, 6', '.NET 6', '.NET 7', '.NET API', '.NET Core', '.NET Core 3', '.NET Core 5', '.NET Forge CMS', '.NET Framework', '.NET Framework 4.7', '.NET Framework 4.8', '.NET Framework core', '.NET MVC', '.Net Remoting', '.NET 6 (NET Core)', '1C: 8+', '1C: 7.7', '1C: 8.2', '1C: 8.3', '1C: Bit.Construction', '1C: Enterprise 8.3', '1C: BP 3.0', '1C: ZUP 2.5', '1C: ZUP 3.1', '1C: BP 2.0', '1C: BP 3.0', '1C: Accounting 2.0', '1C: Accounting 3.0', '1C: ZUP 2.5', '1C: ZUP 3.1', '1C: Integrated automation 2.4', '1C: Trade Management 10.3', 'ActionScript 2.0', 'ActionScript 3.0', 'AdminLTE 2+', 'ADO.NET', 'Akka.Net', 'Alpine.js', 'Angular 1.6', 'Angular 1.7', 'Angular 2+', 'Angular 6'];
        $prop = [
            ['name' => 'Industries', 'id_name' => 'industries', 'type' => 'checkbox', 'filter' => 1, 'sort' => 100, 'required' => 1, 'has_add' => 1],
            ['name' => 'Key skills', 'id_name' => 'key_skills', 'type' => 'checkbox', 'filter' => 1, 'sort' => 200, 'required' => 1, 'has_add' => 1],
            ['name' => 'Rate', 'id_name' => 'rate', 'filter' => 1, 'type' => $type[4], 'sort' => 300, 'child' => [
                ['name' => 'Hourly', 'id_name' => 'priceHour', 'type' => 'integer', 'filter' => 1, 'has_add' => 1, 'options' => '{"placeholder": {"from": 1, "to": 250}}', 'sort' => 10, 'required' => 1],
                ['name' => 'Daily (8h)', 'id_name' => 'priceDay', 'type' => 'integer', 'filter' => 1, 'has_add' => 1, 'options' => '{"placeholder": {"from": 1, "to": 1500}}', 'sort' => 20, 'required' => 1],
            ]
            ],
            ['name' => 'Availability', 'id_name' => 'availability', 'type' => 'checkbox', 'filter' => 1, 'sort' => 400],
            ['name' => 'Timezone', 'id_name' => 'timezone', 'type' => 'checkbox', 'filter' => 1, 'sort' => 500, 'required' => 1],
            ['name' => 'Experience', 'id_name' => 'experience', 'filter' => 1, 'sort' => 600, 'child' => [
                ['name' => 'Years', 'id_name' => 'years', 'type' => 'integer', 'filter' => 1, 'has_add' => 1, 'options' => '{"placeholder": {"from": 1, "to": 35}}'],
            ]],
            ['name' => 'Language', 'id_name' => 'language', 'filter' => 1, 'type' => $type[5], 'sort' => 700, 'required' => 1,  'child' => [
                ['name' => 'English', 'id_name' => 'english', 'type' => $type[5]],
                ['name' => 'German', 'id_name' => 'german', 'type' => $type[5]],
                ['name' => 'Spanish', 'id_name' => 'spanish', 'type' => $type[5]],
                ['name' => 'Russian', 'id_name' => 'russian', 'type' => $type[5]],
                ['name' => 'Arabic', 'id_name' => 'arabic', 'type' => $type[5]],
                ['name' => 'Chinese — Mandarin', 'id_name' => 'chinese_mandarin ', 'type' => $type[5]],
            ]],
            ['name' => 'Gender', 'id_name' => 'gender', 'type' => 'checkbox', 'sort' => 800, 'filter' => 1, 'required' => 1],
            ['name' => 'Age', 'id_name' => 'age', 'type' => 'integer',  'has_add' => '1', 'sort' => 900, 'filter' => 1, 'required' => 1, 'options' => '{"placeholder": {"from": 1, "to": 65}}'],
            /*---*/
            ['name' => 'Level', 'id_name' => 'lvl', 'type' => $type[0], 'required' => 1],
            ['name' => 'Specialization', 'id_name' => 'specialization', 'type' => $type[0]],
            ['name' => 'Education', 'id_name' => 'education',  'required' => 1,  'child' => [
                ['name' => 'Name', 'id_name' => 'education_name', 'type' => $type[3], 'has_add' => 1],
                ['name' => 'Specialization', 'id_name' => 'education_specialization', 'type' => $type[3], 'has_add' => 1],
                ['name' => 'Degree', 'id_name' => 'education_degree', 'type' => $type[3], 'has_add' => 1],
                ['name' => 'Graduation', 'id_name' => 'education_graduation', 'type' => $type[3], 'has_add' => 1],
            ]],
            ['name' => 'All skills', 'id_name' => 'all_skills', 'type' => $type[0], 'has_add' => 1],
            //['name' => 'Categories', 'id_name' => 'categories', 'type' => $type[0], 'has_add' => 1],
        ];

        $value = [
            'industries' => ['AgroTech', 'AI &amp; Robotics', 'BioTech &amp; Pharmacy', 'Blockchain', 'Cloud Services', 'E-commerce', 'Digital Marketing &amp; Ads', 'EdTech', 'FinTech', 'FoodTech', 'GameDev', 'Government &amp; Public Sector', 'Hardware', 'Health care &amp; Sports', 'Horeca', 'HRTech', 'Information Security', 'Insurance', 'IoT', 'LifeStyle', 'Logistics &amp; Transport', 'Manufacturing', 'Media', 'Realty &amp; Constructoring', 'R&amp;D', 'Social Networking', 'Telecom', 'Travel', 'UrbanTech', 'VR/AR/XR'],
            'key_skills' => $skills,
            'all_skills' => $skills,
            'availability' => ['Available now', 'Available next week', 'Available this month', 'Not available'],
            'timezone' => ['(GMT-12:00) IDLW', '(GMT-11:00) Midway Island', '(GMT-11:00) Samoa', '(GMT-10:00) Hawaii', '(GMT-09:00) Alaska', '(GMT-08:00) PT (US &amp; Canada)', '(GMT-08:00) PT (Tijuana)', '(GMT-07:00) MT (US &amp; Canada)', '(GMT-07:00) Chihuahua', '(GMT-07:00) La Paz', '(GMT-07:00) Mazatlan', '(GMT-07:00) Arizona', '(GMT-06:00) CT (US &amp; Canada)', '(GMT-06:00) Saskatchewan', '(GMT-06:00) Monterrey', '(GMT-06:00) Mexico City', '(GMT-06:00) Guadalajara', '(GMT-06:00) Central America', '(GMT-05:00) ET (US &amp; Canada)', '(GMT-05:00) Indiana (East)', '(GMT-05:00) Quito', '(GMT-05:00) Lima', '(GMT-05:00) Bogota', '(GMT-04:00) AT (Canada)', '(GMT-04:00) Caracas', '(GMT-04:00) La Paz', '(GMT-04:00) Santiago', '(GMT-03:30) NT (Newfoundland)', '(GMT-03:30) NL (Labrador)', '(GMT-03:00) Brasilia', '(GMT-03:00) Buenos Aires', '(GMT-03:00) Georgetown', '(GMT-03:00) Greenland', '(GMT-02:00) Mid-Atlantic', '(GMT-01:00) Azores', '(GMT-01:00) Cape Verde Islands', '(GMT) Dublin', '(GMT) Edinburgh', '(GMT) Lisbon', '(GMT) London', '(GMT) Monrovia', '(GMT) Casablanca', '(GMT+01:00) Belgrade', '(GMT+01:00) Bratislava', '(GMT+01:00) Budapest', '(GMT+01:00) Ljubljana', '(GMT+01:00) Prague', '(GMT+01:00) Sarajevo', '(GMT+01:00) Skopje', '(GMT+01:00) Warsaw', '(GMT+01:00) Zagreb', '(GMT+01:00) Brussels', '(GMT+01:00) Copenhagen', '(GMT+01:00) Madrid', '(GMT+01:00) Paris', '(GMT+01:00) Amsterdam', '(GMT+01:00) Berlin', '(GMT+01:00) Bern', '(GMT+01:00) Rome', '(GMT+01:00) Stockholm', '(GMT+01:00) Vienna', '(GMT+01:00) West Central Africa', '(GMT+02:00) Bucharest', '(GMT+02:00) Cairo', '(GMT+02:00) Helsinki', '(GMT+02:00) Kiev', '(GMT+02:00) Riga', '(GMT+02:00) Sofia', '(GMT+02:00) Tallinn', '(GMT+02:00) Vilnius', '(GMT+02:00) Minsk', '(GMT+02:00) Istanbul', '(GMT+02:00) Athens', '(GMT+02:00) Jerusalem', '(GMT+02:00) Harare', '(GMT+02:00) Pretoria', '(GMT+03:00) Moscow', '(GMT+03:00) St. Petersburg', '(GMT+03:00) Volgograd', '(GMT+03:00) Riyadh', '(GMT+03:00) Kuwait', '(GMT+03:00) Nairobi', '(GMT+03:00) Baghdad', '(GMT+03:30) Tehran', '(GMT+04:00) Muscat', '(GMT+04:00) Abu Dhabi', '(GMT+04:00) Yerevan', '(GMT+04:00) Tbilisi', '(GMT+04:00) Baku', '(GMT+04:30) Kabul', '(GMT+05:00) Ekaterinburg', '(GMT+05:00) Tashkent', '(GMT+05:00) Karachi', '(GMT+05:00) Islamabad', '(GMT+05:30) Chennai', '(GMT+05:30) Kolkata', '(GMT+05:30) Mumbai', '(GMT+05:30) New Delhi', '(GMT+05:45) Kathmandu', '(GMT+06:00) Dhaka', '(GMT+06:00) Astana', '(GMT+06:00) Sri Jayawardenepura', '(GMT+06:00) Novosibirsk', '(GMT+06:00) Almaty', '(GMT+06:30) Yangon Rangoon', '(GMT+07:00) Jakarta', '(GMT+07:00) Hanoi', '(GMT+07:00) Bangkok', '(GMT+07:00) Krasnoyarsk', '(GMT+08:00) Beijing', '(GMT+08:00) Chongqing', '(GMT+08:00) Hong Kong SAR', '(GMT+08:00) Urumqi', '(GMT+08:00) Singapore', '(GMT+08:00) Kuala Lumpur', '(GMT+08:00) Taipei', '(GMT+08:00) Perth', '(GMT+08:00) Ulaanbaatar', '(GMT+08:00) Irkutsk', '(GMT+09:00) Seoul', '(GMT+09:00) Tokyo', '(GMT+09:00) Sapporo', '(GMT+09:00) Osaka', '(GMT+09:00) Yakutsk', '(GMT+09:30) Darwin', '(GMT+09:30) Adelaide', '(GMT+10:00) Canberra', '(GMT+10:00) Melbourne', '(GMT+10:00) Sydney', '(GMT+10:00) Brisbane', '(GMT+10:00) Hobart', '(GMT+10:00) Vladivostok', '(GMT+10:00) Port Moresby', '(GMT+10:00) Guam', '(GMT+11:00) Magadan', '(GMT+11:00) Solomon Islands', '(GMT+11:00) New Caledonia', '(GMT+12:00) Marshall Islands', '(GMT+12:00) Kamchatka', '(GMT+12:00) Fiji Islands', '(GMT+12:00) Auckland', '(GMT+12:00) Wellington', '(GMT+13:00) Nuku\'alofa'],
            'gender' => ['Male', 'Female', 'Other'],
            'lvl' => ['Junior', 'Middle', 'Senior', 'Lead'],
            'rate' => ['Taxes included'],
            'specialization' => ['Web development', 'Business analysis', 'Human Resources', 'Blockchain development', '3D modeling', 'Product management', 'Legal consulting', 'Mobile development', 'CRM Integrations', 'Investor relations', 'Social media marketing', 'Competitor analysis', 'DevOps', 'Product design', 'System architecture', 'Copywriting']
        ];

        $parent = [
            'language' => ['Fluent/Native', 'C1/C2 — Advanced', 'B1/B2 — Intermediate', 'A1/A2 — Beginner']
        ];

        $this->setProp($prop);

        foreach($value as $key => $val) {
            $prop = Prop::where('id_name', $key)->first();
            if($prop) {
                foreach($val as $v) {
                    $prop->values()->create(['value' => $v]);
                }
            }
        }

        foreach($parent as $key => $val) {
            $prop = Prop::where('id_name', $key)->first();
            if($prop) {
                foreach ($prop->children as $child) {
                    foreach($val as $v) {
                        $child->values()->create(['value' => $v]);
                    }
                }
            }
        }
    }

    protected function setProp($data, $model = Prop::class, $parentId = null)
    {
        foreach($data as $key => $val)
        {
            $child = $val['child'] ?? null;
            $val['id_parent'] = $parentId;
            unset($val['child']);

            $prop = $model::create($val);

            if($child) {
                $this->setProp($child, $model, $prop->id);
            }

        }
    }
}
