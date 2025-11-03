'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Star, X } from 'lucide-react';

import type { Product } from '@/lib/types';
import { ProductService } from '@/services/database';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ImageService } from '@/services/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCart } from '@/hooks/use-cart';
import { ProductCard } from '@/components/product-card';
import { CustomLoader } from '@/components/custom-loader';

export default function ProductPage() {
  const params = useParams();
  const slug = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [activeImageId, setActiveImageId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await ProductService.getProductBySlug(slug);
        setProduct(fetchedProduct);
        setActiveImageId(fetchedProduct.imageIds[0]);

        if (fetchedProduct.subCategory) {
          const allProducts = await ProductService.getProducts({ subCategory: fetchedProduct.subCategory });
          const related = allProducts.filter(p => p.$id !== fetchedProduct.$id).slice(0, 4);
          setRelatedProducts(related);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  if (isLoading || showLoader) {
    return <CustomLoader onLoadingComplete={handleLoadingComplete} />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }
  
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color.');
      return;
    }

    if (isAddingToCart) return; // Prevent multiple clicks

    setIsAddingToCart(true);
    try {
      await addItem(product, selectedSize, selectedColor);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Create image objects that work with both Appwrite and placeholder images
  const productImages = product.imageIds.map((id, index) => {
    // Try to get Appwrite image first
    const appwriteUrl = ImageService.getImageUrl(id);
    if (appwriteUrl) {
      return {
        id,
        imageUrl: appwriteUrl,
        description: `${product.name} - Image ${index + 1}`,
        imageHint: `${product.name} product image`
      };
    }
    // Fallback to placeholder image
    const placeholderImage = PlaceHolderImages.find((img) => img.id === id);
    return placeholderImage || {
      id,
      imageUrl: '/placeholder.jpg',
      description: `${product.name} - Image ${index + 1}`,
      imageHint: `${product.name} product image`
    };
  });
    
  const activeImage = productImages.find((img) => img.id === activeImageId) || productImages[0];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-6xl mx-auto">
        {/* Image Gallery */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative aspect-[1/1] w-full sm:w-3/4 md:w-1/2 overflow-hidden rounded-lg cursor-pointer" onClick={openModal}>
            {activeImage && (
              <Image
                src={activeImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover grayscale"
                data-ai-hint={activeImage.imageHint}
              />
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto py-2 w-full justify-center">
            {productImages.map((image) => (
              <button 
                key={image.id} 
                className={cn("relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border-2", activeImageId === image.id ? 'border-primary' : 'border-transparent')} 
                onClick={() => setActiveImageId(image.id)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover grayscale"
                  data-ai-hint={image.imageHint}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4 md:pl-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">{product.category}</p>
            <h1 className="mt-1 font-headline text-2xl font-bold md:text-3xl">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-sans text-2xl font-bold">₹{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.round(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/50'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">({product.reviewCount} reviews)</p>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>

          {/* Size Selector */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Size</h3>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
            >
              {product.sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem
                    value={size}
                    id={`size-${size}`}
                    className="peer sr-only"
                    aria-label={size}
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-xs transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Color</h3>
            <RadioGroup
              value={selectedColor}
              onValueChange={setSelectedColor}
              className="flex flex-wrap gap-2"
            >
              {product.colors.map((color) => (
                <div key={color}>
                  <RadioGroupItem
                    value={color}
                    id={`color-${color}`}
                    className="peer sr-only"
                    aria-label={color}
                  />
                  <Label
                    htmlFor={`color-${color}`}
                    className="cursor-pointer rounded-md border px-3 py-1.5 text-xs transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-row gap-3 w-full">
            <Button
              size="default"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize || isAddingToCart}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size="default"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href="/cart">Go to Cart</Link>
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm">Product Details</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-1 pl-4 text-muted-foreground text-sm">
                  {product.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm">Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground text-sm">Free shipping on orders over ₹5000. We offer a 30-day return policy for a full refund or exchange.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-12">
         <h2 className="mb-6 text-center font-headline text-2xl font-bold uppercase tracking-wider">
          You Might Also Like
        </h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => <ProductCard key={p.$id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No related products found.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button 
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Left Arrow */}
            <button 
              className="absolute left-2 md:left-4 top-1/2 z-10 bg-black bg-opacity-50 rounded-full p-1.5 md:p-2 text-white hover:bg-opacity-75 transition-all transform -translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = productImages.findIndex(img => img.id === activeImageId);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : productImages.length - 1;
                setActiveImageId(productImages[prevIndex].id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Right Arrow */}
            <button 
              className="absolute right-2 md:right-4 top-1/2 z-10 bg-black bg-opacity-50 rounded-full p-1.5 md:p-2 text-white hover:bg-opacity-75 transition-all transform -translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = productImages.findIndex(img => img.id === activeImageId);
                const nextIndex = currentIndex < productImages.length - 1 ? currentIndex + 1 : 0;
                setActiveImageId(productImages[nextIndex].id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="relative w-full h-[80vh] group">
              {activeImage && (
                <Image
                  src={activeImage.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint={activeImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}