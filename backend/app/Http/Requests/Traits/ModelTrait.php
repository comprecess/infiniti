<?php


namespace App\Http\Requests\Traits;


use App\Http\Requests\Interfaces\ModelInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

trait ModelTrait
{
    protected $myRule = [];

    public function setRule(array &$rule) {
        $this->myRule =& $rule;
        return $this;
    }

    public function getRule()
    {
        return $this->myRule;
    }

    public function applyModel($nameColumn, $required = false, $nameTableColumn = 'id', callable $callable = null, callable $dopRule = null)
    {
        if(!($this instanceof ModelInterface)) {
            return false;
        }

        $listModel = $this->getListPropertiesModel();
        /**
         * @var Model $model
         */
        $model = new $listModel[$nameColumn]();
        $rules = Rule::exists($model->getTable(), $nameTableColumn ?? $nameColumn);

        if(is_callable($callable)) {
            $callable($rules);
        }

        $this->myRule[$nameColumn] = [
            'integer',
            $rules
        ];

        if($required) {
            $this->myRule[$nameColumn][] = 'required';
        }

        if(is_callable($dopRule)) {
            $data = $dopRule($this->myRule[$nameColumn]);
            if(is_array($data)) {
                $this->myRule[$nameColumn] = $data;
            }
        }

        return $this;

    }

    public function getModel($nameColumn, $abort = false) :?Model
    {
        $listModel = $this->getListPropertiesModel();
        $method = $abort ? 'findOrFail' : 'find';
        return $listModel[$nameColumn]::{$method}((int) $this->{$nameColumn});
    }
}
