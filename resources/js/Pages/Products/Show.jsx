import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Show({ auth, product }) {
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const addToCart = () => {
        setProcessing(true);
        router.post('/cart/add', {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPopup(true);
                setQuantity(1);
            },
            onFinish: () => setProcessing(false)
        });
    };

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const incrementQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Details</h2>}
        >
            <Head title={product.name}/>

            {/* Success Popup */}
            {showPopup && (
                <div className="fixed top-8 right-8 z-50 animate-slide-in">
                    <div className="backdrop-blur-xl bg-green-400/90 border border-green-300/50 rounded-2xl p-6 shadow-2xl min-w-[320px]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">Added to Cart!</h3>
                                <p className="text-white/90 text-sm">
                                    {quantity}x {product.name} added successfully
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white/60 rounded-full animate-progress" />
                        </div>
                    </div>
                </div>
            )}

            <div className="py-12 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 min-h-screen">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center gap-2 backdrop-blur-xl bg-gray-400/20 hover:bg-gray-400/30 text-gray-800 px-6 py-3 rounded-full font-semibold mb-6 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-300/30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Back to Products
                    </Link>

                    <div
                        className="group relative backdrop-blur-xl bg-gray-400/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-gray-400/25 border border-gray-300/30 overflow-hidden">
                        {/* Shimmer effect */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none z-0"/>

                        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                            {/* Product Image Placeholder */}
                            <div
                                className="w-full lg:w-1/2 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300/40 to-gray-400/40 backdrop-blur-sm flex-shrink-0">
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg
                                        className="w-48 h-48 text-gray-400/60 group-hover:text-gray-500/60 transition-all duration-300 group-hover:scale-110"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd"
                                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col">
                                <h1 className="text-4xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                                    {product.name}
                                </h1>

                                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="mb-6">
                                    <span
                                        className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                                        ${product.price}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <span
                                        className={`inline-flex items-center gap-2 text-base font-semibold px-4 py-2 rounded-full backdrop-blur-md ${
                                            product.stock_quantity <= 10 && product.stock_quantity > 0
                                                ? 'bg-orange-400/30 text-orange-700'
                                                : product.stock_quantity === 0
                                                    ? 'bg-red-400/30 text-red-700'
                                                    : 'bg-green-400/30 text-green-700'
                                        }`}>
                                        {product.stock_quantity <= 10 && product.stock_quantity > 0 && '⚠️ '}
                                        Stock Available: {product.stock_quantity}
                                        {product.stock_quantity <= 10 && product.stock_quantity > 0 && ' (Low Stock!)'}
                                        {product.stock_quantity === 0 && ' (Out of Stock!)'}
                                    </span>
                                </div>

                                {product.stock_quantity > 0 && (
                                    <div className="flex items-center gap-4 mb-8">
                                        <label className="text-gray-800 font-bold text-lg">Quantity:</label>
                                        <div
                                            className="flex items-center backdrop-blur-md bg-gray-300/40 rounded-full overflow-hidden shadow-lg">
                                            <button
                                                onClick={decrementQuantity}
                                                className="px-6 py-3 bg-gradient-to-r from-gray-400/50 to-gray-500/50 hover:from-gray-500/60 hover:to-gray-600/60 text-gray-800 font-bold text-xl transition-all duration-300 hover:scale-105"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (val >= 1 && val <= product.stock_quantity) {
                                                        setQuantity(val);
                                                    }
                                                }}
                                                className="w-20 text-center bg-transparent border-0 focus:ring-0 text-gray-800 font-bold text-xl"
                                                min="1"
                                                max={product.stock_quantity}
                                            />
                                            <button
                                                onClick={incrementQuantity}
                                                className="px-6 py-3 bg-gradient-to-r from-gray-400/50 to-gray-500/50 hover:from-gray-500/60 hover:to-gray-600/60 text-gray-800 font-bold text-xl transition-all duration-300 hover:scale-105"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-auto">
                                    <button
                                        onClick={addToCart}
                                        disabled={processing || product.stock_quantity === 0}
                                        className="flex-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:shadow-md"
                                    >
                                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>

                                    <Link
                                        href={route('cart.index')}
                                        className="flex-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg text-center transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                    >
                                        View Cart
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }

                .animate-progress {
                    animation: progress 3s linear;
                }

                /* Hide number input arrows */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                input[type="number"] {
                    -moz-appearance: textfield;
                    appearance: textfield;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
