import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function GET() {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Test with a simple message
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say hello!"
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ 
      success: true, 
      testResponse: response,
      model: "llama-3.1-8b-instant",
      provider: "Groq"
    });
    
  } catch (error) {
    console.error('Groq test error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: "Groq"
    }, { status: 500 });
  }
}