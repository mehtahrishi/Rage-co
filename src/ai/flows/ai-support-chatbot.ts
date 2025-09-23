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
  prompt: `You are a customer support chatbot for an online store. Your goal is to answer customer questions about order status, size guides, returns, and shipping. Be polite and helpful.

  Use the following policies and FAQs to answer the question.

  Policies: We have a 30-day return policy. Shipping is free on orders over $50.
  FAQs: How do I track my order? Go to our website and enter your order number. What is your size guide? We have a size guide on our website.

  Question: {{{query}}}`,
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
