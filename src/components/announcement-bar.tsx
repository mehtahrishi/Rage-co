'use client';

import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const announcements = [
  'Rage: Next-Gen Style',
  'The future of fashion is here.',
  'Discover curated collections that define tomorrow.',
  'Free shipping on orders over ₹5000',
];

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <Carousel
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        opts={{
          loop: true,
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {announcements.map((text, index) => (
            <CarouselItem key={index}>
              <div className="p-2 text-center text-sm font-medium">
                <p>{text}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
