export const navLinks = [
  {
    label: 'NEW ARRIVALS',
    href: '/products',
  },
  {
    label: 'TOPS',
    href: '/products?category=Tops',
    subCategories: [
      {
        title: 'T-Shirts',
        href: '/products?category=Tops&subCategory=Tshirts',
        description: 'Graphic and basic tees for everyday wear.',
      },
      {
        title: 'Vests',
        href: '/products?category=Tops&subCategory=Vests',
        description: 'Layer up with our stylish and functional vests.',
      },
      {
        title: 'Baby Tees',
        href: '/products?category=Tops&subCategory=Baby-tees',
        description: 'Cute and trendy cropped baby tees.',
      },
    ],
  },
  {
    label: 'BOTTOMS',
    href: '/products?category=Bottoms',
    subCategories: [
      {
        title: 'Pants',
        href: '/products?category=Bottoms&subCategory=Pants',
        description: 'From cargo pants to joggers, find your perfect fit.',
      },
      {
        title: 'Shorts',
        href: '/products?category=Bottoms&subCategory=Shorts',
        description: 'Comfortable shorts for warm weather.',
      },
    ],
  },
  {
    label: 'ACCESSORIES',
    href: '/products?category=Accessories',
    subCategories: [
      {
        title: 'Bandanas',
        href: '/products?category=Accessories&subCategory=Bandanas',
        description: 'Stylish bandanas to complete your look.',
      },
    ],
  },
];
