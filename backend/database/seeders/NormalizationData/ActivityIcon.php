<?php
namespace Database\Seeders\NormalizationData;


use App\Models\Resident\Client\Activity;

class ActivityIcon
{
    protected $list = [
        'fal fa-envelope' => 'envelope',
        'fal fa-phone' => 'phone',
        'fal fa-paper-plane' => 'paperPlane',
        'fal fa-file-pdf' => 'pdf',
        'fal fa-life-ring' => 'lifeRing',
        'fal fa-credit-card' => 'creditCard',
        'fal fa-location-arrow' => 'locationArrow',
        'fal fa-reply' => 'reply',
        'fal fa-tasks' => 'task',
        'fal fa-truck' => 'truck',
        'fal fa-check' => 'check'
    ];

    protected $listData = null;

    public function has() :bool
    {
        $this->listData = Activity::whereIn('icon', array_keys($this->list))->get();
        return $this->listData->count() > 0;
    }

    public function update()
    {
        $this->listData->each(function($item){
            if($this->list[$item->icon]) {
                $item->icon = $this->list[$item->icon];
                $item->save();
            }
        });
    }

}
