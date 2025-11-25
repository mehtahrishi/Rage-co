'use client';

import Image from 'next/image';

export function BrandModel() {
    return (
        <div className="relative w-full h-full">
            <Image
                src="/1.jpg"
                alt="Brand Model"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/20" />
        </div>
    );
}
