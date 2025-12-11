import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ auth, product }) {
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);

    const addToCart = () => {
        setProcessing(true);
        router.post('/cart/add', {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setQuantity(1);
            },
            onFinish: () => setProcessing(false)
        });
    };

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
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <Link
                            href={route('products.index')}
                            className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
                        >
                            ← Back to Products
                        </Link>

                        <div className="mt-4">
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                            <div className="mb-6">
                                <p className="text-gray-600 text-lg">{product.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-green-600">
                                    ${product.price}
                                </span>
                            </div>

                            <div className="mb-6">
                                <span className={`text-lg ${product.stock_quantity <= 10 ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && '⚠️ '}
                                    Stock Available: {product.stock_quantity}
                                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && ' (Low Stock!)'}
                                </span>
                            </div>

                            {product.stock_quantity > 0 && (
                                <div className="flex items-center gap-4 mb-6">
                                    <label className="text-gray-700 font-semibold">Quantity:</label>
                                    <div className="flex items-center border rounded">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                                        >
                                            -
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
                                            className="w-20 text-center border-0 focus:ring-0"
                                            min="1"
                                            max={product.stock_quantity}
                                        />
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={addToCart}
                                    disabled={processing || product.stock_quantity === 0}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
                                >
                                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>

                                <Link
                                    href={route('cart.index')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                                >
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
