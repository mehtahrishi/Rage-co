import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter } from './ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = PlaceHolderImages.find((img) => img.id === product.imageIds[0]);
  const onSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/5] p-0">
          {firstImage && (
            <Image
              src={firstImage.imageUrl}
              alt={product.name}
              fill
              className="object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
              data-ai-hint={firstImage.imageHint}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
          {onSale && (
            <Badge variant="destructive" className="absolute left-3 top-3">
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

    