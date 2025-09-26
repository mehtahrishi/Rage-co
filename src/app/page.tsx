'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Bot, Smile } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

import { products, collections, reviews } from '@/lib/data';
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

const categories = [
  { name: "PANTS", href: '/products?category=Pants', key: 'Pants' },
  { name: "VESTS", href: '/products?category=Vests', key: 'Vests' },
  { name: "TSHIRTS", href: '/products?category=Tshirts', key: 'Tshirts' },
  { name: "TANKS", href: '/products?category=Tanks', key: 'Tanks' },
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

const TankIcon = () => (
    <motion.svg 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 21v-4a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v4"/><path d="M12 3a4 4 0 0 0-4 4v10h8V7a4 4 0 0 0-4-4Z"/>
    </motion.svg>
);

const ShortsIcon = () => (
    <motion.svg initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 4 3 10h12l3-10Z"/><path d="M12 14v7"/><path d="M6 14s-3 4-3 7"/><path d="M18 14s3 4 3 7"/>
    </motion.svg>
);

const BandanaIcon = () => (
    <motion.svg initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s5-3 10-3 10 3 10 3-5 3-10 3-10-3-10-3Z"/><path d="m14 12 3 3 3-3"/>
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
  TANKS: TankIcon,
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
      description: 'Reach us anytime: support@genrage.com or WhatsApp +91 9699798971',
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
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 8);
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
          className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-300"
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

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>

      {/* Video Section */}
      <section ref={videoContainerRef} className="container mx-auto px-4 py-8">
        <div className="relative aspect-video sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-lg shadow-lg bg-black">
          <video
            ref={videoRef}
            src="video.mp4"
            loop
            playsInline
            muted={isMuted}
            className={cn(
              "w-full h-full object-fill transition-all duration-500",
              isIntersecting ? "grayscale-0" : "grayscale"
            )}
          />
          {/* Audio Toggle Button */}
          <button
            onClick={() => {
              const video = videoRef.current;
              if (video) {
                setIsMuted(!isMuted);
                video.muted = !isMuted;
              }
            }}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 9L20 5M20 9L16 5M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
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
          Voices of RAGE
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
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
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
      <section className="container mx-auto px-4 pt-8 pb-16">
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

    
