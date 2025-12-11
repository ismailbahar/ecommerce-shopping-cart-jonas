<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ecommerce.test',
            'password' => Hash::make('password'),
        ]);

        // Test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@ecommerce.test',
            'password' => Hash::make('password'),
        ]);
    }
}
