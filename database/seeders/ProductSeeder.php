<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'Wireless Mouse',
                'description' => 'Ergonomic wireless mouse',
                'price' => 29.99,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Mechanical Keyboard',
                'description' => 'RGB mechanical gaming keyboard',
                'price' => 89.99,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'USB-C Hub',
                'description' => '7-in-1 USB-C hub adapter',
                'price' => 45.99,
                'stock_quantity' => 8, // Low stock
            ],
            [
                'name' => '27" Monitor',
                'description' => '4K UHD monitor with HDR',
                'price' => 399.99,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Webcam HD',
                'description' => '1080p webcam with microphone',
                'price' => 69.99,
                'stock_quantity' => 5, // Low stock
            ],
            [
                'name' => 'Desk Lamp',
                'description' => 'LED desk lamp with touch control',
                'price' => 34.99,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'Phone Stand',
                'description' => 'Adjustable phone and tablet stand',
                'price' => 19.99,
                'stock_quantity' => 100,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
