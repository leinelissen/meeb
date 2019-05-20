<?php

namespace App\Http\Controllers;

use App\Preferences;
use App\Device;
use Illuminate\Http\Request;

class PreferencesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $devices = Device::with('latestPreferences')->get();

        return $devices;
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
            'device_uuid' => 'required|exists:devices',
            'temperature' => 'required|numeric',
            'co2' => 'required|numeric',
            'temperature_co2_importance' => 'required|numeric'
        ]);

        $device = Device::where('device_uuid', '=', $request->device_uuid)->firstOrFail();
    
        $preferences = new Preferences($request->only(['temperature', 'co2', 'temperature_co2_importance']));

        $device->preferences()->save($preferences);

        return $preferences;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Preferences  $preferences
     * @return \Illuminate\Http\Response
     */
    public function show(Preferences $preferences)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Preferences  $preferences
     * @return \Illuminate\Http\Response
     */
    public function edit(Preferences $preferences)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Preferences  $preferences
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Preferences $preferences)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Preferences  $preferences
     * @return \Illuminate\Http\Response
     */
    public function destroy(Preferences $preferences)
    {
        //
    }
}
