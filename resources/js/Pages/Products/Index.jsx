import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, products }) {
    const [processingId, setProcessingId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);

    const addToCart = (product) => {
        setProcessingId(product.id);
        router.post('/cart/add', {
            product_id: product.id,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddedProduct(product);
                setShowPopup(true);
            },
            onFinish: () => setProcessingId(null)
        });
    };

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
                setAddedProduct(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            {/* Success Popup */}
            {showPopup && addedProduct && (
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
                                    1x {addedProduct.name} added successfully
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    setAddedProduct(null);
                                }}
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative backdrop-blur-xl bg-gray-400/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-400/30 border border-gray-300/30 hover:-translate-y-2 overflow-hidden"
                            >
                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none z-0" />

                                {/* Product Image Placeholder */}
                                <div className="relative mb-4 w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300/40 to-gray-400/40 backdrop-blur-sm z-10">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg
                                            className="w-24 h-24 text-gray-400/60 group-hover:text-gray-500/60 transition-all duration-300 group-hover:scale-110"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                                            ${product.price}
                                        </span>
                                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                                            product.stock_quantity <= 10
                                                ? 'bg-red-400/30 text-red-700'
                                                : 'bg-green-400/30 text-green-700'
                                        }`}>
                                            {product.stock_quantity} stock
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={route('products.show', product.id)}
                                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-full text-center font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={processingId === product.id || product.stock_quantity === 0}
                                            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-full font-semibold text-sm disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:shadow-md"
                                        >
                                            {product.stock_quantity === 0 ? 'Out of Stock' : processingId === product.id ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
            `}</style>
        </AuthenticatedLayout>
    );
}
