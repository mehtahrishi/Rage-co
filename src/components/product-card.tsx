import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FlipHorizontal } from 'lucide-react';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ImageService } from '@/services/image';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Try to get image from Appwrite first, then fallback to placeholder
  const getImageUrl = (index: number = 0) => {
    if (product.imageIds?.[index]) {
      const appwriteUrl = ImageService.getImageUrl(product.imageIds[index]);
      if (appwriteUrl) return appwriteUrl;
    }
    // Fallback to placeholder images
    const placeholderImage = PlaceHolderImages.find((img) => img.id === product.imageIds?.[index]);
    return placeholderImage?.imageUrl || '/placeholder.jpg';
  };

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent the link from navigating when flipping
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const firstImageUrl = getImageUrl(0);
  const secondImageUrl = product.imageIds?.length > 1 ? getImageUrl(1) : firstImageUrl;
  
  const firstPlaceholderImage = PlaceHolderImages.find((img) => img.id === product.imageIds?.[0]);
  const secondPlaceholderImage = product.imageIds?.length > 1 
    ? PlaceHolderImages.find((img) => img.id === product.imageIds?.[1])
    : firstPlaceholderImage;

  const onSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="overflow-hidden h-full flex flex-col">
        <div 
          className="relative aspect-[4/5] p-0"
        >
          <div className={cn(
            "relative w-full h-full transition-transform duration-700",
            "transform-style-preserve-3d",
            isFlipped ? "rotate-y-180" : ""
          )}>
            {/* Front Image (First Image) */}
            <div className={cn(
              "absolute inset-0 backface-hidden",
              isFlipped ? "invisible" : "visible"
            )}>
              <Image
                src={firstImageUrl}
                alt={product.name}
                fill
                className="object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                data-ai-hint={firstPlaceholderImage?.imageHint || product.name}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            
            {/* Back Image (Second Image) */}
            <div className={cn(
              "absolute inset-0 backface-hidden rotate-y-180",
              isFlipped ? "visible" : "invisible"
            )}>
              <Image
                src={secondImageUrl}
                alt={`${product.name} - Back View`}
                fill
                className="object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                data-ai-hint={secondPlaceholderImage?.imageHint || `${product.name} back view`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          </div>
          
          {/* Flip Icon */}
          <div 
            className="absolute bottom-3 right-3 bg-black bg-opacity-30 rounded-full p-1.5 z-10 cursor-pointer"
            onClick={handleFlip}
          >
            <FlipHorizontal className="h-4 w-4 text-white" />
          </div>
          
          {onSale && (
            <Badge variant="destructive" className="absolute left-3 top-3 z-10">
              Sale
            </Badge>
          )}
        </div>
        <div className="flex-col items-start gap-2 pt-4 flex-1">
          <h3 className="font-semibold text-sm leading-tight group-hover:underline">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 text-sm">
            <p
              className={cn(
                'font-semibold',
                onSale && 'text-destructive'
              )}
            >
              ₹{product.price.toFixed(2)}
            </p>
            {onSale && (
              <p className="text-muted-foreground line-through">
                ₹{product.originalPrice?.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}