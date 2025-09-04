import { NextResponse } from 'next/server';
import { testConnection, query } from '@/lib/neon';

export async function GET() {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // 测试查询
    const result = await query('SELECT version()');
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      version: result.rows[0].version
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { error: 'Database test failed', details: error },
      { status: 500 }
    );
  }
}
