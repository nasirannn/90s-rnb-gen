import { NextRequest, NextResponse } from 'next/server';
import { getConnections } from '@/lib/sse-connections';

// Get connections map
const connections = getConnections();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  
  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Save connection for later pushing
      connections.set(taskId, controller);
      
      // Send connection confirmation
      controller.enqueue(`data: ${JSON.stringify({ 
        type: 'connected', 
        taskId,
        message: 'Waiting for music generation completion...' 
      })}\n\n`);
    },
    cancel() {
      // Clean up connection
      connections.delete(taskId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

