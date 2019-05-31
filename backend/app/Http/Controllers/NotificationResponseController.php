<?php

namespace App\Http\Controllers;

use App\Device;
use App\NotificationResponse;
use Illuminate\Http\Request;

class NotificationResponseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'response_type' => 'required|string|in:ACCEPTED,REJECTED,NOT_AT_HOME',
            'feedback' => 'string|nullable',
            'device_uuid' => 'required|exists:devices',
        ]);

        $notificationResponse = new NotificationResponse($request->except('device_uuid'));

        $device = Device::where('device_uuid', '=', $request->device_uuid)->firstOrFail();

        $device->notificationResponse()->save($notificationResponse);

        return $notificationResponse;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\NotificationResponse  $notificationResponse
     * @return \Illuminate\Http\Response
     */
    public function show(NotificationResponse $notificationResponse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\NotificationResponse  $notificationResponse
     * @return \Illuminate\Http\Response
     */
    public function edit(NotificationResponse $notificationResponse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\NotificationResponse  $notificationResponse
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, NotificationResponse $notificationResponse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\NotificationResponse  $notificationResponse
     * @return \Illuminate\Http\Response
     */
    public function destroy(NotificationResponse $notificationResponse)
    {
        //
    }

}
