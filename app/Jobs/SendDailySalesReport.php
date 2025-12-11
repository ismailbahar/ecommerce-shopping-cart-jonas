<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $admin = User::where('email', 'admin@ecommerce.test')->first();

        if (!$admin) {
            Log::warning('Admin user not found for daily sales report');
            return;
        }

        $today = Carbon::today();
        $orders = Order::whereDate('created_at', $today)
            ->with('items.product')
            ->get();

        if ($orders->isEmpty()) {
            Log::info('No sales today - skipping daily report');
            return;
        }

        $totalSales = $orders->sum('total_amount');
        $totalOrders = $orders->count();

        $report = "Daily Sales Report - " . $today->format('Y-m-d') . "\n\n";
        $report .= "Total Orders: {$totalOrders}\n";
        $report .= "Total Revenue: $" . number_format($totalSales, 2) . "\n\n";
        $report .= "Products Sold:\n";
        $report .= str_repeat('-', 50) . "\n";

        $productsSold = [];
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $productName = $item->product->name;
                if (!isset($productsSold[$productName])) {
                    $productsSold[$productName] = [
                        'quantity' => 0,
                        'revenue' => 0
                    ];
                }
                $productsSold[$productName]['quantity'] += $item->quantity;
                $productsSold[$productName]['revenue'] += $item->quantity * $item->price;
            }
        }

        foreach ($productsSold as $name => $data) {
            $report .= sprintf(
                "- %s: %d units sold, Revenue: $%.2f\n",
                $name,
                $data['quantity'],
                $data['revenue']
            );
        }

        Mail::raw($report, function ($mail) use ($admin, $today) {
            $mail->to($admin->email)
                ->subject('Daily Sales Report - ' . $today->format('M d, Y'));
        });

        Log::info("Daily sales report sent for: " . $today->format('Y-m-d'));
    }
}
