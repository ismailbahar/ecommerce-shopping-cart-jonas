import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, order }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order Details</h2>}
        >
            <Head title={`Order #${order.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <Link
                            href={route('orders.index')}
                            className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
                        >
                            ← Back to Orders
                        </Link>

                        <div className="mt-4">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
                                    <p className="text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                                        order.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-b py-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                                            <div className="flex-1">
                                                <Link
                                                    href={route('products.show', item.product.id)}
                                                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Price: ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-lg font-bold text-green-600">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-2xl font-bold">
                                <span>Total Amount:</span>
                                <span className="text-green-600">
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <Link
                                    href={route('products.index')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    href={route('orders.index')}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                                >
                                    View All Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
