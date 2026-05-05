<?php

namespace App\Http\Controllers\Api\Resident;

use App\Http\Controllers\Api\Resident\ResidentController;
use App\Services\HubSpotService;
use Illuminate\Http\Request;

class LeadsController extends ResidentController
{
    private HubSpotService $hubspot;

    public function __construct(HubSpotService $hubspot)
    {
        $this->hubspot = $hubspot;
    }

    public function list(Request $request)
    {
        try {
            $contacts = $this->hubspot->getAllContacts();
            $leads    = array_map([$this->hubspot, 'formatContact'], $contacts);

            // Client-side search fallback (also done on frontend, but keep for API usage)
            if ($search = $request->get('search')) {
                $s     = mb_strtolower($search);
                $leads = array_filter($leads, function ($lead) use ($s) {
                    return str_contains(mb_strtolower($lead['name']), $s)
                        || str_contains(mb_strtolower($lead['email']), $s)
                        || str_contains(mb_strtolower($lead['company']), $s)
                        || str_contains(mb_strtolower($lead['phone']), $s);
                });
                $leads = array_values($leads);
            }

            return response()->json([
                'status' => true,
                'data'   => ['data' => $leads],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'HubSpot error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:200',
            'last_name'  => 'nullable|string|max:200',
            'email'      => 'nullable|email|max:200',
            'phone'      => 'nullable|string|max:50',
            'company'    => 'nullable|string|max:200',
            'status'     => 'nullable|string|max:200',
            'source'     => 'nullable|string|max:200',
            'title'      => 'nullable|string|max:200',
            'website'    => 'nullable|string|max:200',
        ]);

        $properties = array_filter([
            'firstname'       => $data['first_name']  ?? null,
            'lastname'        => $data['last_name']   ?? null,
            'email'           => $data['email']       ?? null,
            'phone'           => $data['phone']       ?? null,
            'company'         => $data['company']     ?? null,
            'jobtitle'        => $data['title']       ?? null,
            'website'         => $data['website']     ?? null,
            'hs_lead_status'  => isset($data['status']) ? $this->hubspot->toHubSpotStatus($data['status']) : null,
            'lead_source'     => $data['source']      ?? null,
        ]);

        $result = $this->hubspot->createContact($properties);

        if (isset($result['id'])) {
            $this->hubspot->invalidateCache();
            return response()->json([
                'status' => true,
                'data'   => $this->hubspot->formatContact($result),
            ]);
        }

        return response()->json([
            'status'  => false,
            'message' => $result['message'] ?? 'Failed to create contact in HubSpot',
        ], 422);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'first_name' => 'sometimes|string|max:200',
            'last_name'  => 'nullable|string|max:200',
            'email'      => 'nullable|email|max:200',
            'phone'      => 'nullable|string|max:50',
            'company'    => 'nullable|string|max:200',
            'status'     => 'nullable|string|max:200',
            'source'     => 'nullable|string|max:200',
            'title'      => 'nullable|string|max:200',
            'website'    => 'nullable|string|max:200',
        ]);

        $properties = array_filter([
            'firstname'       => $data['first_name']  ?? null,
            'lastname'        => $data['last_name']   ?? null,
            'email'           => $data['email']       ?? null,
            'phone'           => $data['phone']       ?? null,
            'company'         => $data['company']     ?? null,
            'jobtitle'        => $data['title']       ?? null,
            'website'         => $data['website']     ?? null,
            'hs_lead_status'  => isset($data['status']) ? $this->hubspot->toHubSpotStatus($data['status']) : null,
            'lead_source'     => $data['source']      ?? null,
        ]);

        $result = $this->hubspot->updateContact($id, $properties);

        if (isset($result['id'])) {
            $this->hubspot->invalidateCache();
            return response()->json([
                'status' => true,
                'data'   => $this->hubspot->formatContact($result),
            ]);
        }

        return response()->json([
            'status'  => false,
            'message' => $result['message'] ?? 'Failed to update contact in HubSpot',
        ], 422);
    }

    public function destroy($id)
    {
        $success = $this->hubspot->deleteContact($id);

        if ($success) {
            $this->hubspot->invalidateCache();
        }

        return response()->json([
            'status'  => $success,
            'message' => $success ? 'Deleted' : 'Failed to delete contact in HubSpot',
        ]);
    }

    public function statuses()
    {
        $statuses = [
            ['name' => 'New'],
            ['name' => 'Open'],
            ['name' => 'In Progress'],
            ['name' => 'Open Deal'],
            ['name' => 'Unqualified'],
            ['name' => 'Attempted to Contact'],
            ['name' => 'Connected'],
            ['name' => 'Bad Timing'],
        ];

        return response()->json([
            'status' => true,
            'data'   => $statuses,
        ]);
    }
}
