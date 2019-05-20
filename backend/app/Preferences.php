<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Preferences extends Model
{
    use \OwenIt\Auditing\Auditable;
}
