'use client';
import { AnimatedPage } from '@/components/animated-page';

export default function PrivacyPolicyPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="prose prose-stone dark:prose-invert max-w-4xl mx-auto text-muted-foreground">
          <p>
            This Privacy Policy describes how RAGE ("we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from our website (the "Site") or otherwise communicate with us (collectively, the "Services").
          </p>

          <h2 className="text-foreground font-headline text-2xl mt-8">Information We Collect</h2>
          <p>
            When you use our Services, we may collect personal information about you from a variety of sources. This includes information you provide to us directly, information we collect automatically, and information we may receive from third parties.
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Information you provide to us:</strong> This includes your name, email address, shipping address, billing address, phone number, and payment information when you make a purchase.</li>
            <li><strong>Information we collect automatically:</strong> When you browse our Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</li>
          </ul>

          <h2 className="text-foreground font-headline text-2xl mt-8">How We Use Your Information</h2>
          <p>
            We use the information we collect to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
          </p>
          <ul className="list-disc pl-5">
            <li>Communicate with you;</li>
            <li>Screen our orders for potential risk or fraud; and</li>
            <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
          </ul>

          <h2 className="text-foreground font-headline text-2xl mt-8">Sharing Your Information</h2>
          <p>
            We may share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use a platform to power our online store. We also use analytics to help us understand how our customers use the Site.
          </p>
          
          <h2 className="text-foreground font-headline text-2xl mt-8">Your Rights</h2>
          <p>
            You may have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
          </p>
          
          <h2 className="text-foreground font-headline text-2xl mt-8">Changes to this Policy</h2>
          <p>
            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
