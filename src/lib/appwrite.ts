import { Account, Client, Databases, Storage, Query, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export client for custom usage
export { client, Query, ID };

// Configuration constants
export const CONFIG = {
  DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  COLLECTIONS: {
    PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS!,
    COLLECTIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COLLECTIONS!,
    REVIEWS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REVIEWS!,
    ORDERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ORDERS!,
    USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS!,
    CART_ITEMS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CART_ITEMS!,
  },
  BUCKETS: {
    PRODUCT_IMAGES: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_PRODUCT_IMAGES!,
  },
};

// Helper functions for common operations
export const appwriteConfig = {
  client,
  account,
  databases,
  storage,
  CONFIG,
};

export default appwriteConfig;