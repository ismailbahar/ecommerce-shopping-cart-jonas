# E-Commerce Shopping Cart

A simple e-commerce shopping cart system built with Laravel 12 and React. Users can browse products, add them to cart, update quantities, and place orders. Includes automated low stock notifications and daily sales reports.

## Features

- 🛍️ **Product Browsing**: View all available products with stock information
- 🛒 **Shopping Cart**: Add, update, and remove items from cart
- 📦 **Order Management**: Place orders and view order history
- 🔔 **Low Stock Alerts**: Automated email notifications when stock is low (≤10 items)
- 📊 **Daily Sales Reports**: Scheduled job sends sales reports every evening at 6 PM
- 🔐 **Authentication**: Secure user login and registration
- ⚡ **Real-time Updates**: SPA experience with Inertia.js

## Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **MySQL** - Database
- **Inertia.js** - Server-side routing with client-side rendering
- **Laravel Breeze** - Authentication scaffolding
- **Queue System** - Background job processing

### Frontend
- **React 18** - UI Library
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+
- MySQL

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/ismailbahar/ecommerce-shopping-cart-jonas.git
cd ecommerce-shopping-cart-jonas
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install JavaScript dependencies**
```bash
npm install
```

4. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure database in `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_cart_jonas
DB_USERNAME=root
DB_PASSWORD=
```

6. **Create database**
```bash
# Using MySQL command line or GUI tool
CREATE DATABASE ecommerce_cart_jonas;
```

7. **Run migrations and seeders**
```bash
php artisan migrate
php artisan db:seed
```

8. **Configure Queue and Mail**
```env
QUEUE_CONNECTION=database
MAIL_MAILER=log
```

9. **Create queue table**
```bash
php artisan make:queue-table
php artisan migrate
```

## Running the Application

You need to run **3 processes**:

### Terminal 1: Laravel Server
```bash
php artisan serve
```
Access: `http://localhost:8000`

### Terminal 2: Vite Dev Server (Frontend)
```bash
npm run dev
```

### Terminal 3: Queue Worker (Background Jobs)
```bash
php artisan queue:work
```

## Default Credentials

### Admin User
- **Email**: `admin@ecommerce.test`
- **Password**: `password`

### Test User
- **Email**: `test@ecommerce.test`
- **Password**: `password`

## Database Structure

### Tables
- `users` - User accounts
- `products` - Product catalog
- `carts` - User shopping carts
- `cart_items` - Items in carts
- `orders` - Completed orders
- `order_items` - Items in orders
- `jobs` - Queue jobs
- `sessions` - User sessions

## Key Features Explained

### 1. Low Stock Notification
When a product's stock drops to 10 or below, a job is dispatched to send an email notification to the admin.
```php
// Triggered in CartController
if ($product->stock_quantity <= 10) {
    SendLowStockNotification::dispatch($product);
}
```

### 2. Daily Sales Report
A scheduled job runs every evening at 6 PM to generate and email a sales report.
```php
// routes/console.php
Schedule::job(new SendDailySalesReport())
    ->dailyAt('18:00')
    ->timezone('Europe/Istanbul');
```

### 3. Cart Management
- Each user has one cart
- Cart persists across sessions (stored in database)
- Stock validation on add/update
- Automatic cart clearing after order placement

### 4. Order Processing
- Transaction-based order creation
- Stock deduction on order placement
- Order history tracking
- Detailed order view with item breakdown

## Project Structure
```
├── app/
│   ├── Http/Controllers/
│   │   ├── ProductController.php
│   │   ├── CartController.php
│   │   └── OrderController.php
│   ├── Models/
│   │   ├── Product.php
│   │   ├── Cart.php
│   │   ├── CartItem.php
│   │   ├── Order.php
│   │   └── OrderItem.php
│   └── Jobs/
│       ├── SendLowStockNotification.php
│       └── SendDailySalesReport.php
├── resources/js/
│   ├── Components/
│   ├── Layouts/
│   │   └── AuthenticatedLayout.jsx
│   └── Pages/
│       ├── Products/
│       │   ├── Index.jsx
│       │   └── Show.jsx
│       ├── Cart/
│       │   └── Index.jsx
│       └── Orders/
│           ├── Index.jsx
│           └── Show.jsx
├── routes/
│   ├── web.php
│   └── console.php
└── database/
    ├── migrations/
    └── seeders/
```

## Testing the Application

### Test Low Stock Notification
1. Add a product with low stock (≤10) to cart
2. Check `storage/logs/laravel.log` for the email

### Test Daily Sales Report
```bash
# Manually trigger the scheduled job
php artisan schedule:run
```

### Test Queue System
```bash
# Run queue worker
php artisan queue:work

# Check jobs table for pending jobs
```

## Scheduled Tasks Setup (Production)

Add to crontab:
```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

## Technologies & Packages

- **laravel/framework** (^12.0) - Core framework
- **laravel/breeze** - Authentication scaffolding
- **inertiajs/inertia-laravel** - Server-side adapter
- **react** (^18.3) - Frontend framework
- **tailwindcss** (^3.4) - CSS framework
- **vite** (^7.2) - Build tool

## Development Time

**Total Time**: Approximately 4-6 hours

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Author

**Ismail Bahar**
- GitHub: [@ismailbahar](https://github.com/ismailbahar)

## Acknowledgments

- Built as a practical task for Jonas (E-Commerce Cart Project)
- Uses Laravel best practices and conventions
- Follows RESTful API principles
