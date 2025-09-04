import { NextRequest, NextResponse } from 'next/server';

// 存储封面生成结果的内存存储（生产环境应使用数据库）
const coverResults = new Map<string, {
  code: number;
  msg: string;
  data: {
    taskId: string;
    images: string[] | null;
  };
  timestamp: number;
}>();

// 清理过期结果（24小时后过期）
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24小时

function cleanupExpiredResults() {
  const now = Date.now();
  // 使用 Array.from 来避免 TypeScript 编译错误
  Array.from(coverResults.entries()).forEach(([taskId, result]) => {
    if (now - result.timestamp > EXPIRATION_TIME) {
      coverResults.delete(taskId);
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Cover callback received:', JSON.stringify(body, null, 2));

    // 验证回调数据结构
    if (!body.data?.taskId) {
      return NextResponse.json(
        { error: 'Invalid callback data: missing taskId' },
        { status: 400 }
      );
    }

    const taskId = body.data.taskId;
    
    // 存储封面生成结果
    const result = {
      code: body.code || 200,
      msg: body.msg || 'success',
      data: {
        taskId: taskId,
        images: body.data.images || null
      },
      timestamp: Date.now()
    };

    coverResults.set(taskId, result);
    
    // 清理过期结果
    cleanupExpiredResults();

    console.log(`Cover result stored for taskId: ${taskId}`, result);

    return NextResponse.json({ 
      success: true, 
      message: 'Cover callback processed successfully' 
    });
    
  } catch (error) {
    console.error('Cover callback processing error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process cover callback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId parameter is required' },
        { status: 400 }
      );
    }

    // 清理过期结果
    cleanupExpiredResults();

    const result = coverResults.get(taskId);
    
    if (!result) {
      return NextResponse.json({
        code: 202,
        msg: 'Cover generation in progress',
        data: {
          taskId: taskId,
          images: null
        }
      });
    }

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Get cover result error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get cover result' },
      { status: 500 }
    );
  }
}
