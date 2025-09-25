'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { BrandIcon } from './brand-icon';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { cn } from '@/lib/utils';
import { BrandText } from './brand-text';
import { navLinks } from '@/lib/nav-links';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export function SiteHeader() {
  const { items } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Set initial state
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage, pathname]);

  const showTextLogo = !isHomePage || isScrolled;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2"
            aria-label="Rage Home"
          >
            <div className="relative flex h-10 w-24 items-center justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={showTextLogo ? 'text' : 'icon'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  {showTextLogo ? <BrandText /> : <BrandIcon />}
                </motion.div>
              </AnimatePresence>
            </div>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) =>
                link.subCategories ? (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuTrigger className="text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:text-foreground">
                      {link.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {link.subCategories.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={link.label}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink className="text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:text-foreground px-4 py-2">
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle asChild>
                <Link href="/" className="flex items-center gap-2">
                  <BrandText />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              <Accordion type="single" collapsible className="w-full">
                {navLinks.map((link, index) =>
                  link.subCategories ? (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-lg uppercase tracking-wider hover:no-underline">
                        {link.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-4 pl-4 pt-2">
                          {link.subCategories.map((subLink) => (
                            <li key={subLink.title}>
                              <Link href={subLink.href} className="text-muted-foreground hover:text-foreground">{subLink.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Link
                      key={index}
                      href={link.href}
                      className="block px-2 py-3 text-lg uppercase tracking-wider border-b"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </Accordion>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <div className="flex justify-center flex-1 md:hidden">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="Rage Home"
          >
            <div className="relative h-10 w-24 flex items-center justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={showTextLogo ? 'text' : 'icon'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  {showTextLogo ? <BrandText /> : <BrandIcon />}
                </motion.div>
              </AnimatePresence>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-2 md:flex-1">
          <nav className="flex items-center">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Shopping Cart"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
            <ThemeToggle />
            <div className="flex items-center justify-end space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User Profile">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
