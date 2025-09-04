import { NextResponse } from 'next/server';
import { getOrCreateUserCredits } from '@/lib/user-db';
import { createCreditTransaction } from '@/lib/credit-transactions-db';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // 直接从Supabase获取所有用户
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
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

    const knownUserIds = users.map(user => user.id);

    const syncResults = [];
    let successCount = 0;
    let errorCount = 0;

    for (const userId of knownUserIds) {
      try {
        // 为每个用户创建积分记录
        const userCredits = await getOrCreateUserCredits(userId);
        
        // 创建初始积分交易记录
        await createCreditTransaction(
          userId,
          'bonus',
          3,
          3,
          'Initial credits for new user'
        );
        
        syncResults.push({
          userId,
          email: users.find(u => u.id === userId)?.email,
          credits: userCredits.credits,
          status: 'success'
        });
        
        successCount++;
      } catch (error) {
        console.error(`Error syncing user ${userId}:`, error);
        syncResults.push({
          userId,
          email: users.find(u => u.id === userId)?.email,
          status: 'error',
          error: error.message
        });
        
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `User sync completed. ${successCount} users synced successfully, ${errorCount} errors.`,
      totalUsers: knownUserIds.length,
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
    // 获取Supabase中的用户数量
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users from Supabase', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin API for syncing all users',
      totalUsersInSupabase: users?.length || 0,
      instruction: 'Call POST /api/admin/sync-all-users to automatically sync all Supabase users to Neon database'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check users', details: error },
      { status: 500 }
    );
  }
}
