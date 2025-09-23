'use client';
import { Button } from '@/components/ui/button';
import { AnimatedPage } from '@/components/animated-page';
import { ArrowRight, Package, RefreshCw, Smile } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Returns & Exchanges
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            We want you to love your purchase. If you're not satisfied, we're here to help.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                    <Package className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg">30-Day Policy</h3>
                    <p className="text-sm text-muted-foreground">Return items within 30 days of delivery.</p>
                </div>
                 <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                    <RefreshCw className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg">Easy Exchanges</h3>
                    <p className="text-sm text-muted-foreground">Exchange for a different size, color, or style.</p>
                </div>
                 <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                    <Smile className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg">Satisfaction Guaranteed</h3>
                    <p className="text-sm text-muted-foreground">We strive for your complete satisfaction.</p>
                </div>
            </div>
          <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground mx-auto">
            <h2 className="text-foreground font-headline text-2xl">Return Policy</h2>
            <p>
              We offer a 30-day return policy for all items. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>

            <h2 className="text-foreground font-headline text-2xl mt-8">How to Start a Return</h2>
            <p>
              To start a return, you can contact us at <a href="mailto:returns@rage.com" className="text-primary hover:underline">returns@rage.com</a>. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
            <div className="text-center mt-8">
                <Button size="lg">
                Start a Return <ArrowRight className="ml-2" />
                </Button>
            </div>
            <h2 className="text-foreground font-headline text-2xl mt-8">Exchanges</h2>
            <p>
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>

            <h2 className="text-foreground font-headline text-2xl mt-8">Refunds</h2>
            <p>
              We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
