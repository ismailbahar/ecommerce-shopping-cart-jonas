<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Auth::user()->orders()->with('items.product')->latest()->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $cart = Auth::user()->cart()->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty!');
        }

        // Check stock for all items
        foreach ($cart->items as $item) {
            if ($item->product->stock_quantity < $item->quantity) {
                return back()->with('error', "Insufficient stock for {$item->product->name}");
            }
        }

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'total_amount' => $cart->getTotalAmount(),
                'status' => 'completed'
            ]);

            // Create order items and update stock
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price
                ]);

                // Update product stock
                $item->product->decrement('stock_quantity', $item->quantity);
            }

            // Clear cart
            $cart->items()->delete();

            DB::commit();

            return redirect()->route('orders.index')
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to place order. Please try again.');
        }
    }

    public function show(Order $order)
    {
        // Check if order belongs to user
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('items.product');

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }
}
