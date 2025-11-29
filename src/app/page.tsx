'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Bot, Smile } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

import { collections, reviews } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductService } from '@/services/database';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { BrandModel } from '@/components/brand-model';
import { TypewriterBrand } from '@/components/typewriter-brand';

const categories = [
  { name: "PANTS", href: '/products?category=Pants', key: 'Pants' },
  { name: "VESTS", href: '/products?category=Vests', key: 'Vests' },
  { name: "TSHIRTS", href: '/products?category=Tshirts', key: 'Tshirts' },
  { name: "BABY TEES", href: '/products?category=Baby-tees', key: 'Baby-tees' },
  { name: "SHORTS", href: '/products?category=Shorts', key: 'Shorts' },
  { name: "BANDANAS", href: '/products?category=Bandanas', key: 'Bandanas' },
];

const PantsIcon = () => (
  <motion.svg
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    width="16"
    height="16"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
    fill="currentColor"
  >
    <path d="M25 10 L75 10 L80 90 L55 90 L55 50 Q 50 45 45 50 L45 90 L20 90 Z" />
  </motion.svg>
);

const VestIcon = () => (
  <motion.svg
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    width="16"
    height="16"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
    fill="currentColor"
  >
    <g>
      <path d=" M60 20 Q70 10 100 10 Q130 10 140 20 L160 40 L160 180 L40 180 L40 40 L60 20 Z" />
      <path d=" M80 20 Q100 60 120 20 Z" fill="var(--background)" />
    </g>
  </motion.svg>
);

const TshirtIcon = () => (
  <motion.svg
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    width="16"
    height="16"
    viewBox="0 -64 640 640"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
    fill="currentColor"
  >
    <path d="M631.2 96.5L436.5 0C416.4 27.8 371.9 47.2 320 47.2S223.6 27.8 203.5 0L8.8 96.5c-7.9 4-11.1 13.6-7.2 21.5l57.2 114.5c4 7.9 13.6 11.1 21.5 7.2l56.6-27.7c10.6-5.2 23 2.5 23 14.4V480c0 17.7 14.3 32 32 32h256c17.7 0 32-14.3 32-32V226.3c0-11.8 12.4-19.6 23-14.4l56.6 27.7c7.9 4 17.5.8 21.5-7.2L638.3 118c4-7.9.8-17.6-7.1-21.5z" />
  </motion.svg>
);

const ShortsIcon = () => (
  <motion.svg
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
    fill="currentColor"
  >
    <path d="M22,2H2V22H9.69L12,15.85,14.31,22H22ZM20,6H4V4H20Z" />
  </motion.svg>
);

const BandanaIcon = () => (
  <motion.svg initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" fill="currentColor">
    <path d="M2,12C4,9,8,8,11,9L10,11A2,2 0 0 0,14 11L13,9C16,8,20,9,22,12C20,15,16,16,13,15L14,13A2,2 0 0 0,10 13L11,15C8,16,4,15,2,12Z" />
  </motion.svg>
);


const BabyTeeIcon = () => (
  <motion.svg
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    width="16"
    height="16"
    viewBox="0 0 330 330"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2"
    fill="currentColor"
  >
    <path d="M315,10.013h-90.012c-8.284,0-15,6.716-15,15c0,24.799-20.183,44.974-44.99,44.974 c-24.808,0-44.99-20.175-44.99-44.974c0-8.284-6.716-15-15-15H15c-8.284,0-15,6.716-15,15v109.974c0,8.284,6.716,15,15,15h45v155 c0,8.284,6.716,15,15,15h180c8.284,0,15-6.716,15-15v-155h45c8.284,0,15-6.716,15-15V25.013C330,16.729,323.284,10.013,315,10.013z" />
  </motion.svg>
);

const iconMap: { [key: string]: React.ComponentType } = {
  PANTS: PantsIcon,
  VESTS: VestIcon,
  TSHIRTS: TshirtIcon,
  "BABY TEES": BabyTeeIcon,
  SHORTS: ShortsIcon,
  BANDANAS: BandanaIcon,
};

const guarantees = [
  {
    Icon: Truck,
    title: 'Free Delivery Anywhere in India',
    description: 'Dispatched in 48 hours, delivered in just 3-5 working days*',
  },
  {
    Icon: RefreshCw,
    title: 'Easy Exchanges',
    description: '72-hour window for quick size or product exchanges.',
  },
  {
    Icon: Bot,
    title: 'Robust Customer Support',
    description: 'Reach us anytime: clothrage@gmail.com or WhatsApp +91 9892090398',
  },
  {
    Icon: Smile,
    title: '200,000+ Happy Customers',
    description: 'More than numbers - a family of happy customers.',
  },
];

