import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, products }) {
    const [processing, setProcessing] = useState(false);

    const addToCart = (productId) => {
        setProcessing(true);
        router.post('/cart/add', {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-2xl font-bold text-green-600">
                                            ${product.price}
                                        </span>
                                        <span className={`text-sm ${product.stock_quantity <= 10 ? 'text-red-500' : 'text-gray-500'}`}>
                                            Stock: {product.stock_quantity}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('products.show', product.id)}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            disabled={processing || product.stock_quantity === 0}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                                        >
                                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
