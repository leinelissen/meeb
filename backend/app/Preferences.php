<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Preferences extends Model
{
    protected $fillable = [
        'temperature',
        'co2',
        'temperature_co2_importance'
    ];
}
