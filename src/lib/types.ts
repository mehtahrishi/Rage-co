import type { Models } from 'appwrite';

// Appwrite document interface
export interface AppwriteDocument extends Models.Document {
  // no need to redeclare $id, etc. they are in Models.Document
}

export interface Product extends AppwriteDocument {
  name: string;
  category: 'Tops' | 'Bottoms' | 'Accessories';
  subCategory: 'Tshirts' | 'Vests' | 'Baby-tees' | 'Pants' | 'Shorts' | 'Bandanas';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageIds: string[];
  sizes: string[];
  colors: string[];
  description: string;
  details: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  slug: string;
}

export interface Collection extends AppwriteDocument {
  title: string;
  handle: string;
  imageId: string;
}

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

export interface Review extends AppwriteDocument {
  name: string;
  rating: number;
  review: string;
  productName: string;
  productId: string;
}

// User profile interface
export interface UserProfile extends AppwriteDocument {
  email: string;  
  name: string;
  addresses: Address[];
  wishlist: string[];
}

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order extends AppwriteDocument {
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}
