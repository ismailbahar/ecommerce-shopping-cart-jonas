<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Daily Sales Report - Runs every evening at 6 PM
Schedule::job(new \App\Jobs\SendDailySalesReport())
    ->dailyAt('18:00')
    ->timezone('Europe/Istanbul');
