#!/usr/bin/env node

/**
 * Appwrite Database Setup Script
 * 
 * This script helps you set up the database structure for the RAGE e-commerce app.
 * Run this script after setting up your Appwrite project.
 * 
 * Usage: node scripts/setup-appwrite.js
 */

// Load environment variables from .env file
require('dotenv').config();

const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');

// Configuration
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY; // Server API key (get from Appwrite console)

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY must be set');
  process.exit(1);
}

// Initialize Appwrite
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'rage-ecommerce';
const COLLECTIONS = {
  PRODUCTS: 'products',
  COLLECTIONS: 'collections',
  REVIEWS: 'reviews',
  ORDERS: 'orders',
  USERS: 'users',
  CART_ITEMS: 'cart_items',
};

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Appwrite database...\n');

    // Create database
    console.log('📦 Creating database...');
    try {
      await databases.create(DATABASE_ID, 'RAGE E-commerce Database');
      console.log('✅ Database created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists');
      } else {
        throw error;
      }
    }

    // Create collections
    await createProductsCollection();
    await createCollectionsCollection();
    await createReviewsCollection();
    await createOrdersCollection();
    await createUsersCollection();
    await createCartItemsCollection();

    // Create storage buckets
    await createStorageBuckets();

    console.log('\n🎉 Appwrite setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env.local file with the database ID:');
    console.log(`   NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`);
    console.log('2. Run the data migration script to populate initial data');
    console.log('3. Test the API endpoints');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

async function createProductsCollection() {
  console.log('📄 Creating products collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      'Products',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    // Create attributes
    const attributes = [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'category', type: 'string', size: 50, required: true },
      { key: 'subCategory', type: 'string', size: 50, required: true },
      { key: 'price', type: 'double', required: true },
      { key: 'originalPrice', type: 'double', required: false },
      { key: 'rating', type: 'double', required: true, default: 0 },
      { key: 'reviewCount', type: 'integer', required: true, default: 0 },
      { key: 'imageIds', type: 'string', size: 1000, array: true, required: true },
      { key: 'sizes', type: 'string', size: 10, array: true, required: true },
      { key: 'colors', type: 'string', size: 50, array: true, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'details', type: 'string', size: 500, array: true, required: true },
      { key: 'isFeatured', type: 'boolean', required: false, default: false },
      { key: 'isTrending', type: 'boolean', required: false, default: false },
    ];

    for (const attr of attributes) {
      try {
        if (attr.array) {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, attr.key, attr.size, attr.required, attr.default, true);
        } else if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, attr.key, attr.size, attr.required, attr.default);
        } else if (attr.type === 'double') {
          await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, attr.key, attr.required, attr.min, attr.max, attr.default);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, attr.key, attr.required, attr.min, attr.max, attr.default);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, attr.key, attr.required, attr.default);
        }
        
        // Wait a bit between attribute creations
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 409) { // Ignore if attribute already exists
          console.warn(`⚠️  Warning creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create indexes
    try {
      await databases.createIndex(DATABASE_ID, COLLECTIONS.PRODUCTS, 'slug_index', 'key', ['slug'], ['asc']);
      await databases.createIndex(DATABASE_ID, COLLECTIONS.PRODUCTS, 'category_index', 'key', ['category'], ['asc']);
      await databases.createIndex(DATABASE_ID, COLLECTIONS.PRODUCTS, 'featured_index', 'key', ['isFeatured'], ['desc']);
    } catch (error) {
      if (error.code !== 409) {
        console.warn('⚠️  Warning creating indexes:', error.message);
      }
    }

    console.log('✅ Products collection created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Products collection already exists');
    } else {
      throw error;
    }
  }
}

async function createCollectionsCollection() {
  console.log('📄 Creating collections collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.COLLECTIONS,
      'Collections',
      [Permission.read(Role.any())]
    );

    const attributes = [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'handle', type: 'string', size: 255, required: true },
      { key: 'imageId', type: 'string', size: 255, required: true },
    ];

    for (const attr of attributes) {
      try {
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COLLECTIONS, attr.key, attr.size, attr.required);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 409) {
          console.warn(`⚠️  Warning creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('✅ Collections collection created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Collections collection already exists');
    } else {
      throw error;
    }
  }
}

async function createReviewsCollection() {
  console.log('📄 Creating reviews collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.REVIEWS,
      'Reviews',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    const attributes = [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'rating', type: 'integer', required: true, min: 1, max: 5 },
      { key: 'review', type: 'string', size: 2000, required: true },
      { key: 'productName', type: 'string', size: 255, required: true },
      { key: 'productId', type: 'string', size: 255, required: true },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, attr.key, attr.size, attr.required);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, attr.key, attr.required, attr.min, attr.max);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 409) {
          console.warn(`⚠️  Warning creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('✅ Reviews collection created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Reviews collection already exists');
    } else {
      throw error;
    }
  }
}

async function createOrdersCollection() {
  console.log('📄 Creating orders collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      'Orders',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ]
    );

    const attributes = [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'total', type: 'double', required: true },
      { key: 'status', type: 'string', size: 50, required: true, default: 'pending' },
      { key: 'items', type: 'string', size: 5000, required: true }, // JSON string
      { key: 'shippingAddress', type: 'string', size: 2000, required: true }, // JSON string
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDERS, attr.key, attr.size, attr.required, attr.default);
        } else if (attr.type === 'double') {
          await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ORDERS, attr.key, attr.required);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 409) {
          console.warn(`⚠️  Warning creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('✅ Orders collection created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Orders collection already exists');
    } else {
      throw error;
    }
  }
}

async function createUsersCollection() {
  console.log('📄 Creating users collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.USERS,
      'Users',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ]
    );

    const attributes = [
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'addresses', type: 'string', size: 5000, required: false }, // JSON string
      { key: 'wishlist', type: 'string', size: 100, array: true, required: false },
    ];

    for (const attr of attributes) {
      try {
        if (attr.array) {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, attr.key, attr.size, attr.required, attr.default, true);
        } else {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, attr.key, attr.size, attr.required, attr.default);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 409) {
          console.warn(`⚠️  Warning creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('✅ Users collection created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Users collection already exists');
    } else {
      throw error;
    }
  }
}

async function createCartItemsCollection() {
  console.log('📄 Creating cart items collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.CART_ITEMS,
      'Cart Items',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    const attributes = [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'productId', type: 'string', size: 255, required: true },
      { key: 'quantity', type: 'integer', required: true, min: 1 },
      { key: 'size', type: 'string', size: 10, required: true },
      { key: 'color', type: 'string', size: 50, required: true },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.CART_ITEMS, attr.key, attr.size, attr.required);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.CART_ITEMS, attr.key, attr.required, attr.min, attr.max);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code !== 409) {
          console.warn(`⚠️  Warning creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('✅ Cart Items collection created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Cart Items collection already exists');
    } else {
      throw error;
    }
  }
}

async function createStorageBuckets() {
  console.log('🗄️  Creating storage buckets...');
  
  try {
    await storage.createBucket(
      'product_images',
      'Product Images',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // not encrypted
      false, // not antivirus
      10 * 1024 * 1024, // 10MB max file size
      ['jpg', 'jpeg', 'png', 'webp'], // allowed extensions
      'gzip', // compression
      false, // not encryption
      false // not antivirus
    );
    console.log('✅ Product images bucket created');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Product images bucket already exists');
    } else {
      console.warn('⚠️  Warning creating storage bucket:', error.message);
    }
  }
}

// Run the setup
setupDatabase();