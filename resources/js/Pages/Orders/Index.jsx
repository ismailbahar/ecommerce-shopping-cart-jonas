import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, orders }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Orders</h2>}
        >
            <Head title="My Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-xl mb-4">You haven't placed any orders yet</p>
                                <Link
                                    href={route('products.index')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                                <p className="text-gray-600 text-sm">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-600">
                                                    ${parseFloat(order.total_amount).toFixed(2)}
                                                </p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                    order.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-gray-700 font-semibold mb-2">Items:</p>
                                            <ul className="space-y-1">
                                                {order.items.map((item) => (
                                                    <li key={item.id} className="text-gray-600 text-sm flex justify-between">
                                                        <span>
                                                            {item.product.name} x {item.quantity}
                                                        </span>
                                                        <span className="font-semibold">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
