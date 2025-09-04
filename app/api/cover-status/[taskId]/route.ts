import { NextRequest, NextResponse } from 'next/server';

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

    // 调用封面回调API获取结果
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/cover-callback?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get cover status: ${response.statusText}`);
    }

    const result = await response.json();

    console.log(`Cover status check for ${taskId}:`, JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Get cover status error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error occurred while getting cover status',
        success: false 
      },
      { status: 500 }
    );
  }
}
