<?php

namespace Database\Seeders;

use Database\Seeders\NormalizationData\ActivityIcon;


class NormalizationData extends Normalization
{
    protected $activityIcon = null;

    protected function isHas()
    {
        $this->activityIcon = new ActivityIcon();

        $this->has->set('activityIcon', $this->activityIcon->has());
    }

    protected function create()
    {

    }

    protected function update()
    {
        $this->has->is('activityIcon', function(){
            $this->activityIcon->update();
        });
    }

    protected function delete()
    {

    }
}
