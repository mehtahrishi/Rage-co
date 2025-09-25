'use client'
import { Suspense, useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const sizes = searchParams.getAll('size');
  const colors = searchParams.getAll('color');
  const maxPrice = searchParams.get('maxPrice');

  const allSizes = [...new Set(products.flatMap(p => p.sizes))];
  const allColors = [...new Set(products.flatMap(p => p.colors))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const categoryMatch = !category || category === 'all' || p.category === category;
      const subCategoryMatch = !subCategory || subCategory === 'all' || p.subCategory === subCategory;
      const sizeMatch = sizes.length === 0 || p.sizes.some(s => sizes.includes(s));
      const colorMatch = colors.length === 0 || p.colors.some(c => colors.includes(c));
      const priceMatch = !maxPrice || p.price <= Number(maxPrice);
      return categoryMatch && subCategoryMatch && sizeMatch && colorMatch && priceMatch;
    });
  }, [category, subCategory, sizes, colors, maxPrice]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleMultiCheckboxChange = (group: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(group);
    if (checked) {
      if (!currentValues.includes(value)) {
        params.append(group, value);
      }
    } else {
      params.delete(group);
      currentValues.filter(v => v !== value).forEach(v => params.append(group, v));
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handlePriceChange = (value: number[]) => {
    const params = new URLSearchParams(searchParams);
    params.set('maxPrice', String(value[0]));
    router.replace(`${pathname}?${params.toString()}`);
  }
  
  const clearFilters = () => {
    router.replace(pathname);
  }

  const maxProductPrice = useMemo(() => Math.max(...products.map(p => p.price)), []);
  const currentMaxPrice = Number(searchParams.get('maxPrice') || maxProductPrice);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5.xl">
          All Products
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
          Explore our entire collection of next-gen apparel.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="font-headline text-2xl font-bold">Filters</h2>
              <Button variant="ghost" onClick={clearFilters} className="text-sm">Clear All</Button>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-4">Category</h3>
              <RadioGroup value={category || 'all'} onValueChange={handleCategoryChange}>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="cat-all"/>
                      <Label htmlFor="cat-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Tops" id="cat-tops"/>
                      <Label htmlFor="cat-tops">Tops</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Bottoms" id="cat-bottoms"/>
                      <Label htmlFor="cat-bottoms">Bottoms</Label>
                  </div>
              </RadioGroup>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-semibold mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {allSizes.map(size => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox id={`size-${size}`} checked={sizes.includes(size)} onCheckedChange={(checked) => handleMultiCheckboxChange('size', size, !!checked)}/>
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
                    <Checkbox id={`color-${color}`} checked={colors.includes(color)} onCheckedChange={(checked) => handleMultiCheckboxChange('color', color, !!checked)} />
                    <Label htmlFor={`color-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-4">Price Range</h3>
              <Slider value={[maxPrice ? Number(maxPrice) : maxProductPrice]} max={maxProductPrice} step={100} onValueChange={handlePriceChange} />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹0</span>
                <span>₹{maxPrice ? Number(maxPrice) : maxProductPrice}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="text-center">Loading products...</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
