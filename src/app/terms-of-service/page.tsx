'use client';
import { AnimatedPage } from '@/components/animated-page';

export default function TermsOfServicePage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="prose prose-stone dark:prose-invert max-w-4xl mx-auto text-muted-foreground">
          <h2 className="text-foreground font-headline text-2xl">1. Overview</h2>
          <p>
            This website is operated by RAGE. Throughout the site, the terms “we”, “us” and “our” refer to RAGE. RAGE offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
          </p>

          <h2 className="text-foreground font-headline text-2xl mt-8">2. General Conditions</h2>
          <p>
            We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
          </p>

          <h2 className="text-foreground font-headline text-2xl mt-8">3. Accuracy, Completeness and Timeliness of Information</h2>
          <p>
            We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
          </p>

          <h2 className="text-foreground font-headline text-2xl mt-8">4. Products or Services</h2>
          <p>
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
          </p>
          
           <h2 className="text-foreground font-headline text-2xl mt-8">5. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the land.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
