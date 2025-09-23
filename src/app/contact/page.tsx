'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone } from 'lucide-react';
import { AnimatedPage } from '@/components/animated-page';

export default function ContactPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." rows={5} />
                </div>
                <Button type="submit" size="lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          <div className="space-y-8 rounded-lg bg-muted/50 p-8">
             <h2 className="text-2xl font-bold font-headline mb-4">Contact Information</h2>
             <div className="space-y-6 text-muted-foreground">
                <p>
                    Reach out to us via email or phone, or visit our headquarters. We're here to help with any inquiries you may have.
                </p>
                 <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 mt-1 text-primary"/>
                    <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <a href="mailto:support@rage.com" className="hover:text-primary transition-colors">support@rage.com</a>
                        <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 mt-1 text-primary"/>
                    <div>
                        <h3 className="font-semibold text-foreground">Phone</h3>
                        <a href="tel:+1234567890" className="hover:text-primary transition-colors">+1 (234) 567-890</a>
                        <p className="text-sm">Mon - Fri, 9am - 5pm PST</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
