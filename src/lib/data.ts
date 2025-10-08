import type { Product, Collection, Review } from '@/lib/types';

export const collections: Collection[] = [
  { id: '1', title: 'Pants', handle: 'Pants', imageId: 'category-pants' },
  { id: '2', title: 'Vests', handle: 'Vests', imageId: 'category-vests' },
  { id: '3', title: 'T-Shirts', handle: 'Tshirts', imageId: 'category-tshirts' },
  { id: '5', title: 'Baby Tees', handle: 'Baby-tees', imageId: 'category-baby-tees' },
  { id: '6', title: 'Shorts', handle: 'Shorts', imageId: 'category-shorts' },
  { id: '7', title: 'Long Sleeves', handle: 'Long Sleeves', imageId: 'category-long-sleeves' },
];

export const products: Product[] = [];

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Alex T.',
    rating: 5,
    review: 'The quality is insane. The fabric on these pants is tough but comfortable. Worth every penny!',
    productName: 'Gravity Cargo Pants',
  },
  {
    id: '2',
    name: 'Jenna M.',
    rating: 5,
    review: 'Finally, a baby tee that actually fits well and feels great. So soft!',
    productName: 'Cropped Baby Tee',
  },
  {
    id: '3',
    name: 'Carlos R.',
    rating: 4,
    review: 'This vest is my new go-to. It has so many useful pockets. Perfect for layering.',
    productName: 'Utility Vest',
  },
  {
    id: '4',
    name: 'Aisha K.',
    rating: 5,
    review: 'Obsessed with this bandana! The pattern is so cool and the fabric is really high quality. Got so many compliments!',
    productName: 'Patterned Bandana',
  },
  {
    id: '5',
    name: 'Mike P.',
    rating: 5,
    review: 'This is not just a t-shirt, it is a statement. The material is thick and the fit is perfect. Great for city life.',
    productName: 'Asymmetric Tee',
  },
];
