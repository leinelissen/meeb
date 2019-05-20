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

    public function preferences() 
    {
        return $this->hasMany('App\Preferences');
    }
}
