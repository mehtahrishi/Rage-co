import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BrandText } from './brand-text';

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className='flex items-center gap-2'>
            <BrandText />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Next-Gen Style</p>
          <div className="mt-4 flex space-x-4">
            <Link href="https://instagram.com/theliarstore" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="mailto:clothrage@gmail.com" aria-label="Email">
              <Mail className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-foreground/80">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/products?category=Tops" className="text-muted-foreground hover:text-foreground">Tops</Link></li>
            <li><Link href="/products?category=Bottoms" className="text-muted-foreground hover:text-foreground">Bottoms</Link></li>
            <li><Link href="/products" className="text-muted-foreground hover:text-foreground">New Arrivals</Link></li>
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
          <h4 className="font-semibold uppercase tracking-wider text-foreground/80">Inspiration</h4>
          <div className="mt-4">
            <svg
              viewBox="0 0 800 80"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg"
            >
              <defs>
                <style>
                  {`
                    @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
                  `}
                </style>
              </defs>

              <text
                x="50%"
                y="50%"
                dy=".35em"
                textAnchor="middle"
                className="fill-current text-foreground/90"
                style={{ fontFamily: "'UnifrakturMaguntia', cursive", fontSize: '51px' }}
              >
                "Do not go gentle into that good night"
              </text>
            </svg>
            <p className="mt-3 text-sm text-muted-foreground text-center">- Dylan Thomas</p>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Liars. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Massive Brand Footer */}
      <div className="w-full overflow-hidden border-t bg-background">
        <div className="w-full flex justify-center items-end leading-none">
          <svg
            viewBox="0 0 1200 140"
            className="w-full h-auto pointer-events-none select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
                `}
              </style>
            </defs>
            <text
              x="50%"
              y="200"
              textAnchor="middle"
              className="fill-current text-foreground"
              style={{
                fontFamily: "'UnifrakturMaguntia', cursive",
                fontSize: '240px',
              }}
            >
              Liars
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}
