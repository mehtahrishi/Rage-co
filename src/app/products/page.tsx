'use client'
import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSearchParams } from 'next/navigation';

function ProductGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const filteredProducts = category ? products.filter(p => p.category === category) : products;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


export default function ProductsPage() {
  const allSizes = [...new Set(products.flatMap(p => p.sizes))];
  const allColors = [...new Set(products.flatMap(p => p.colors))];

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
          All Products
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
          Explore our entire collection of next-gen apparel and accessories.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <h2 className="font-headline text-2xl font-bold">Filters</h2>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-4">Category</h3>
              <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="cat-all"/>
                      <Label htmlFor="cat-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="men" id="cat-men"/>
                      <Label htmlFor="cat-men">Men</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                      <RadioGroupItem value="women" id="cat-women"/>
                      <Label htmlFor="cat-women">Women</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accessories" id="cat-accessories"/>
                      <Label htmlFor="cat-accessories">Accessories</Label>
                  </div>
              </RadioGroup>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-semibold mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {allSizes.map(size => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox id={`size-${size}`} />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="font-semibold mb-4">Color</h3>
              <div className="space-y-2">
                {allColors.map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox id={`color-${color}`} />
                    <Label htmlFor={`color-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-4">Price Range</h3>
              <Slider defaultValue={[500]} max={1000} step={10} />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductGrid />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
