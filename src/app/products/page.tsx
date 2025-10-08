'use client'
import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { ProductService } from '@/services/database';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];
const ALL_COLORS = ['Black', 'White', 'Olive', 'Charcoal', 'Heather Grey', 'Khaki', 'Pastel Pink', 'Red', 'Blue', 'Paisley Black'];
const MAX_PRICE = 3000;

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');
  const sizes = searchParams.getAll('size');
  const colors = searchParams.getAll('color');
  const maxPrice = searchParams.get('maxPrice');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filters = {
          category: searchParams.get('category') || undefined,
          subCategory: searchParams.get('subCategory') || undefined,
          maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
          sizes: searchParams.getAll('size'),
          colors: searchParams.getAll('color'),
        };
        const [fetchedProducts, count] = await Promise.all([
          ProductService.getProducts(filters),
          ProductService.countProducts(filters),
        ]);
        setProducts(fetchedProducts);
        setTotalCount(count);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('category');
      params.delete('subCategory');
    } else {
      params.set('category', value);
      params.delete('subCategory');
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

  const removeFilter = (filterType: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (filterType === 'category') {
      params.delete('category');
      params.delete('subCategory');
    } else if (filterType === 'size' && value) {
      const currentSizes = params.getAll('size');
      params.delete('size');
      currentSizes.filter(s => s !== value).forEach(s => params.append('size', s));
    } else if (filterType === 'color' && value) {
      const currentColors = params.getAll('color');
      params.delete('color');
      currentColors.filter(c => c !== value).forEach(c => params.append('color', c));
    } else if (filterType === 'price') {
      params.delete('maxPrice');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  }

  const currentMaxPrice = Number(searchParams.get('maxPrice') || MAX_PRICE);

  const getCategoryValue = () => {
    if(categoryParam === 'Tops' || categoryParam === 'Bottoms' || categoryParam === 'Accessories') return categoryParam;
    return 'all';
  }

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filters = [];
    
    if (categoryParam) {
      filters.push({ type: 'category', value: categoryParam, label: categoryParam });
    }
    
    sizes.forEach(size => {
      filters.push({ type: 'size', value: size, label: `Size: ${size}` });
    });
    
    colors.forEach(color => {
      filters.push({ type: 'color', value: color, label: `Color: ${color}` });
    });
    
    if (searchParams.get('maxPrice')) {
      filters.push({ type: 'price', value: 'price', label: `Under ₹${currentMaxPrice}` });
    }
    
    return filters;
  }, [categoryParam, sizes, colors, searchParams]);

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

      {/* Top Filters Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <Select value={getCategoryValue()} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tops">Tops</SelectItem>
                <SelectItem value="Bottoms">Bottoms</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 hidden md:block text-center text-sm text-muted-foreground">
            Available {isLoading ? '...' : totalCount} products
          </div>

          {/* Price Filter - Moved to Right Corner */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Price:</span>
            <Slider 
              value={[currentMaxPrice]} 
              max={MAX_PRICE} 
              step={10} 
              onValueChange={handlePriceChange} 
              className="w-32"
            />
            <span className="text-sm w-16">₹{currentMaxPrice}</span>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <div 
                key={index} 
                className="flex items-center bg-muted rounded-full px-3 py-1 text-sm"
              >
                <span>{filter.label}</span>
                <button 
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="ml-2 rounded-full hover:bg-muted-foreground/20 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button variant="ghost" onClick={clearFilters} className="text-sm h-7">
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <main>
        {isLoading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.$id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters or check back later.</p>
            <Button onClick={clearFilters} className="mt-6">Clear Filters</Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsContent />;
}