
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { collections, products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 8);
  const featuredCollections = collections.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="group relative h-[60vh] w-full md:h-[80vh]">
        <Image
          src="/hero-banner.jpg"
          alt="Rage fashion banner"
          fill
          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <div className='flex-1 flex flex-col items-center justify-center'>
            {/* Content moved to announcement bar */}
          </div>
          <div className="pb-8">
            <Button asChild variant="ghost" size="lg" className="hover:bg-transparent text-white">
              <Link href="/products">
                Explore <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuredCollections.map((collection, index) => {
            const image = PlaceHolderImages.find((img) => img.id === collection.imageId);
            return (
              <Link href={`/products?collection=${collection.handle}`} key={collection.id}>
                <Card className={cn("overflow-hidden border-2 transition-all hover:shadow-xl hover:-translate-y-1",
                    index === 0 && "md:col-span-1",
                    index === 1 && "md:col-span-1",
                    index === 2 && "md:col-span-1"
                )}>
                  <CardHeader className="relative h-96 p-0">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={collection.title}
                        fill
                        className="object-cover grayscale transition-transform duration-300 hover:scale-105"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <CardTitle className="absolute bottom-4 left-4 font-headline text-3xl text-primary-foreground">
                      {collection.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
