'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Plus, Minus } from 'lucide-react';

import { products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.slug === params.id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [activeImageId, setActiveImageId] = useState<string | undefined>(product?.imageIds[0]);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addItem(product, selectedSize, selectedColor);
    } else {
      alert('Please select a size and color.');
    }
  };

  const productImages = product.imageIds
    .map((id) => PlaceHolderImages.find((img) => img.id === id))
    .filter(Boolean);
    
  const activeImage = PlaceHolderImages.find((img) => img.id === activeImageId);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2">
                {productImages.map((image) => image && (
                    <button key={image.id} className={cn("relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-md border-2", activeImageId === image.id ? 'border-primary' : 'border-transparent')} onClick={() => setActiveImageId(image.id)}>
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
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
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
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
            <h1 className="mt-1 font-headline text-4xl font-bold md:text-5xl">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-sans text-3xl font-bold">${product.price.toFixed(2)}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-5 w-5',
                    i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">({product.reviewCount} reviews)</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold">Size</h3>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
            >
              {product.sizes.map((size) => (
                <RadioGroupItem
                  key={size}
                  value={size}
                  id={`size-${size}`}
                  className="peer sr-only"
                  aria-label={size}
                />
                <Label
                  htmlFor={`size-${size}`}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {size}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Color Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold">Color</h3>
            <RadioGroup
              value={selectedColor}
              onValueChange={setSelectedColor}
              className="flex flex-wrap gap-2"
            >
              {product.colors.map((color) => (
                <RadioGroupItem
                  key={color}
                  value={color}
                  id={`color-${color}`}
                  className="peer sr-only"
                  aria-label={color}
                />
                <Label
                  htmlFor={`color-${color}`}
                  className="cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {color}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedSize}
          >
            Add to Cart
          </Button>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {product.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                Free shipping on orders over $50. We offer a 30-day return policy for a full refund or exchange.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-24">
         <h2 className="mb-8 text-center font-headline text-3xl font-bold uppercase tracking-wider md:text-4xl">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
