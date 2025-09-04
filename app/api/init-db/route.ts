import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/database-init';

export async function GET() {
  try {
    await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Database initialization failed', details: error },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Database initialization failed', details: error },
      { status: 500 }
    );
  }
}
