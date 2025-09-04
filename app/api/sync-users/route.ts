import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateUserCredits } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    // 从请求头获取Authorization token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // 验证token并获取用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token or user not found', details: authError },
        { status: 401 }
      );
    }

    // 为当前用户创建积分记录
    try {
      const userCredits = await getOrCreateUserCredits(user.id);
      
      return NextResponse.json({
        success: true,
        message: 'User synced successfully',
        user: {
          id: user.id,
          email: user.email,
          credits: userCredits.credits
        }
      });
    } catch (error) {
      console.error(`Error syncing user ${user.id}:`, error);
      return NextResponse.json(
        { error: 'Failed to sync user credits', details: error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in user sync:', error);
    return NextResponse.json(
      { error: 'User sync failed', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST method with Authorization header to sync current user to Neon database',
    usage: 'POST /api/sync-users with Authorization: Bearer <supabase_token>'
  });
}
