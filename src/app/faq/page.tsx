'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimatedPage } from '@/components/animated-page';

const faqs = [
  {
    question: 'What is your return policy?',
    answer: 'We have a 30-day return policy. Items must be in their original condition, with tags attached. Please visit our returns page for more details.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive an email with a tracking number. You can use this number on the carrier\'s website to track your package.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. Please see our shipping page for more information.',
  },
  {
    question: 'What sizes do you carry?',
    answer: 'We offer a range of sizes from XS to XXL for most items. Please refer to the size guide on each product page for specific measurements.',
  },
  {
    question: 'How do I care for my garments?',
    answer: 'Care instructions are listed on the label of each garment and on the product details page. We recommend following these instructions to ensure the longevity of your clothing.',
  },
];

export default function FAQPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Find answers to common questions about our products, shipping, and returns.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AnimatedPage>
  );
}
