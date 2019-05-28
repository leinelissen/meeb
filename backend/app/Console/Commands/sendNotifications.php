<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use ExponentPhpSDK\Expo;
use React\Promise\Timer;
use Ratchet\Client;
use App\Device;

class sendNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:sendNotifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Will send out Meeb notifications, when neccessary';

    /**
     * The OOCSI message timeout, after which the script will fail. In seconds
     *
     * @var integer
     */
    protected $timeout = 30;

    /**
     * The WebSockets connection
     *
     * @var Ratchet/Client/WebSocket
     */
    protected $connection;

    /**
     * The event loop for all promises
     *
     * @var React\EventLoop\LoopInterface
     */
    protected $loop;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Create loop
        $this->loop = \React\EventLoop\Factory::create();

        // Set timer for x amount of seconds. This is to ensure that OOCSI does
        // not send messages for eternity.
        Timer\resolve($this->timeout, $this->loop)
            ->then(function() {
                // Non-exit code, so that we now that the timeout was called
                exit(1);
            });

        // Store $this in a variable so we can access it in the callback
        $self = $this;

        // Connect to the OOCSI WebSockets server
        $data = Client\connect('wss://oocsi.id.tue.nl/ws', [], [], $this->loop)
            ->then(function($connection) use($self) {
                // Store the connection in the object
                $self->connection = $connection;

                // Pass a callback handler for when a message is received
                $connection->on('message', [$self, 'onReceivedMessage']);

                // Register as a client
                $connection->send('php_oocsi_client');

                // Subscribe to the relevant channel
                $connection->send('subscribe ded-air-quality-group-3-week-5');

                // ...and now we wait for the messages to roll in
            }, function ($e) {
                echo "Could not connect: {$e->getMessage()}\n";
            });

        // Start loop
        $this->loop->run();
    }

    /**
     * This function is called each time we receive a message from OOCSI
     *
     * @param String $data
     * @return void
     */
    public function onReceivedMessage($data)
    {
        try {
            // Decode incoming data and log it
            $message = json_decode($data, true, 512, JSON_THROW_ON_ERROR);
            echo print_r($message, true);
        } catch (\JsonException $e) {
            // If it's not valid JSON, we can ignore it, but we should send and
            // ACK regardless. NOTE: This is probably the opening message from
            // OOCSI
            $this->connection->send('.');
            return;
        }
        
        // Send back a dot as acknowledgement
        $this->connection->send('.');

        // Check if the message contains a timestamp
        if (!$message['timestamp']) {
            onDataReceived($message);
        }

        // Pass the data off to the next function
        $this->handleData($message);
    }

    /**
     * Whenever we succesfully receive a message, we use its data to eventually
     * send out notifications.
     *
     * @param StdObject $message
     * @return void
     */
    public function handleData($message)
    {
        // Close the websockets connection, so that we do not receive any more
        // messages from OOCSI
        $this->connection->close();

        // Get the correct data values from the message
        [ 
            'eco2' => $co2, 
            'temperature' => $temperature, 
            'windowIsClosed' => $windowIsClosed, 
            'doorIsClosed' => $doorIsClosed 
        ] = $message['data'];
        
        // Determine the optimal setting for the windows and doors
        if ($temperature < 20 && $co2 < 1000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
        } else if ($temperature < 22 && $co2 < 1000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
        } else if ($temperature >= 22 && $co2 < 1000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
        } else if ($temperature < 18 && $co2 < 2000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
        } else if ($temperature < 22 && $co2 < 2000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
        } else if ($temperature >= 22 && $co2 < 2000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
        } else if ($temperature < 18 && $co2 < 5000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
        } else if ($temperature < 20 && $co2 < 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
        } else if ($temperature < 22 && $co2 < 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
        } else if ($temperature >= 22 && $co2 < 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
        } else if ($temperature < 18 && $co2 >= 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
        } else if ($temperature >= 18 && $co2 >= 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
        }

        // Check if we need to perform any actions on the doors and/or windows
        $notification = "";
        if ($windowIsClosed === $shouldWindowBeClosed
            && $doorIsClosed === $shouldDoorBeClosed) {
                // Exit the function if everything is allright
                return;
        } else if ($windowIsClosed !== $shouldWindowBeClosed
            && $doorIsClosed !== $shouldDoorBeClosed) {
                if ($shouldWindowBeClosed !== $shouldDoorBeClosed) {
                    $notification = "Please ";
                    $notification .= $shouldWindowBeClosed ? 'close' : 'open' ;
                    $notification .= " the window and";
                    $notification .= $shouldDoorBeClosed ? 'close' : 'open';
                    $notification .= " the door.";
                } else {
                    $notification = "Please ";
                    $notification .= $shouldWindowBeClosed ? 'close' : 'open' ;
                    $notification .= " the window and the door.";
                }
        } else {
            if ($shouldWindowBeClosed !== $windowIsClosed) {
                $notification = "Please ";
                $notification .= $shouldWindowBeClosed ? 'close' : 'open' ;
                $notification .= " the window.";
            } else {
                $notification = "Please ";
                $notification .= $shouldDoorBeClosed ? 'close' : 'open' ;
                $notification .= " the door.";
            }
        }

        $this->sendNotification($notification);
    }

    /**
     * This functions takes a message as input and distributes it to all known
     * push tokens in the database.
     *
     * @param String $message
     * @return void
     */
    public function sendNotification($message)
    {
        // Retrieve all devices
        $devices = Device::all();

        // Prepare notification
        $expo = Expo::normalSetup();
        $notification = [
            'body' => $message,
            'title' => 'Miep',
        ];

        echo "Sending out notifications for {$devices->count()} devices";

        foreach($devices as $device) {
            // Subscribe to a particular device
            $expo->subscribe($device->device_uuid, $device->push_token);

            // Notify said device
            $expo->notify($device->device_uuid, $notification);
        }

        exit(0);
    }

}
