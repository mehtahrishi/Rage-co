
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { cn } from '@/lib/utils';

const categories = [
  { name: "PANT'S", href: '/products?category=pants' },
  { name: "VEST'S", href: '/products?category=vests' },
  { name: "TSHIRT'S", href: '/products?category=tshirts' },
  { name: "LONG SLEEVE'S", href: '/products?category=long-sleeves' },
  { name: "BABY TEE'S", href: '/products?category=baby-tees' },
];

const PantsIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2"
      fill="currentColor"
    >
      <path d="M25 10 L75 10 L80 90 L55 90 L55 50 Q 50 45 45 50 L45 90 L20 90 Z" />
    </svg>
  );

const VestIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2"
    >
        <g fill="currentColor">
            <path d=" M60 20 Q70 10 100 10 Q130 10 140 20 L160 40 L160 180 L40 180 L40 40 L60 20 Z" />
            <path d=" M80 20 Q100 60 120 20 Z" fill="var(--background)" />
        </g>
    </svg>
);

const TshirtIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 -64 640 640"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2"
        fill="currentColor"
    >
        <path d="M631.2 96.5L436.5 0C416.4 27.8 371.9 47.2 320 47.2S223.6 27.8 203.5 0L8.8 96.5c-7.9 4-11.1 13.6-7.2 21.5l57.2 114.5c4 7.9 13.6 11.1 21.5 7.2l56.6-27.7c10.6-5.2 23 2.5 23 14.4V480c0 17.7 14.3 32 32 32h256c17.7 0 32-14.3 32-32V226.3c0-11.8 12.4-19.6 23-14.4l56.6 27.7c7.9 4 17.5.8 21.5-7.2L638.3 118c4-7.9.8-17.6-7.1-21.5z"/>
    </svg>
);

export default function HomePage() {
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 8);
  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="group relative h-[40vh] w-full md:h-[80vh]">
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

      {/* Category Navigation Section */}
      <section className="container mx-auto px-4">
        <nav className="flex justify-center items-center gap-6 md:gap-8 border-b">
          {categories.map((category) => (
             <Link
              key={category.name}
              href={category.href}
              onClick={() => setActiveCategory(category.name)}
              className={cn(
                'relative flex items-center py-4 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
                activeCategory === category.name && 'text-foreground'
              )}
            >
              {activeCategory === category.name && category.name === "PANT'S" && <PantsIcon />}
              {activeCategory === category.name && category.name === "VEST'S" && <VestIcon />}
              {activeCategory === category.name && category.name === "TSHIRT'S" && <TshirtIcon />}
              {category.name}
              {activeCategory === category.name && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </Link>
          ))}
        </nav>
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
