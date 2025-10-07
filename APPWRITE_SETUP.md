# 🚀 RAGE E-commerce Backend Setup with Appwrite

## Phase 1: Appwrite Integration ✅

This phase sets up the complete backend infrastructure using Appwrite for your RAGE e-commerce platform.

## 🏗️ What We've Built

### 1. **Appwrite Configuration** (`src/lib/appwrite.ts`)
- Client initialization
- Database and storage configuration
- Environment variable management

### 2. **Database Services** (`src/services/database.ts`)
- `ProductService` - CRUD operations for products
- `CollectionService` - Product categories management
- `ReviewService` - Customer reviews system

### 3. **Authentication System** (`src/services/auth.ts` + `src/context/auth-provider.tsx`)
- User registration/login
- Password recovery
- Email verification
- Protected routes

### 4. **API Routes** (`src/app/api/`)
- `/api/products` - Product management
- `/api/products/[id]` - Individual product operations

### 5. **Database Setup Script** (`scripts/setup-appwrite.js`)
- Automated database structure creation
- Collections with proper attributes
- Storage buckets for images

## 📋 Setup Instructions

### Step 1: Appwrite Project Setup
1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted instance
2. Create a new project with ID: `68e53610001bfa01a8a5`
3. Get your API key from **Settings > API Keys**

### Step 2: Environment Configuration
Your `.env.local` is already configured. Just add your API key:

```bash
# Add this line to your .env.local
APPWRITE_API_KEY=your_server_api_key_here
```

### Step 3: Database Structure Setup
Run the automated setup script:

```bash
# Make sure you have your APPWRITE_API_KEY in .env.local
node scripts/setup-appwrite.js
```

This script will create:
- Database: `rage-ecommerce`
- Collections: `products`, `collections`, `reviews`, `orders`, `users`, `cart_items`
- Storage bucket: `product_images`
- Indexes and permissions

### Step 4: Data Migration (Next Phase)
We'll create a migration script to move your static data to Appwrite.

## 🔧 Technical Stack

- **Database**: Appwrite Database (NoSQL)
- **Authentication**: Appwrite Auth
- **Storage**: Appwrite Storage (for product images)
- **API**: Next.js App Router API routes
- **Type Safety**: Full TypeScript integration

## 📊 Database Schema

### Products Collection
```typescript
{
  name: string,
  slug: string,
  category: 'Tops' | 'Bottoms' | 'Accessories',
  subCategory: 'Tshirts' | 'Vests' | 'Baby-tees' | 'Pants' | 'Shorts' | 'Bandanas',
  price: number,
  originalPrice?: number,
  rating: number,
  reviewCount: number,
  imageIds: string[],
  sizes: string[],
  colors: string[],
  description: string,
  details: string[],
  isFeatured: boolean,
  isTrending: boolean
}
```

### Users Collection
```typescript
{
  email: string,
  name: string,
  addresses: Address[],
  wishlist: string[]
}
```

### Orders Collection
```typescript
{
  userId: string,
  items: OrderItem[],
  total: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  shippingAddress: Address
}
```

## 🌟 Next Steps (Phase 2)

1. **Data Migration**: Move static data to Appwrite
2. **Update Components**: Connect UI to real API
3. **User Authentication**: Add login/register pages
4. **Admin Dashboard**: Connect to real data
5. **Payment Integration**: Stripe/Razorpay setup
6. **Real-time Features**: Cart synchronization

## 🔒 Security Features

- **Authentication**: Built-in user management
- **Permissions**: Role-based access control
- **API Security**: Server-side validation
- **Data Privacy**: GDPR compliant
- **File Security**: Secure file uploads

## 🚀 Advantages of Appwrite

✅ **Rapid Development** - Backend as a Service  
✅ **Real-time** - Live updates for cart, orders  
✅ **Scalable** - Handles growth automatically  
✅ **Secure** - Built-in authentication & permissions  
✅ **TypeScript Native** - Full type safety  
✅ **Self-hostable** - Own your data  
✅ **Admin Dashboard** - Built-in database management  

## 🐛 Troubleshooting

### Common Issues:
1. **"Project not found"** - Verify `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
2. **"Unauthorized"** - Check your `APPWRITE_API_KEY`
3. **"Collection not found"** - Run the setup script first
4. **CORS errors** - Add your domain to Appwrite console

### Need Help?
- Check Appwrite docs: https://appwrite.io/docs
- Review error logs in Appwrite console
- Verify environment variables

---

**Status**: ✅ Phase 1 Complete - Backend Infrastructure Ready  
**Next**: Phase 2 - Data Migration & Frontend Integration