import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, cart, cartItems, total }) {
    const [processing, setProcessing] = useState(false);

    const updateQuantity = (cartItemId, quantity) => {
        if (quantity < 1) return;

        setProcessing(true);
        router.patch(route('cart.update', cartItemId), {
            quantity: quantity
        }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false)
        });
    };

    const removeItem = (cartItemId) => {
        Swal.fire({
            title: 'Remove Item?',
            text: "Are you sure you want to remove this item from your cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessing(true);
                router.delete(route('cart.remove', cartItemId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Removed!',
                            text: 'Item has been removed from your cart.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onFinish: () => setProcessing(false)
                });
            }
        });
    };

    const clearCart = () => {
        Swal.fire({
            title: 'Clear Cart?',
            text: "This will remove all items from your cart. This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessing(true);
                router.delete(route('cart.clear'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Cleared!',
                            text: 'Your cart has been cleared.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onFinish: () => setProcessing(false)
                });
            }
        });
    };

    const placeOrder = () => {
        Swal.fire({
            title: 'Place Order?',
            text: `Total amount: $${parseFloat(total).toFixed(2)}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, place order!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessing(true);
                router.post(route('orders.store'), {}, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Your order has been placed successfully!',
                            icon: 'success',
                            confirmButtonColor: '#10b981'
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to place order. Please try again.',
                            icon: 'error',
                            confirmButtonColor: '#ef4444'
                        });
                    },
                    onFinish: () => setProcessing(false)
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shopping Cart</h2>}
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {!cartItems || cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
                                <Link
                                    href={route('products.index')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Cart Items ({cartItems.length})</h3>
                                    <button
                                        onClick={clearCart}
                                        disabled={processing}
                                        className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="border rounded-lg p-4 flex items-center gap-4">
                                            <div className="flex-1">
                                                <Link
                                                    href={route('products.show', item.product.id)}
                                                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Available Stock: {item.product.stock_quantity}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={processing || item.quantity <= 1}
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            if (val >= 1 && val <= item.product.stock_quantity) {
                                                                updateQuantity(item.id, val);
                                                            }
                                                        }}
                                                        className="w-16 text-center border-0 focus:ring-0"
                                                        min="1"
                                                        max={item.product.stock_quantity}
                                                        disabled={processing}
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={processing || item.quantity >= item.product.stock_quantity}
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-right min-w-[100px]">
                                                    <p className="text-lg font-bold text-green-600">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ${item.product.price} each
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={processing}
                                                    className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xl font-semibold">Total:</span>
                                        <span className="text-3xl font-bold text-green-600">
                                            ${parseFloat(total).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link
                                            href={route('products.index')}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-center font-semibold"
                                        >
                                            Continue Shopping
                                        </Link>
                                        <button
                                            onClick={placeOrder}
                                            disabled={processing}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
                                        >
                                            Place Order
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
