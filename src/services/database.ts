import { databases, CONFIG, Query, ID } from '@/lib/appwrite';
import type { Product, Collection, Review } from '@/lib/types';

// Helper function to transform Appwrite document to our types
const transformProduct = (doc: any): Product => ({
  ...doc,
  id: doc.$id,
});

const transformCollection = (doc: any): Collection => ({
  ...doc,
  id: doc.$id,
});

const transformReview = (doc: any): Review => ({
  ...doc,
  id: doc.$id,
});

// Product Database Operations
export class ProductService {
  
  // Get all products with optional filtering
  static async getProducts(filters?: {
    category?: string;
    subCategory?: string;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    limit?: number;
  }) {
    try {
      const queries = [];
      
      if (filters?.category && filters.category !== 'all') {
        queries.push(Query.equal('category', filters.category));
      }
      
      if (filters?.subCategory && filters.subCategory !== 'all') {
        queries.push(Query.equal('subCategory', filters.subCategory));
      }
      
      if (filters?.maxPrice) {
        queries.push(Query.lessThanEqual('price', filters.maxPrice));
      }
      
      if (filters?.limit) {
        queries.push(Query.limit(filters.limit));
      }

      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        queries
      );

      return response.documents.map(transformProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  static async getProduct(productId: string) {
    try {
      const response = await databases.getDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        productId
      );
      return transformProduct(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get product by slug
  static async getProductBySlug(slug: string) {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        [Query.equal('slug', slug)]
      );
      
      if (response.documents.length === 0) {
        throw new Error('Product not found');
      }
      
      return transformProduct(response.documents[0]);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit = 8) {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        [
          Query.equal('isFeatured', true),
          Query.limit(limit)
        ]
      );
      return response.documents.map(transformProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get trending products
  static async getTrendingProducts(limit = 8) {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        [
          Query.equal('isTrending', true),
          Query.limit(limit)
        ]
      );
      return response.documents.map(transformProduct);
    } catch (error) {
      console.error('Error fetching trending products:', error);
      throw error;
    }
  }

  // Admin: Create product
  static async createProduct(productData: any) {
    try {
      const response = await databases.createDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        ID.unique(),
        productData
      );
      return transformProduct(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Admin: Update product
  static async updateProduct(productId: string, productData: any) {
    try {
      const response = await databases.updateDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        productId,
        productData
      );
      return transformProduct(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Admin: Delete product
  static async deleteProduct(productId: string) {
    try {
      await databases.deleteDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        productId
      );
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

// Collection Database Operations
export class CollectionService {
  
  static async getCollections() {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.COLLECTIONS
      );
      return response.documents.map(transformCollection);
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  static async getCollection(collectionId: string) {
    try {
      const response = await databases.getDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.COLLECTIONS,
        collectionId
      );
      return transformCollection(response);
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  }
}

// Review Database Operations
export class ReviewService {
  
  static async getProductReviews(productId: string) {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.REVIEWS,
        [Query.equal('productId', productId)]
      );
      return response.documents.map(transformReview);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  static async createReview(reviewData: any) {
    try {
      const response = await databases.createDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.REVIEWS,
        ID.unique(),
        reviewData
      );
      return transformReview(response);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
}