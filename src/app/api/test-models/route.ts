import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list models (if available in the SDK)
    // For now, let's just test with a simple generation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ 
      success: true, 
      testResponse: text,
      availableModels: [
        'gemini-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
      ]
    });
  } catch (error) {
    console.error('Model test error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}