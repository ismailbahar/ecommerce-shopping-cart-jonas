<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendLowStockNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Product $product
    ) {}

    public function handle(): void
    {
        $admin = User::where('email', 'admin@ecommerce.test')->first();

        if (!$admin) {
            Log::warning('Admin user not found for low stock notification');
            return;
        }

        $message = "Low Stock Alert!\n\n" .
            "Product: {$this->product->name}\n" .
            "Current Stock: {$this->product->stock_quantity}\n" .
            "Product ID: {$this->product->id}\n\n" .
            "Please restock this item soon.";

        Mail::raw($message, function ($mail) use ($admin) {
            $mail->to($admin->email)
                ->subject('Low Stock Alert - Action Required');
        });

        Log::info("Low stock notification sent for product: {$this->product->name}");
    }
}
