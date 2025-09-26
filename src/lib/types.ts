export type Product = {
  id: string;
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

export type Review = {
  id: string;
  name: string;
  rating: number;
  review: string;
  productName: string;
};
