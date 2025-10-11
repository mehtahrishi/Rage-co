import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Just test if the API key is present and formatted correctly
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not found' });
    }
    
    if (!apiKey.startsWith('AIza')) {
      return NextResponse.json({ error: 'Invalid API key format' });
    }
    
    // Test with a simple fetch to the Google AI API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `API request failed: ${response.status}`,
        details: errorText
      });
    }
    
    const models = await response.json();
    return NextResponse.json({ 
      success: true, 
      availableModels: models.models?.map((m: any) => m.name) || [],
      totalModels: models.models?.length || 0
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to test API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}