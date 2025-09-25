import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/header';
import { SiteFooter } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-provider';
import { ChatWidget } from '@/components/chat-widget';
import { ThemeProvider } from '@/context/theme-provider';
import { AnnouncementBar } from '@/components/announcement-bar';

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

export const metadata: Metadata = {
  title: 'RAGE: Next-Gen Style',
  description: 'The future of fashion is here. Discover next-gen style with RAGE.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body
        className={cn(
          'h-full font-body antialiased',
          poppins.variable,
          playfairDisplay.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <CartProvider>
            <AnnouncementBar />
            <SiteHeader />
            <main className="pb-24">{children}</main>
            <SiteFooter />
            <ChatWidget />
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
