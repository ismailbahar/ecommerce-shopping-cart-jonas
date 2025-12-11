import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const cartItemCount = usePage().props.cartItemCount || 0;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('products.index')}
                                    active={route().current('products.*')}
                                >
                                    Products
                                </NavLink>
                                <NavLink
                                    href={route('cart.index')}
                                    active={route().current('cart.*')}
                                >
                                    <div className="flex items-center gap-2">
                                        Cart
                                        {cartItemCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </div>
                                </NavLink>
                                <NavLink
                                    href={route('orders.index')}
                                    active={route().current('orders.*')}
                                >
                                    My Orders
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('products.index')}
                            active={route().current('products.*')}
                        >
                            Products
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('cart.index')}
                            active={route().current('cart.*')}
                        >
                            <div className="flex items-center justify-between">
                                <span>Cart</span>
                                {cartItemCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('orders.index')}
                            active={route().current('orders.*')}
                        >
                            My Orders
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white border-t border-gray-700 mt-auto">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">E-Commerce Cart</h3>
                            <p className="text-gray-400 text-sm">
                                A modern shopping cart built with Laravel and React.
                            </p>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('products.index')} className="text-gray-400 hover:text-white text-sm">
                                        Browse Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('cart.index')} className="text-gray-400 hover:text-white text-sm">
                                        View Cart
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('orders.index')} className="text-gray-400 hover:text-white text-sm">
                                        My Orders
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Connect</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="https://github.com/ismailbahar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:i.bhr.1999@gmail.com" className="text-gray-400 hover:text-white text-sm">
                                        Email
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} Ismail Bahar. Built for Jonas E-Commerce Task.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
