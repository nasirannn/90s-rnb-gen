import { NextRequest, NextResponse } from 'next/server';
import MusicApiService, { GenerateCoverRequest } from '@/lib/music-api';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.SUNO_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body: GenerateCoverRequest = await request.json();
    
    // Validate request
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const musicApi = new MusicApiService(apiKey);
    const result = await musicApi.generateCover({
      prompt: body.prompt.trim()
    });

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Cover generation error:', error);
    
    const errorMessage = error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to generate cover: ${errorMessage}` },
      { status: 500 }
    );
  }
}
