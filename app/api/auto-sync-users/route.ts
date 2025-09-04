import { NextResponse } from 'next/server';
import { getOrCreateUserCredits } from '@/lib/user-db';
import { createCreditTransaction } from '@/lib/credit-transactions-db';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // 使用服务角色密钥创建管理员客户端
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 获取所有用户
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users from Supabase', details: error },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found in Supabase',
        syncedUsers: 0
      });
    }

    const syncResults = [];
    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // 为每个用户创建积分记录
        const userCredits = await getOrCreateUserCredits(user.id);
        
        // 创建初始积分交易记录
        await createCreditTransaction(
          user.id,
          'bonus',
          3,
          3,
          'Initial credits for new user'
        );
        
        syncResults.push({
          userId: user.id,
          email: user.email,
          credits: userCredits.credits,
          status: 'success'
        });
        
        successCount++;
      } catch (error) {
        console.error(`Error syncing user ${user.id}:`, error);
        syncResults.push({
          userId: user.id,
          email: user.email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `User sync completed. ${successCount} users synced successfully, ${errorCount} errors.`,
      totalUsers: users.length,
      syncedUsers: successCount,
      errorCount,
      results: syncResults
    });

  } catch (error) {
    console.error('Error in user sync:', error);
    return NextResponse.json(
      { error: 'User sync failed', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 使用服务角色密钥创建管理员客户端
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 获取用户数量
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users from Supabase', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Auto sync API for all users',
      totalUsersInSupabase: users?.length || 0,
      instruction: 'Call POST /api/auto-sync-users to automatically sync all Supabase users to Neon database'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check users', details: error },
      { status: 500 }
    );
  }
}
