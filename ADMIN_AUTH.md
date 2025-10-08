# Admin Authentication

## Overview
This document explains how admin authentication works in the RAGE e-commerce application.

## Setup

### Environment Variables
The admin credentials are stored in the `.env.local` file:

```
ADMIN_EMAIL=admin@rage.com
ADMIN_PASSWORD=admin123
```

### Accessing the Admin Panel
1. Navigate to `/admin/login`
2. Enter the admin credentials
3. Upon successful authentication, you'll be redirected to the admin dashboard

## Authentication Flow

1. **Login Page** (`/admin/login`)
   - Users enter their email and password
   - Credentials are verified via the API route `/api/admin/login`
   - On successful authentication, a token is stored in localStorage

2. **Authentication Check**
   - The `AdminAuthProvider` component checks if the user is logged in
   - Protected routes require authentication
   - Unauthenticated users are redirected to the login page

3. **Logout**
   - The logout function clears the authentication token from localStorage
   - Users are redirected to the login page

## Protected Routes
The following routes require admin authentication:
- `/admin/dashboard`
- `/admin/orders`
- `/admin/products`
- `/admin/customers`

## Security Notes
- Admin credentials should be changed in production
- The current implementation uses localStorage for session management
- In a production environment, consider implementing proper JWT tokens with expiration
- HTTPS should be used in production to protect credentials in transit

## Testing
To test the admin authentication:
1. Visit `/admin/login`
2. Use the credentials from your `.env.local` file
3. You should be redirected to the dashboard upon successful login