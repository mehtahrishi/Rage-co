import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Chatbot service is not properly configured' },
        { status: 500 }
      );
    }

    const { query, userEmail, userName, chatHistory } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Processing chatbot query:', query);

    // Initialize Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Create the system prompt with RAGE store information
    const systemPrompt = `You are a friendly customer support chatbot for RAGE, a trendy streetwear store.

IMPORTANT RULES:
- Keep responses SHORT (2-3 sentences max)
- Use simple, friendly language
- No markdown formatting, asterisks, or bullet points
- Be conversational and helpful

RAGE Info:
We sell streetwear - T-shirts, Vests, Pants, Shorts, Baby Tees, and Bandanas for men and women.

Policies:
30-day returns, free India delivery, ships in 48 hours, free shipping over ₹5000.

For Issues:
If someone mentions "bug", "help", "support", "issue", "problem", or needs assistance, say: "I'll create a support ticket for you right away to get this resolved!"

Be short, helpful, and friendly!`;

    // Use Groq to generate response
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "llama-3.1-8b-instant", // Using current Llama 3.1 8B model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    let text = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    // Clean up any markdown formatting
    text = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/#{1,6}\s/g, '')        // Remove headers
      .replace(/^\d+\.\s/gm, '')       // Remove numbered lists
      .replace(/^[-*+]\s/gm, '')       // Remove bullet points
      .replace(/\n{3,}/g, '\n\n')      // Replace multiple newlines
      .trim();

    // Check if user needs support (bug report, help, issues)
    const supportKeywords = ['bug', 'help', 'support', 'issue', 'problem', 'error', 'broken', 'not working', 'fix'];
    const needsSupport = supportKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );

    if (needsSupport) {
      // Create support ticket
      try {
        const ticketResponse = await fetch(`${request.nextUrl.origin}/api/create-ticket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: query,
            timestamp: new Date().toISOString(),
            userEmail: userEmail || 'guest@rage.com',
            userName: userName || 'Guest User',
            chatHistory: chatHistory || []
          }),
        });

        if (ticketResponse.ok) {
          const ticketData = await ticketResponse.json();
          text = `I've created a support ticket (#${ticketData.ticketId}) for you and sent it to our team. They'll get back to you soon! \n\nIn the meantime, you can also reach us at support@genrage.com if you have any urgent issues.`;
        } else if (ticketResponse.status === 401) {
          text = `To create a support ticket for your issue, please log in to your account first. I can still help with general questions about RAGE products and policies!`;
        }
      } catch (error) {
        console.error('Failed to create ticket:', error);
        text = `I understand you need help with this issue. For personalized support, please log in to your account or contact us directly at support@genrage.com`;
      }
    }
    
    console.log('Chatbot response:', text);
    
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
}