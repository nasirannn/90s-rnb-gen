import { NextRequest, NextResponse } from 'next/server';
import { pushToClient } from '@/lib/sse-connections';

// Cache for processed tasks to handle idempotency
const processedTasks = new Set<string>();

// Handle Suno API callbacks
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Fast response - must return response within 15 seconds
    const callbackData = await request.json();
    
    console.log('Received Suno callback:', JSON.stringify(callbackData, null, 2));
    
    // 2. Verify callback source legitimacy (optional - implement as needed)
    // const isValidSource = await verifyCallbackSource(request);
    // if (!isValidSource) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const { taskId, status, data, type } = callbackData;
    
    if (!taskId) {
      console.error('Callback missing taskId');
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    // 3. Idempotency handling - avoid duplicate processing of same callback
    const taskKey = `${taskId}_${status}_${type}`;
    if (processedTasks.has(taskKey)) {
      console.log(`Task ${taskId} already processed, skipping duplicate`);
      return NextResponse.json({ 
        success: true, 
        message: 'Already processed',
        taskId: taskId,
        processedAt: new Date().toISOString()
      });
    }

    // Mark as processed
    processedTasks.add(taskKey);

    // 4. Return success response immediately to avoid blocking
    const response = NextResponse.json({ 
      success: true, 
      message: 'Callback received',
      taskId: taskId,
      processedAt: new Date().toISOString()
    });

    // 5. Process complex logic asynchronously to avoid blocking callback response
    setImmediate(() => {
      processCallbackAsync(callbackData);
    });
    
    // Log processing time to ensure it's within 15 seconds
    const processingTime = Date.now() - startTime;
    console.log(`Callback processing time: ${processingTime}ms`);
    
    return response;

  } catch (error) {
    console.error('Callback processing error:', error);
    
    // Return quick response even on error
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false,
        processedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Process callback data asynchronously
async function processCallbackAsync(callbackData: any) {
  try {
    const { taskId, status, data, type } = callbackData;
    
    // 6. Distinguish different callback types and handle appropriately
    if (type === 'complete' && status === 'SUCCESS' && data) {
      // Handle successfully completed callback
      console.log(`Task ${taskId} generation successful`);
      
      // Parse music data from response
      let musicData;
      if (typeof data.response === 'string') {
        musicData = JSON.parse(data.response);
      } else {
        musicData = data.response;
      }
      
      // Suno typically returns music data in array format in sunoData field
      const tracks = musicData?.sunoData || musicData?.data || [];
      
      console.log(`Received ${tracks.length} music tracks`);
      
      // Push success result to frontend (including all generated music)
      pushToClient(taskId, {
        type: 'complete',
        taskId,
        status: 'SUCCESS',
        music: tracks, // Pass complete music array
        count: tracks.length
      });
      
      // Here you can add other async operations:
      // - Save to database
      // - Send notification email
      // - Update user credits, etc.
      
    } else if (type === 'error' || status === 'FAILURE') {
      // Handle failed callback
      console.log(`Task ${taskId} generation failed`);
      
      pushToClient(taskId, {
        type: 'error',
        taskId,
        status: 'FAILURE',
        error: 'Music generation failed'
      });
      
    } else {
      console.log(`Unknown callback type: ${type}, status: ${status}`);
    }
    
  } catch (error) {
    console.error('Async callback processing failed:', error);
    // Errors here won't affect callback response, only log
  }
}

// Verify callback source legitimacy (optional implementation)
async function verifyCallbackSource(request: NextRequest): Promise<boolean> {
  // Can verify IP address, signature, token, etc.
  // Example: check authentication info in request headers
  const authHeader = request.headers.get('authorization');
  const userAgent = request.headers.get('user-agent');
  
  // Implement specific verification logic
  return true; // Temporarily return true, should implement verification logic
}

// Periodically clean processed task cache to avoid memory leaks
setInterval(() => {
  if (processedTasks.size > 1000) {
    processedTasks.clear();
    console.log('Processed task cache cleared');
  }
}, 60 * 60 * 1000); // Clean every hour