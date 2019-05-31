<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NotificationResponse extends Model
{
    protected $fillable = [
        'device_uuid',
        'response_type',
        'feedback'
    ];
}
