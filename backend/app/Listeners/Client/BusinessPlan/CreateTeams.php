<?php

namespace App\Listeners\Client\BusinessPlan;

use App\Events\Client\BusinessPlan\Generate;
use App\Models\Resident\BusinessPlan;
use App\Socket\Client as ClientSocket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class CreateTeams implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Generate $event): void
    {
        // Reload from DB — event carries a stale serialized snapshot
        $plan = BusinessPlan::find($event->businessPlan->id);

        if (!$plan) {
            Log::error('CreateTeams: plan not found (id=' . $event->businessPlan->id . ')');
            return;
        }

        // CreateTeams is a lightweight placeholder; actual team suggestion is done
        // on the frontend (autoSuggestTeam) after plan reaches Ready.
        // Do NOT set status=Ready here — GeneratePlan owns the status transition.
        // Only notify the client so the list refreshes if plan is already Ready/Error.
        Log::alert('***CreateTeams*** complete for plan #' . $plan->id . ', status=' . $plan->status_generate);

        // Only send list refresh if GeneratePlan has already finished (Ready or Error).
        // If still Processing/New, GeneratePlan will send its own refresh on completion.
        if (in_array($plan->status_generate, [BusinessPlan::STATUS_GENERATE[2], BusinessPlan::STATUS_GENERATE[3]])) {
            if ($user = $plan->client) {
                (new ClientSocket())->setUser($user)->setController('business-plan-list')->sendData();
            }
        }
    }
}
