<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class HubSpotService
{
    private string $baseUrl = 'https://api.hubapi.com';
    private string $token;

    private array $contactProperties = [
        'firstname', 'lastname', 'email', 'phone',
        'company', 'jobtitle', 'website',
        'hs_lead_status', 'lead_source', 'createdate',
    ];


    // HubSpot internal values -> display labels
    private array $statusMap = [
        'NEW'                  => 'New',
        'OPEN'                 => 'Open',
        'IN_PROGRESS'          => 'In Progress',
        'OPEN_DEAL'            => 'Open Deal',
        'UNQUALIFIED'          => 'Unqualified',
        'ATTEMPTED_TO_CONTACT' => 'Attempted to Contact',
        'CONNECTED'            => 'Connected',
        'BAD_TIMING'           => 'Bad Timing',
    ];

    // Display labels -> HubSpot internal values
    private array $statusReverseMap = [
        'New'                   => 'NEW',
        'Open'                  => 'OPEN',
        'In Progress'           => 'IN_PROGRESS',
        'Open Deal'             => 'OPEN_DEAL',
        'Unqualified'           => 'UNQUALIFIED',
        'Attempted to Contact'  => 'ATTEMPTED_TO_CONTACT',
        'Connected'             => 'CONNECTED',
        'Bad Timing'            => 'BAD_TIMING',
    ];

    public function __construct()
    {
        $this->token = config('services.hubspot.token');
    }

    private function http()
    {
        return Http::withToken($this->token)
            ->acceptJson()
            ->timeout(15);
    }


    public function toHubSpotStatus(string $status): string
    {
        return $this->statusReverseMap[$status] ?? $status;
    }

    public function getContacts(int $limit = 100, ?string $after = null): array
    {
        $params = [
            'limit'      => $limit,
            'properties' => implode(',', $this->contactProperties),
            'sorts'      => json_encode([['propertyName' => 'createdate', 'direction' => 'DESCENDING']]),
        ];

        if ($after) {
            $params['after'] = $after;
        }

        $response = $this->http()->get("{$this->baseUrl}/crm/v3/objects/contacts", $params);

        return $response->json() ?? [];
    }

    public function getAllContacts(): array
    {
        $all   = [];
        $after = null;

        do {
            $data    = $this->getContacts(100, $after);
            $results = $data['results'] ?? [];
            $all     = array_merge($all, $results);
            $after   = $data['paging']['next']['after'] ?? null;
        } while ($after && count($all) < 2000);

        return $all;
    }

    public function createContact(array $properties): array
    {
        $response = $this->http()->post("{$this->baseUrl}/crm/v3/objects/contacts", [
            'properties' => $properties,
        ]);

        return $response->json() ?? [];
    }

    public function updateContact(string $id, array $properties): array
    {
        $response = $this->http()->patch("{$this->baseUrl}/crm/v3/objects/contacts/{$id}", [
            'properties' => $properties,
        ]);

        return $response->json() ?? [];
    }

    public function deleteContact(string $id): bool
    {
        $response = $this->http()->delete("{$this->baseUrl}/crm/v3/objects/contacts/{$id}");

        return $response->successful();
    }

    public function formatContact(array $contact): array
    {
        $p = $contact['properties'] ?? [];

        $firstName = $p['firstname'] ?? '';
        $lastName  = $p['lastname']  ?? '';

        return [
            'id'         => $contact['id'],
            'name'       => trim("{$firstName} {$lastName}"),
            'first_name' => $firstName,
            'last_name'  => $lastName,
            'email'      => $p['email']          ?? '',
            'phone'      => $p['phone']          ?? '',
            'company'    => $p['company']        ?? '',
            'title'      => $p['jobtitle']       ?? '',
            'website'    => $p['website']        ?? '',
            'status'     => $this->statusMap[$p['hs_lead_status'] ?? ''] ?? ($p['hs_lead_status'] ?? 'New'),
            'source'     => $p['lead_source']    ?? '',
            'created_at' => isset($p['createdate'])
                ? substr($p['createdate'], 0, 10)
                : null,
        ];
    }
}
