import { NextRequest, NextResponse } from 'next/server';
import MusicApiService from '@/lib/music-api';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    // 从前端获取所有参数
    const {
      mode,
      mood,
      customPrompt,
      instrumentalMode,
      genre,
      vibe,
      songTitle,
      grooveType,
      leadInstrument,
      drumKit,
      bassTone,
      vocalStyle,
      vocalGender,
      harmonyPalette,
      bpm
    } = requestData;

    // 根据模式验证必需参数 - 临时注释用于测试前端交互
    // if (mode === 'basic') {
    //   if (!mood) {
    //     return NextResponse.json(
    //       { error: 'Please select a mood for basic mode' },
    //       { status: 400 }
    //     );
    //   }
    // } else if (mode === 'custom') {
    //   if (!genre || !vibe) {
    //     return NextResponse.json(
    //       { error: 'Please select genre and vibe for custom mode' },
    //       { status: 400 }
    //     );
    //   }
    // } else {
    //   return NextResponse.json(
    //     { error: 'Please select a valid mode (basic or custom)' },
    //     { status: 400 }
    //   );
    // }

    // Get API key from environment variables - 临时注释用于测试前端交互
    // const apiKey = process.env.SUNO_API_KEY;
    // if (!apiKey) {
    //   return NextResponse.json(
    //     { error: 'API key not configured' },
    //     { status: 500 }
    //   );
    // }

    // console.log('API Key exists:', !!apiKey, 'Length:', apiKey.length);

    // const musicApi = new MusicApiService(apiKey);
    
    console.log('Generating music with mode:', mode);
    console.log('Full request data:', requestData);
    
    // 构造完整的请求对象传递给API
    const musicRequest = {
      mode,
      mood,
      customPrompt,
      instrumentalMode,
      genre,
      vibe,
      songTitle,
      grooveType,
      leadInstrument,
      drumKit,
      bassTone,
      vocalStyle,
      vocalGender,
      harmonyPalette,
      bpm
    };
    
    // Generate music - 临时返回模拟数据用于测试前端交互
    // const result = await musicApi.generateMusic(musicRequest);

    // console.log('API Response:', JSON.stringify(result, null, 2));

    // 返回模拟的成功响应
    const mockResult = {
      taskId: 'mock-task-' + Date.now(),
      status: 'generating',
      data: null
    };

    return NextResponse.json({
      success: true,
      data: mockResult,
    });

  } catch (error) {
    console.error('Music generation error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Error occurred during music generation',
        success: false 
      },
      { status: 500 }
    );
  }
}