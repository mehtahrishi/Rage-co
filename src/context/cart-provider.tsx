'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/auth-provider';
import { CartService, type AppwriteCartItem } from '@/services/cart';
import { ProductService } from '@/services/database';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load cart items from Appwrite when user is authenticated
  useEffect(() => {
    if (user) {
      loadCartFromAppwrite();
    } else {
      // Load from localStorage for non-authenticated users
      const savedCart = localStorage.getItem('rage_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [user]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('rage_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const loadCartFromAppwrite = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const appwriteCartItems = await CartService.getCartItems(user.$id);
      
      // Convert Appwrite cart items to CartItem format
      const cartItemsWithProducts = await Promise.all(
        appwriteCartItems.map(async (item: AppwriteCartItem) => {
          try {
            const product = await ProductService.getProduct(item.productId);
            return {
              id: item.$id,
              product,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            } as CartItem;
          } catch (error) {
            console.error('Error loading product for cart item:', error);
            return null;
          }
        })
      );
      
      // Filter out null items (products that couldn't be loaded)
      const validCartItems = cartItemsWithProducts.filter(item => item !== null) as CartItem[];
      setCartItems(validCartItems);
    } catch (error) {
      console.error('Error loading cart from Appwrite:', error);
      toast({
        title: "Error",
        description: "Failed to load your cart items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: Product, size: string, color: string) => {
    if (user) {
      // Add to Appwrite for authenticated users
      try {
        await CartService.addToCart(user.$id, product.$id, size, color, 1);
        await loadCartFromAppwrite(); // Reload cart to get updated data
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Error",
          description: "Failed to add item to cart.",
          variant: "destructive"
        });
      }
    } else {
      // Add to localStorage for non-authenticated users
      setCartItems(prevItems => {
        const existingItem = prevItems.find(
          item => item.product.$id === product.$id && item.size === size && item.color === color
        );

        if (existingItem) {
          return prevItems.map(item =>
            item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          const newItem: CartItem = {
            id: `${product.$id}-${size}-${color}`,
            product,
            size,
            color,
            quantity: 1,
          };
          return [...prevItems, newItem];
        }
      });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const removeItem = async (itemId: string) => {
    if (user) {
      // Remove from Appwrite for authenticated users
      try {
        await CartService.removeFromCart(itemId);
        await loadCartFromAppwrite(); // Reload cart to get updated data
        toast({
          title: "Item Removed",
          description: "The item has been removed from your cart.",
          variant: "destructive"
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: "Error",
          description: "Failed to remove item from cart.",
          variant: "destructive"
        });
      }
    } else {
      // Remove from localStorage for non-authenticated users
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
        variant: "destructive"
      });
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    if (user) {
      // Update in Appwrite for authenticated users
      try {
        await CartService.updateCartItemQuantity(itemId, quantity);
        await loadCartFromAppwrite(); // Reload cart to get updated data
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        toast({
          title: "Error",
          description: "Failed to update item quantity.",
          variant: "destructive"
        });
      }
    } else {
      // Update in localStorage for non-authenticated users
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      // Clear from Appwrite for authenticated users
      try {
        await CartService.clearCart(user.$id);
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast({
          title: "Error",
          description: "Failed to clear cart.",
          variant: "destructive"
        });
      }
    } else {
      // Clear localStorage for non-authenticated users
      setCartItems([]);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
