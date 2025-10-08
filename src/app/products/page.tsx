import { Suspense } from 'react';
import { ProductsContent } from './products-content';

// Server component for the main page
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5.xl">
          All Products
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
          Explore our entire collection of next-gen apparel.
        </p>
      </header>

      {/* Client-side interactive content with Suspense boundary */}
      <Suspense fallback={<div className="text-center py-16">Loading products...</div>}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}