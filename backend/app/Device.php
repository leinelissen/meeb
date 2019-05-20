<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'device_uuid',
        'push_token',
        'name'
    ];

    protected $hidden = [
        'device_uuid',
        'push_token',
    ];

    public function preferences() 
    {
        return $this->hasMany('App\Preferences');
    }

    public function latestPreferences()
    {
        return $this->hasOne('App\Preferences')->latest();
    }
}
