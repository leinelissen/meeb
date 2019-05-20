<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Preferences extends Model
{
    protected $fillable = [
        'temperature',
        'co2',
        'temperature_co2_importance'
    ];
}
