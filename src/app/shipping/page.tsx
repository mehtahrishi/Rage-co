'use client';
import { AnimatedPage } from '@/components/animated-page';
import { Globe, Package, Truck } from 'lucide-react';

export default function ShippingPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Shipping Information
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Details on how we get your RAGE gear to you.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                    <Truck className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg">Free US Shipping</h3>
                    <p className="text-sm text-muted-foreground">On all orders over $50.</p>
                </div>
                 <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                    <Package className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg">Fast Processing</h3>
                    <p className="text-sm text-muted-foreground">Orders typically ship within 1-2 business days.</p>
                </div>
                 <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                    <Globe className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg">International</h3>
                    <p className="text-sm text-muted-foreground">We ship to most countries worldwide.</p>
                </div>
            </div>
          <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground mx-auto">
            <h2 className="text-foreground font-headline text-2xl">Domestic Shipping (USA)</h2>
            <p>
              We offer free standard shipping on all domestic orders over $50. For orders under $50, a flat rate of $5 applies. Expedited shipping options are available at checkout for an additional fee.
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Standard Shipping:</strong> 3-7 business days</li>
              <li><strong>Expedited Shipping:</strong> 2-3 business days</li>
              <li><strong>Overnight Shipping:</strong> 1 business day</li>
            </ul>

            <h2 className="text-foreground font-headline text-2xl mt-8">International Shipping</h2>
            <p>
              International shipping rates are calculated at checkout based on your location and the weight of your order. Please note that customers are responsible for any customs and import duties.
            </p>
             <ul className="list-disc pl-5">
              <li><strong>Standard International:</strong> 7-21 business days</li>
              <li><strong>Expedited International:</strong> 5-10 business days</li>
            </ul>

            <h2 className="text-foreground font-headline text-2xl mt-8">Order Processing</h2>
            <p>
              We process and ship orders Monday through Friday, excluding holidays. Orders placed on weekends or holidays will be processed on the next business day. You will receive a shipping confirmation email with a tracking number once your order has been dispatched.
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
