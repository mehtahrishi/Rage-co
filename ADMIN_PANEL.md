# Admin Panel Documentation

## Overview
The admin panel provides administrators with tools to manage the e-commerce platform, including viewing dashboard statistics, managing customers, and handling orders.

## Features

### 1. Dashboard
- **Real-time Statistics**: Shows total revenue, subscriptions, sales, and active users
- **Overview Chart**: Visual representation of sales data
- **Recent Sales**: List of recent customer purchases

### 2. Customers
- **Customer List**: View all registered users
- **Search & Filter**: Find customers by name or email
- **Customer Details**: View customer information including join date, order history, and total spent
- **Actions**: Manage customer accounts (view details, edit, send email)

### 3. Orders
- **Order Management**: View and manage all customer orders
- **Status Tracking**: Update order status (Pending, Processing, Shipped, Delivered, Cancelled)
- **Search & Filter**: Find orders by customer name, email, or order ID
- **Order Details**: View items in each order, quantities, prices, and specifications
- **Timestamps**: See when orders were placed and last updated

## Technical Implementation

### API Routes
The admin panel uses server-side API routes for secure data access:

1. **`/api/admin/users`** - Fetches user data from Appwrite
2. **`/api/admin/orders`** - Fetches order data and allows status updates

### Services
- **`AdminService`** - Client-side service that interacts with API routes
- **Server-side API routes** - Securely access Appwrite services using server API keys

### Security
- API routes use server-side Appwrite SDK with API keys
- Client-side code only interacts with our own API routes
- Sensitive operations require proper authentication (to be implemented)

## Usage

### Accessing the Admin Panel
Navigate to `/admin` to access the admin panel.

### Managing Orders
1. Go to the Orders page
2. Use search and filters to find specific orders
3. Click the action menu (three dots) next to an order
4. Select the appropriate status to update the order

### Viewing Customers
1. Go to the Customers page
2. Use search to find specific customers
3. View customer details including order history and spending

## Future Enhancements
- Implement proper admin authentication and authorization
- Add product management capabilities
- Include analytics and reporting features
- Add export functionality for customers and orders
- Implement pagination for large datasets