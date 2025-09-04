import { NextResponse } from 'next/server';
import { getOrCreateUserCredits } from '@/lib/user-db';
import { createCreditTransaction } from '@/lib/credit-transactions-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 为指定用户创建积分记录
    const userCredits = await getOrCreateUserCredits(userId);
    
    // 创建初始积分交易记录
    await createCreditTransaction(
      userId,
      'bonus',
      3,
      3,
      'Initial credits for new user'
    );
    
    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: {
        id: userId,
        credits: userCredits.credits
      }
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API for syncing a specific user by ID',
    usage: 'POST /api/sync-user-by-id with body: { "userId": "your-user-id" }'
  });
}
