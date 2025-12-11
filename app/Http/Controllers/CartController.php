<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('items.product')->first();

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'cartItems' => $cart ? $cart->items : [],
            'total' => $cart ? $cart->getTotalAmount() : 0
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check stock
        if ($product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Insufficient stock available.');
        }

        // Get or create cart
        $cart = Auth::user()->cart()->firstOrCreate([
            'user_id' => Auth::id()
        ]);

        // Check if product already in cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $request->quantity;

            if ($product->stock_quantity < $newQuantity) {
                return back()->with('error', 'Insufficient stock available.');
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            // Create new cart item
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity
            ]);
        }

        // Check for low stock and trigger notification
        if ($product->stock_quantity <= 10) {
            \App\Jobs\SendLowStockNotification::dispatch($product);
        }

        return back()->with('success', 'Product added to cart successfully!');
    }

    public function updateQuantity(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        // Check if cart item belongs to user
        if ($cartItem->cart->user_id !== Auth::id()) {
            abort(403);
        }

        // Check stock
        if ($cartItem->product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Insufficient stock available.');
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated successfully!');
    }

    public function removeFromCart(CartItem $cartItem)
    {
        // Check if cart item belongs to user
        if ($cartItem->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart!');
    }

    public function clearCart()
    {
        $cart = Auth::user()->cart;

        if ($cart) {
            $cart->items()->delete();
        }

        return back()->with('success', 'Cart cleared successfully!');
    }
}
