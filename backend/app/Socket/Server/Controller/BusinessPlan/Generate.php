<?php
namespace App\Socket\Server\Controller\BusinessPlan;

use App\Socket\Server\Controller\Contract\Server;
use App\Socket\Server\Controller\Controller;

class Generate extends Controller implements Server
{
    public function getName() :string
    {
        return 'business-plan-list';
    }
}
