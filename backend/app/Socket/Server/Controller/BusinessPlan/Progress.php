<?php
namespace App\Socket\Server\Controller\BusinessPlan;

use App\Socket\Server\Controller\Contract\Server;
use App\Socket\Server\Controller\Controller;

/**
 * WebSocket controller for business-plan-progress events.
 * Receives: { planId, percent, label }
 * Forwards the payload to the target user so the frontend
 * can update the progress bar on the CardPlanLoading card.
 */
class Progress extends Controller implements Server
{
    public function getName(): string
    {
        return 'business-plan-progress';
    }
}
