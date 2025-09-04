import { NextRequest, NextResponse } from 'next/server';
import MusicApiService from '@/lib/music-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID cannot be empty' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const musicApi = new MusicApiService(apiKey);
    const result = await musicApi.getGenerationStatus(taskId);

    console.log(`Status check for ${taskId}:`, JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Get status error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Error occurred while getting status',
        success: false 
      },
      { status: 500 }
    );
  }
}