import { databases, CONFIG, ID, Query } from '@/lib/appwrite';
import type { Models } from 'appwrite';

export interface AppwriteCartItem extends Models.Document {
    userId: string;
    productId: string;
    quantity: number;
    size: string;
    color: string;
}

export class CartService {
    // Get cart items for current user
    static async getCartItems(userId: string): Promise<AppwriteCartItem[]> {
        try {
            const response = await databases.listDocuments(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTIONS.CART_ITEMS,
                [Query.equal('userId', userId)]
            );
            return response.documents as unknown as AppwriteCartItem[];
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }

    // Add item to cart
    static async addToCart(userId: string, productId: string, size: string, color: string, quantity: number = 1): Promise<AppwriteCartItem> {
        try {
            // Check if item already exists
            const existingItems = await databases.listDocuments(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTIONS.CART_ITEMS,
                [
                    Query.equal('userId', userId),
                    Query.equal('productId', productId),
                    Query.equal('size', size),
                    Query.equal('color', color)
                ]
            );

            if (existingItems.documents.length > 0) {
                // Update existing item quantity
                const existingItem = existingItems.documents[0] as unknown as AppwriteCartItem;
                return await this.updateCartItemQuantity(existingItem.$id, existingItem.quantity + quantity);
            } else {
                // Create new cart item
                const cartItem = await databases.createDocument(
                    CONFIG.DATABASE_ID,
                    CONFIG.COLLECTIONS.CART_ITEMS,
                    ID.unique(),
                    {
                        userId,
                        productId,
                        size,
                        color,
                        quantity
                    }
                );
                return cartItem as unknown as AppwriteCartItem;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    // Update cart item quantity
    static async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<AppwriteCartItem> {
        try {
            const updatedItem = await databases.updateDocument(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTIONS.CART_ITEMS,
                cartItemId,
                { quantity }
            );
            return updatedItem as unknown as AppwriteCartItem;
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            throw error;
        }
    }

    // Remove item from cart
    static async removeFromCart(cartItemId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTIONS.CART_ITEMS,
                cartItemId
            );
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    // Clear entire cart
    static async clearCart(userId: string): Promise<void> {
        try {
            const cartItems = await this.getCartItems(userId);

            // Delete all cart items for the user
            const deletePromises = cartItems.map(item =>
                databases.deleteDocument(
                    CONFIG.DATABASE_ID,
                    CONFIG.COLLECTIONS.CART_ITEMS,
                    item.$id
                )
            );

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}