const cardCollections = collections.slice(0, 6);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};


export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>("PANTS");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)

  const animationRef = useRef(null);
  const isInView = useInView(animationRef, { once: false, amount: 0.2 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef(null);
  const reviewsInView = useInView(reviewsRef, { once: true, amount: 0.2 });
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activePanel, setActivePanel] = useState<'left' | 'center' | 'right'>('center');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ProductService.getProducts();
        setAllProducts(products);
        const trending = await ProductService.getTrendingProducts(8);
        setTrendingProducts(trending);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isIntersecting) {
      video.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    } else {
      video.pause();
    }
  }, [isIntersecting]);


  useEffect(() => {
    if (!carouselApi) {
      return
    }

    carouselApi.on("select", () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
    })
  }, [carouselApi])

  const displayCategory = hoveredCategory || activeCategory;

  const visibleProducts = useMemo(() => {
    if (!displayCategory) return [];

    const categoryKey = categories.find(c => c.name === displayCategory)?.key;
    if (!categoryKey) return [];

    return allProducts.filter(p => p.subCategory === categoryKey);
  }, [displayCategory, allProducts]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* Hero Section - Desktop (Hover Accordion) */}
      <section className="hidden md:flex group relative w-full h-[70vh] bg-black overflow-hidden justify-center" onMouseLeave={() => setActivePanel('center')}>
        {/* Left Panel */}
        <motion.div
          onMouseEnter={() => setActivePanel('left')}
          animate={{
            flex: activePanel === 'left' ? 2 : activePanel === 'center' ? 1 : 0.5,
            opacity: activePanel === 'left' ? 1 : 0.6
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative h-full cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 w-[80vw] h-full left-1/2 -translate-x-1/2">
            <Image
              src="/image copy 9.png"
              alt="Left Banner"
              fill
              className={cn(
                "object-cover transition-all duration-500",
                activePanel === 'left' ? "grayscale-0" : "grayscale opacity-60"
              )}
            />
          </div>
          <div className={cn(
            "absolute inset-0 bg-black/30 transition-opacity duration-300",
            activePanel === 'left' ? "opacity-0" : "opacity-100"
          )} />

          {/* Left Panel Content - Visible on Hover */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            activePanel === 'left' ? "opacity-100" : "opacity-0"
          )}>
            <Button variant="outline" className="bg-black/20 border-white/30 text-white backdrop-blur-sm">
              Shop Collection
            </Button>
          </div>
        </motion.div>

        {/* Center Panel */}
        <motion.div
          onMouseEnter={() => setActivePanel('center')}
          animate={{
            flex: activePanel === 'center' ? 2 : 0.5,
            opacity: activePanel === 'center' ? 1 : 0.6
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative h-full overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 w-[80vw] h-full left-1/2 -translate-x-1/2">
            <Image
              src="/hero-banner.jpg"
              alt="Rage fashion banner"
              fill
              className={cn(
                "object-cover transition-all duration-500",
                activePanel === 'center' ? "grayscale-0" : "grayscale opacity-60"
              )}
              priority
            />
          </div>

          {/* Overlay Content */}
          <div className={cn(
            "absolute inset-0 z-30 flex h-full flex-col items-center justify-end text-center text-primary-foreground transition-opacity duration-300",
            activePanel === 'center' ? "opacity-100" : "opacity-0"
          )}>
            <motion.div
              className="pb-12"
            >
              <Button asChild variant="outline" size="lg" className="bg-black/20 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm">
                <Link href="/products">
                  Explore <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          onMouseEnter={() => setActivePanel('right')}
          animate={{
            flex: activePanel === 'right' ? 2 : activePanel === 'center' ? 1 : 0.5,
            opacity: activePanel === 'right' ? 1 : 0.6
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative h-full cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 w-[80vw] h-full left-1/2 -translate-x-1/2">
            <Image
              src="/image copy 10.png"
              alt="Right Banner"
              fill
              className={cn(
                "object-cover transition-all duration-500",
                activePanel === 'right' ? "grayscale-0" : "grayscale opacity-60"
              )}
            />
          </div>
          <div className={cn(
            "absolute inset-0 bg-black/30 transition-opacity duration-300",
            activePanel === 'right' ? "opacity-0" : "opacity-100"
          )} />

          {/* Right Panel Content - Visible on Hover */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            activePanel === 'right' ? "opacity-100" : "opacity-0"
          )}>
            <Button variant="outline" className="bg-black/20 border-white/30 text-white backdrop-blur-sm">
              New Arrivals
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Hero Section - Mobile (CSS Scroll Snap) */}
      <section className="md:hidden w-full h-[50vh] bg-black">
        {/* Hero Section - Mobile (CSS Scroll Snap) */}
        <section className="md:hidden w-full h-[50vh] bg-black">
          <div
            ref={(el) => {
              if (el) {
                // Scroll to the middle slide (index 1) on mount
                // 85vw is the width of one slide. We want to center the second slide.
                // The container width is 100vw. The slide is 85vw.
                // To center the second slide:
                // Slide 1 width: 85vw
                // Center of Slide 2 is at: 85vw + (85vw / 2) = 127.5vw
                // Center of Viewport is at: 50vw
                // Scroll position = 127.5vw - 50vw = 77.5vw?
                // Actually, simpler: just scroll past the first slide minus the peek amount.
                // Let's just scroll to the start of the second slide minus the left peek.
                // Left peek is (100vw - 85vw) / 2 = 7.5vw.
                // Start of 2nd slide is at 85vw.
                // So scrollLeft = 85vw - 7.5vw = 77.5vw.
                // Let's try a rough calculation or just scrollIntoView on the child.
                // Better: use a ref on the child and scrollIntoView.
                // But for now, let's just set scrollLeft in a useEffect.
                requestAnimationFrame(() => {
                  el.scrollLeft = el.clientWidth * 0.85 - (el.clientWidth * 0.15) / 2;
                });
              }
            }}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Slide 1: Shop Collection */}
            <div className="relative flex-shrink-0 w-[85vw] h-full snap-center p-2">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src="/image copy 9.png"
                  alt="Left Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="outline" className="bg-black/20 border-white/30 text-white backdrop-blur-sm">
                    Shop Collection
                  </Button>
                </div>
              </div>
            </div>

            {/* Slide 2: Explore */}
            <div className="relative flex-shrink-0 w-[85vw] h-full snap-center p-2">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src="/hero-banner.jpg"
                  alt="Rage fashion banner"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 z-30 flex h-full flex-col items-center justify-end pb-12">
                  <Button asChild variant="outline" size="lg" className="bg-black/20 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm">
                    <Link href="/products">
                      Explore <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Slide 3: New Arrivals */}
            <div className="relative flex-shrink-0 w-[85vw] h-full snap-center p-2">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src="/image copy 10.png"
                  alt="Right Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="outline" className="bg-black/20 border-white/30 text-white backdrop-blur-sm">
                    New Arrivals
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Category Navigation Section */}
      <section className="container mx-auto px-4">
        <div
          onMouseLeave={() => {
            setHoveredCategory(null);
          }}
        >
          <nav
            className="flex md:justify-center items-center gap-4 md:gap-16 border-b overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category) => {
              const Icon = iconMap[category.name];
              const isDisplaying = displayCategory === category.name;
              return (
                <button
                  key={category.name}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onClick={() => setActiveCategory(category.name)}
                  className={cn(
                    'relative flex flex-col items-center justify-center py-4 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground md:flex-row md:justify-start shrink-0 px-4'
                  )}
                >
                  <div className="relative">
                    <AnimatePresence>
                      {Icon && <Icon />}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isDisplaying && (
                        <motion.div
                          className="md:hidden text-xs text-foreground mt-1"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                        >
                          {category.name.replace(/'S/, '')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="hidden md:inline">{category.name}</span>

                  {isDisplaying && (
                    <motion.span
                      layoutId="category-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>
          <AnimatePresence>
            {visibleProducts.length > 0 && (
              <motion.div
                key={displayCategory}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="py-8 md:px-12">
                  <Carousel
                    setApi={setCarouselApi}
                    opts={{
                      align: 'start',
                      loop: false,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {visibleProducts.map((product) => (
                        <CarouselItem
                          key={product.$id}
                          className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                          <div className="p-1">
                            <ProductCard product={product} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {canScrollPrev && <CarouselPrevious className="hidden md:flex" />}
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section ref={animationRef} className="container mx-auto px-4 pt-8">
        <h2 className="mb-12 text-center font-headline text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Shop by Category
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="w-full"
        >
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className='-ml-4'>
              {cardCollections.map((collection) => {
                const image = PlaceHolderImages.find(img => img.id === collection.imageId);
                // Map specific categories to broader groups
                const categoryMap: Record<string, string> = {
                  'Pants': 'Bottoms',
                  'Shorts': 'Bottoms',
                  'Vests': 'Tops',
                  'Tshirts': 'Tops',
                  'Baby-tees': 'Tops',
                  'Long Sleeves': 'Tops',
                  'Bandanas': 'Accessories',
                };
                const targetCategory = categoryMap[collection.handle] || collection.handle;

                return (
                  <CarouselItem key={collection.$id} className="pl-4 basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <motion.div variants={itemVariants}>
                      <Link href={`/products?category=${targetCategory}`} className="group block w-full h-full">
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-primary/50">
                          {image && (
                            <Image
                              src={image.imageUrl}
                              alt={collection.title}
                              fill
                              className="object-cover grayscale group-hover:grayscale-0"
                              data-ai-hint={image.imageHint}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                              {collection.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </section>


      {/* Trending Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="mt-8 mb-8 text-center font-headline text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Trending Now
        </h2>
        {trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {trendingProducts.map((product) => (
              <ProductCard key={product.$id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Trending products are being loaded...</p>
          </div>
        )}
      </section>

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>

      {/* Video Section */}
      {/* Bento Grid Section */}
      <section className="container mx-auto px-4 pb-0 md:pb-12">
        <div className="hidden md:grid grid-cols-3 gap-4 auto-rows-[300px]">
          {/* Item 1: Tall (1x2) - Left */}
          <div className="relative group overflow-hidden rounded-lg md:col-span-1 md:row-span-2">
            <Image
              src="/demo-right.jpg"
              alt="Collection Item 1"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 transition-colors duration-300" />
            <div className="absolute bottom-4 left-4 text-white font-bold text-xl">
              Street Style
            </div>
          </div>

          {/* Middle Column: Stacked Items */}
          <div className="md:col-span-1 md:row-span-2 flex flex-col gap-4 h-full">
            {/* Item 2: Accessories (Taller) */}
            <div className="relative group overflow-hidden rounded-lg flex-[2] min-h-0">
              <BrandModel />
              <div className="absolute inset-0 pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl pointer-events-none">
                {/* Accessories */}
              </div>
            </div>

            {/* Item 3: Logo Link (Shorter) */}
            <Link href="/products" className="relative group overflow-hidden rounded-lg flex-1 min-h-0 flex items-center justify-center transition-colors">
              <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <TypewriterBrand />
              </div>
            </Link>
          </div>

          {/* Item 4: Tall (1x2) - Right */}
          <div className="relative group overflow-hidden rounded-lg md:col-span-1 md:row-span-2">
            <Image
              src="/demo-left.png"
              alt="Collection Item 4"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 transition-colors duration-300" />
            <div className="absolute bottom-4 left-4 text-white font-bold text-xl">
              Limited Edition
            </div>
          </div>
        </div>

        {/* Mobile View: Curtain Reveal */}
        <div className="md:hidden relative h-[45vh] w-full overflow-hidden flex items-center justify-center bg-background">
          {/* Center Text (Revealed) */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <TypewriterBrand vertical={true} />
          </div>

          {/* Left Curtain */}
          <motion.div
            initial={{ x: 0 }}
            whileInView={{ x: "-20%" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.4 }}
            className="absolute left-0 top-0 bottom-0 w-[55%] z-10"
          >
            <div className="relative w-full h-full">
              <Image
                src="/demo-right.jpg"
                alt="Street Style"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Right Curtain */}
          <motion.div
            initial={{ x: 0 }}
            whileInView={{ x: "20%" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.4 }}
            className="absolute right-0 top-0 bottom-0 w-[55%] z-10"
          >
            <div className="relative w-full h-full">
              <Image
                src="/demo-left.png"
                alt="Limited Edition"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <motion.section
        ref={reviewsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto px-4 pt-8 pb-8"
      >
        <h2 className="mb-12 text-center font-headline text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Voices of Liars
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.$id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4 h-full">
                  <Card className="h-full flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-primary/20">
                    <CardContent className="p-6 flex-1">
                      <div className="flex items-center mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-5 w-5',
                              i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">&quot;{review.review}&quot;</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <p className="font-bold">{review.name}</p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.section>

      {/* Guarantees Section */}
      <section className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {guarantees.map(({ Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold uppercase tracking-wider">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
