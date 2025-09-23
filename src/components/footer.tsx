import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BrandIcon } from './brand-icon';

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className='flex items-center gap-2'>
            <BrandIcon />
            <h3 className="font-headline text-lg font-bold">RAGE</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Next-Gen Style</p>
          <div className="mt-4 flex space-x-4">
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-foreground/80">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/products?category=Men" className="text-muted-foreground hover:text-foreground">Men</Link></li>
            <li><Link href="/products?category=Women" className="text-muted-foreground hover:text-foreground">Women</Link></li>
            <li><Link href="/products?category=Accessories" className="text-muted-foreground hover:text-foreground">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-foreground/80">Support</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQs</Link></li>
            <li><Link href="/returns" className="text-muted-foreground hover:text-foreground">Returns</Link></li>
            <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground">Shipping</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-foreground/80">Stay in the Loop</h4>
          <p className="mt-4 text-sm text-muted-foreground">Subscribe for the latest drops and exclusive deals.</p>
          <form className="mt-4 flex gap-2">
            <Input type="email" placeholder="Enter your email" className="max-w-xs" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RAGE. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
