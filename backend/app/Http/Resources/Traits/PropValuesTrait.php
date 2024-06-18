<?php


namespace App\Http\Resources\Traits;


use App\Models\Catalog\Prop;

trait PropValuesTrait
{
    private $propResorce = null;

    public function getPropVauesUser()
    {
        if(!$this->propResorce) {
            $this->propResorce = $this->getPropsByNameId();
        }

        return $this->propResorce ?? collect([]);
    }

    public function getPropValues($nameId, $type = 1)
    {
        $propValues = $this->getPropVauesUser()->where('id_name', $nameId)->first()?->values ?? collect([]);

        return match($type) {
            1 => $propValues->first()?->value,
            2 => $propValues->last()?->value,
            default => $propValues,
        };
    }
}
