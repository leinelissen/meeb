<?php

namespace App\Console\Commands;

use App\Device;
use Ratchet\Client;
use React\Promise\Timer;
use ExponentPhpSDK\Expo;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

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
        Log::info('Running sendNotifications cronjob');

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
                $oocsi_channel = env('OOCSI_CHANNEL');
                $connection->send("subscribe $oocsi_channel");

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

        // Subtract two degrees from temperature because of inaccuracy
        $temperature -= 2;
        
        // Determine the optimal setting for the windows and doors
        $notification = "";
        $shouldWindowBeClosed = null;
        $shouldDoorBeClosed = null;

        if (co2 < 1000) {
            echo "CO2 value is too low, aborting";
            Log::info('CO2 value is too low, exiting.');
            exit(0);
        }

        if ($temperature < 18 && $co2 < 1000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The air quality is good, however it is quite cold. You might want to adjust the thermostat"
                : "The air quality is good, however it is quite cold. It might be better to close all doors and windows and adjust the thermostat.";
        } else if ($temperature < 20 && $co2 < 1000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The air quality is good, however it is a bit cold. It might be better to close all doors and windows."
                : "The air quality is good, however it is a bit cold. It might be better to close all doors and windows.";
        } else if ($temperature < 22 && $co2 < 1000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The air quality is good, however it is quite warm."
                : "The air quality is good, however it is quite warm. It might be better to open a window.";
        } else if ($temperature > 22 && $co2 < 1000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The temperature is higher than it should be."
                : "The temperature is higher than it should be, you should open some doors and windows.";
        } else if ($temperature < 18 && $co2 < 2000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Although it is quite cold, you could try to open the doors to other rooms in order to improve the air quality"
                : "Although it is quite cold, you could try to open the doors to other rooms in order to improve the air quality";
        } else if ($temperature < 20 && $co2 < 2000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Both the temperature and the air quality would benefit from some fresh air."
                : "The room would benefit from some fresh are, you should open the window.";
        } else if ($temperature < 22 && $co2 < 2000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Both the temperatue and the CO2 level are quite high."
                : "Both the temperatue and the CO2 level are quite high, you should really open a window.";
        } else if ($temperature > 22 && $co2 < 2000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The current CO2 level is associated with complaints of drowsiness and poor air."
                : "The current CO2 level is associated with complaints of drowsiness and poor air. Both the door and window should be opened";
        } else if ($temperature < 18 && $co2 < 5000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Although it is quite cold, you should really try to open inside doors and maybe a small window to improve the air quality "
                : "Although the CO2 level is quite high, for a healthy room temperature it would be better to open only inside doors.";
        } else if ($temperature < 20 && $co2 < 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The current CO2 level is associated with headaches and sleepiness."
                : "The current CO2 level is associated with headaches and sleepiness. It would be better to open a window.";
        } else if ($temperature < 22 && $co2 < 5000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = true;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Both the temperature and the CO2 level are slightly higher than they should be."
                : "Both the temperature and the CO2 level are slightly higher than they should be, the door and the window should be open";
        } else if ($temperature > 22 && $co2 < 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Your inside air quality isn't looking good! Is there anything else you can open?"
                : "Your inside air quality isn't looking good! Try to open as much as possible";
        } else if ($temperature < 18 && $co2 > 5000) {
            $shouldWindowBeClosed = true;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The measured CO2 level indicate unusual air conditions, the open window should help to lower it."
                : "The measured CO2 level indicate unusual air conditions, you might want to open a window to avoid a headache.";
        } else if ($temperature < 20 && $co2 > 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The measured CO2 level indicate unusual air conditions where high levels of other gases also could be present. If it doesn't change quickly you might want to leave the room. "
                : "You have a CO2 problem! Both the window and door should be open";
        } else if ($temperature < 22 && $co2 > 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "The living conditions in this room are really bad, you should really consider going somewhere else."
                : "The living conditions in this room are really bad, both the window and door should be opened";
        } else if ($temperature > 22 && $co2 > 5000) {
            $shouldWindowBeClosed = false;
            $shouldDoorBeClosed = false;
            $notification = $windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed   
                ? "Your inside air quality is REALLY, REALLY bad! Leave everything open, close the blinds and try to go somewhere else."
                : "Your inside air quality is REALLY, REALLY bad! You should open all doors and windows and try to go somewhere else.";
        }

        // Retrieve the last relevant variables from the Laravel Cache
        $lastNotification = Cache::get('last_notification', null);
        $lastWindowIsClosed = Cache::get('last_window_is_closed', null);
        $lastDoorIsClosed = Cache::get('last_door_is_closed', null);
        
        // Check if we need to perform any actions on the doors and/or windows
        if (($windowIsClosed === $shouldWindowBeClosed && $doorIsClosed === $shouldDoorBeClosed)
            || $lastNotification === $notification
            || ($lastWindowIsClosed === $windowIsClosed && $lastDoorIsClosed === $doorIsClosed)) {
                echo "Aborting the notifications, since the criteria were not met.";
                Log::info('Criteria were not met, aborting.');
                exit(0);
        }

        // Save new variables to cache
        Cache::put('last_notification', $notification, now()->addHours(4));
        Cache::put('last_window_is_closed', $windowIsClosed, now()->addHours(4));
        Cache::put('last_door_is_closed', $doorIsClosed, now()->addHours(4));

        // Send out the notification
        $this->sendNotification($notification, [
            'doorIsClosed' => $doorIsClosed,
            'windowIsClosed' => $windowIsClosed,
            'shouldDoorBeClosed' => $shouldDoorBeClosed,
            'shouldWindowBeClosed' => $shouldWindowBeClosed,
        ]);
    }

    /**
     * This functions takes a message as input and distributes it to all known
     * push tokens in the database.
     *
     * @param String $message
     * @param Array $data
     * @return void
     */
    public function sendNotification($message, $data)
    {
        // Retrieve all devices
        $devices = Device::all();

        // Prepare notification
        $expo = Expo::normalSetup();
        $notification = [
            'body' => $message,
            'title' => 'Miep',
            'badge' => 1,
            'data' => $data,
        ];

        echo "Sending out notifications for {$devices->count()} devices";

        foreach($devices as $device) {
            // Subscribe to a particular device
            $expo->subscribe($device->device_uuid, $device->push_token);

            // Notify said device
            $expo->notify($device->device_uuid, $notification);
        }

        Log::info("Successfully sent out {$devices->count()} notifications");

        exit(0);
    }

}
