<?php

namespace App\Console\Commands;


use App\Socket\Server\ControllerWebSocket;
use Illuminate\Console\Command;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class SocketServer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:socket-server';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start socket server';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $port = config('socket.port', env('SOCKET_PORT', 8080));
        $this->info("The server is running on port: {$port}");

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new ControllerWebSocket()
                )
            ),
            $port
        );

        $server->run();
    }
}
