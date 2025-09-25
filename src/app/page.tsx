'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

import { products, collections } from '@/lib/data';
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

const categories = [
  { name: "PANT'S", href: '/products?category=Pants', key: 'Pants' },
  { name: "VEST'S", href: '/products?category=Vests', key: 'Vests' },
  { name: "TSHIRT'S", href: '/products?category=Tshirts', key: 'Tshirts' },
  { name: "LONG SLEEVE'S", href: '/products?category=long-sleeves', key: 'Long-sleeves' },
  { name: "BABY TEE'S", href: '/products?category=baby-tees', key: 'Baby-tees' },
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

const LongSleeveIcon = () => (
    <motion.svg
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        width="20"
        height="20"
        viewBox="0 0 250 200"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2"
        fill="currentColor"
    >
        <path d="M246.674,72.269c0.234,1.871-2.491,7.849-4.346,13.565c-0.386,1.18-0.756,2.328-1.11,3.427 c-1.844,5.722-4.493,12.162-6.744,12.129c-2.252-0.038-8.436-2.66-14.267-4.101l-39.64-9.763 c-5.831-1.441-10.563,2.263-10.568,8.273l-0.033,87.112c0,6.01-3.606,14.256-8.909,17.073c-16.79,8.926-37.921,8.072-37.921,8.072 c-18.118,0-29.996-4.101-37.122-7.903c-5.298-2.834-8.746-11.232-8.73-17.242l0.267-87.112c0.016-6.01-4.737-9.883-10.617-8.659 l-41.081,8.583c-5.88,1.235-12.254,3.345-14.533,3.78c-2.279,0.424-5.205-5.706-6.891-11.471l-0.25-0.87 C2.493,81.39,0.165,75.216,0.007,73.128c-0.158-2.083,2.295-4.068,4.036-4.634l3.155-1.023 c32.08-12.298,50.393-19.972,60.183-24.291c5.493-2.42,14.74-4.569,20.75-4.569h0.473c6.005,0,10.84,5.64,15.523,9.404 c6.891,5.548,19.01,5.809,19.01,5.809c9.203,0,14.669-2.627,17.916-5.684c4.368-4.134,9.605-9.529,15.616-9.529h1.942 c6.005,0,15.741,0.479,21.408,2.464c14.963,5.243,40.565,17.476,54.51,24.318C239.919,68.031,246.44,70.397,246.674,72.269z"/>
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
        <path d="M315,10.013h-90.012c-8.284,0-15,6.716-15,15c0,24.799-20.183,44.974-44.99,44.974 c-24.808,0-44.99-20.175-44.99-44.974c0-8.284-6.716-15-15-15H15c-8.284,0-15,6.716-15,15v109.974c0,8.284,6.716,15,15,15h45v155 c0,8.284,6.716,15,15,15h180c8.284,0,15-6.716,15-15v-155h45c8.284,0,15-6.716,15-15V25.013C330,16.729,323.284,10.013,315,10.013z"/>
    </motion.svg>
);

const iconMap: { [key: string]: React.ComponentType } = {
    "PANT'S": PantsIcon,
    "VEST'S": VestIcon,
    "TSHIRT'S": TshirtIcon,
    "LONG SLEEVE'S": LongSleeveIcon,
    "BABY TEE'S": BabyTeeIcon,
};

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
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 8);
  const [activeCategory, setActiveCategory] = useState<string | null>("PANT'S");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  
  const animationRef = useRef(null);
  const isInView = useInView(animationRef, { once: false, amount: 0.2 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

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
        // Autoplay was prevented, which is common in browsers.
        // You might want to show a play button here.
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

    return products.filter(p => p.subCategory === categoryKey);
  }, [displayCategory]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="group relative w-full block">
        <Image
          src="/hero-banner.jpg"
          alt="Rage fashion banner"
          width={1920}
          height={800}
          className="w-full h-auto"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex h-full flex-col items-center justify-end text-center text-primary-foreground">
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
        <div 
          onMouseLeave={() => {
            setHoveredCategory(null);
          }}
        >
          <nav
            className="flex justify-center items-center gap-16 border-b"
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
                    'relative flex flex-col items-center justify-center py-4 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground md:flex-row md:justify-start'
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
                            {category.name.replace(/'S/,'')}
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
                      animate={{ opacity: 1, exit: { opacity: 0 } }}
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
                          key={product.id}
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
            }}
            className="w-full"
          >
            <CarouselContent className='-ml-4'>
              {cardCollections.map((collection) => {
                const image = PlaceHolderImages.find(img => img.id === collection.imageId);
                return (
                  <CarouselItem key={collection.id} className="pl-4 basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <motion.div variants={itemVariants}>
                      <Link href={`/products?category=${collection.handle}`} className="group block w-full h-full">
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Video Section */}
      <section ref={videoContainerRef} className="container mx-auto px-4 py-16">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
          <video
            ref={videoRef}
            src="video.mp4"
            loop
            muted
            playsInline
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isIntersecting ? "grayscale-0" : "grayscale"
            )}
          />
        </div>
      </section>

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  );
}
