'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/header';
import { SiteFooter } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-provider';
import { AuthProvider } from '@/context/auth-provider';
import { ChatWidget } from '@/components/chat-widget';
import { ThemeProvider } from '@/context/theme-provider';
import { AnnouncementBar } from '@/components/announcement-bar';
import { AnimatedQuote } from '@/components/animated-quote';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { CustomLoader } from '@/components/custom-loader';
import { AnimatePresence, motion } from 'framer-motion';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['700', '800', '900'],
});

// export const metadata: Metadata = {
//   title: 'RAGE: Next-Gen Style',
//   description: 'The future of fashion is here. Discover next-gen style with RAGE.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is a simulation. In a real app, you'd set loading to false
    // when your data has finished loading.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Matches the total time of the loader animation

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    // This function is called by the loader's exit animation.
    // In a real app, you might not need this if you tie isLoading to data fetching.
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>RAGE: Next-Gen Style</title>
        <meta name="description" content="The future of fashion is here. Discover next-gen style with RAGE." />
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body
        className={cn(
          'h-full font-body antialiased',
          poppins.variable,
          playfairDisplay.variable
        )}
      >
        <AnimatePresence>
          {isLoading && <CustomLoader onLoadingComplete={handleLoadingComplete} />}
        </AnimatePresence>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AnnouncementBar />
                <SiteHeader />
                <main className="pb-24">{children}</main>
                <AnimatedQuote />
                <SiteFooter />
                <ChatWidget />
                <Toaster />
                <CookieConsentBanner />
              </motion.div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
