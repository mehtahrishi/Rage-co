import type { PlaceHolderImages } from "./placeholder-images";

export type Product = {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms';
  subCategory: 'Pants' | 'Vests' | 'Tshirts' | 'Long-sleeves' | 'Baby-tees' | 'Skirts';
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
};

export type Collection = {
    id: string;
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
