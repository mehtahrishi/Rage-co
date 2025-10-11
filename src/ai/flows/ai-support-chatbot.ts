'use server';

/**
 * @fileOverview A support chatbot AI agent.
 *
 * - supportChatbot - A function that handles the support chatbot process.
 * - SupportChatbotInput - The input type for the supportChatbot function.
 * - SupportChatbotOutput - The return type for the supportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatbotInputSchema = z.object({
  query: z.string().describe('The query from the user.'),
});
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

const SupportChatbotOutputSchema = z.object({
  response: z.string().describe('The response to the user.'),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;

export async function supportChatbot(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
  return supportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatbotPrompt',
  input: {schema: SupportChatbotInputSchema},
  output: {schema: SupportChatbotOutputSchema},
  model: 'googleai/gemini-pro',  // Specify model here
  prompt: `You are a customer support chatbot for RAGE, a trendy online clothing store specializing in streetwear and fashion. Your goal is to answer customer questions about orders, products, returns, shipping, and sizing. Be friendly, helpful, and enthusiastic about fashion.

  **RAGE Store Information:**
  
  **Products & Categories:**
  - Men's and Women's clothing
  - T-shirts, Baby Tees, Long Sleeves, Vests, Pants, Shorts, Bandanas
  - Streetwear and trendy fashion items
  
  **Policies:**
  - 30-day return and exchange policy
  - Free delivery anywhere in India
  - Dispatched in 48 hours, delivered in 3-5 working days
  - 72-hour window for size or product exchanges
  - Shipping is free on orders over ₹5000
  
  **Contact Information:**
  - Email: clothrage@gmail.com
  - We have 200,000+ happy customers
  
  **Common FAQs:**
  - Order tracking: Visit our website and enter your order number
  - Size guide: Available on our website for each product
  - Returns: Easy returns within 30 days
  - Exchanges: 72-hour window for quick exchanges
  - Shipping: Free delivery across India, 3-5 working days
  
  **Instructions:**
  - Be conversational and friendly
  - If asked about specific products, mention our categories
  - For complex issues, direct them to support@genrage.com or WhatsApp
  - Always end with asking if there's anything else you can help with
  
  Customer Question: {{{query}}}`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
