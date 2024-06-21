<?php


namespace App\Services\Filter;


use App\Models\Catalog\User;
use App\Models\Catalog\Value;
use App\Services\FilterProp;

class Availability extends FilterProp implements FilterInterface
{
    protected $availability = [
        'Available now' => 0,
        'Available next week' => 2,
        'Available this month' => 3,
        'Not available' => 4
    ];

    public function before($value)
    {
        $timeAvailability = User::getDateAvailable();
        $values = Value::whereIn('id', $value)->get();
        foreach($values as $v) {
            if(isset($this->availability[$v->value])) {
                $type = $this->availability[$v->value];

                if($type == 0) {
                    $this->query->orWhereNull('catalog_user.availabilityEnd')
                        ->orWhere('catalog_user.availabilityEnd', '<', $timeAvailability[0]);
                } else if($type == 4) {
                    $this->query->orWhere('catalog_user.availabilityEnd', '>', $timeAvailability[3]);
                } else {
                    $this->query->orWhere('catalog_user.availabilityEnd', '<', $timeAvailability[$type]);
                }

            }
        }
    }

    public function after($result)
    {
        // TODO: Implement after() method.
    }
}
