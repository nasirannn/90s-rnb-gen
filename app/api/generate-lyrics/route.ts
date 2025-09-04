import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Validate required parameters
    if (!prompt) {
      return NextResponse.json(
        { error: 'Please provide a prompt for lyrics generation' },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Generating lyrics with prompt:', prompt);

    const response = await fetch('https://api.kie.ai/api/v1/lyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        callBackUrl: process.env.LYRICS_CALLBACK_URL || 'https://your-domain.com/api/lyrics-callback',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Lyrics API call failed: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    console.log('Lyrics API response:', JSON.stringify(data, null, 2));
    
    // Check for API success
    if (data.code === 200) {
      return NextResponse.json({
        success: true,
        data: {
          taskId: data.data?.taskId, // 使用文档中明确的字段名称
          status: 'generating'
        }
      });
    } else {
      throw new Error(`Lyrics API error (${data.code}): ${data.msg || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Lyrics generation error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error occurred during lyrics generation',
        success: false 
      },
      { status: 500 }
    );
  }
}
