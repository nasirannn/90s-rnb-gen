import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateUserCredits, consumeUserCredit, updateUserCredits } from '@/lib/user-db';

export async function GET(request: Request) {
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

    // 获取用户积分
    const userCredits = await getOrCreateUserCredits(user.id);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        credits: userCredits.credits
      }
    });

  } catch (error) {
    console.error('Error getting user credits:', error);
    return NextResponse.json(
      { error: 'Failed to get user credits', details: error },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { action, credits } = body;

    if (action === 'consume') {
      // 消费积分
      const success = await consumeUserCredit(user.id);
      
      if (success) {
        const userCredits = await getOrCreateUserCredits(user.id);
        return NextResponse.json({
          success: true,
          message: 'Credit consumed successfully',
          credits: userCredits.credits
        });
      } else {
        return NextResponse.json(
          { error: 'Insufficient credits' },
          { status: 400 }
        );
      }
    } else if (action === 'update' && typeof credits === 'number') {
      // 更新积分
      const userCredits = await updateUserCredits(user.id, credits);
      
      return NextResponse.json({
        success: true,
        message: 'Credits updated successfully',
        credits: userCredits.credits
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action or credits value' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error updating user credits:', error);
    return NextResponse.json(
      { error: 'Failed to update user credits', details: error },
      { status: 500 }
    );
  }
}
