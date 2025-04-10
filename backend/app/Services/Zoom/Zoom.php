<?php
//https://github.com/JubaerHossain/zoom-laravel/blob/master/src/Zoom.php
//https://github.com/aghilanbaskar/zoom-php/blob/main/src/ZoomLibrary/Zoom.php
//https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings


namespace App\Services\Zoom;


use App\Services\Zoom\Requests\Data;
use GuzzleHttp\Client;

class Zoom
{
    protected $client = null;
    protected $zoomClientId = null;
    protected $zoomClientSecret = null;

    public function __construct()
    {
        $this->zoomClientId = env('ZOOM_CLIENT_ID', null);
        $this->zoomClientSecret = env('ZOOM_CLIENT_SECRET', null);
        $this->zoomAccountId = env('ZOOM_ACCOUNT_ID', null);

        $this->accessToken = $this->getAccessToken();

        $this->client = new Client([
            'base_uri' => 'https://api.zoom.us/v2/',
            'headers' => [
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    protected function getAccessToken()
    {

        $client = new Client([
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($this->zoomClientId . ':' . $this->zoomClientSecret),
                'Host' => 'zoom.us',
            ],
        ]);

        $response = $client->request('POST', "https://zoom.us/oauth/token", [
            'form_params' => [
                'grant_type' => 'account_credentials',
                'account_id' => $this->zoomAccountId,
            ],
        ]);

        $responseBody = json_decode($response->getBody(), true);
        return $responseBody['access_token'];
    }

    protected function request(string $uri, string $method = 'GET',mixed $data = [])
    {
        try{
            if($data instanceof Data) {
                $data = ['json' => $data->toArray()];
            }
            $response = $this->client->request($method, $uri, $data);
            return [
                'status' => true,
                'data' => json_decode($response->getBody(), true)
            ];
        }catch (\Throwable $th) {
            return [
                'status' => false,
                'message' => $th->getMessage()
            ];
        }
    }
}
