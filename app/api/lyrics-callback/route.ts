import { NextRequest, NextResponse } from 'next/server';
import { pushToClient } from '@/lib/sse-connections';

// Cache for processed tasks to handle idempotency
const processedLyricsTasks = new Set<string>();

// Handle Lyrics API callbacks
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Fast response - must return response within 15 seconds
    const callbackData = await request.json();
    
    console.log('Received Lyrics callback:', JSON.stringify(callbackData, null, 2));
    
    const { code, msg, data } = callbackData;
    const taskId = data?.task_id;
    
    if (!taskId) {
      console.error('Lyrics callback missing taskId');
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    // 3. Idempotency handling - avoid duplicate processing of same callback
    const taskKey = `lyrics_${taskId}_${code}`;
    if (processedLyricsTasks.has(taskKey)) {
      console.log(`Lyrics task ${taskId} already processed, skipping duplicate`);
      return NextResponse.json({ 
        success: true, 
        message: 'Already processed',
        taskId: taskId,
        processedAt: new Date().toISOString()
      });
    }

    // Mark as processed
    processedLyricsTasks.add(taskKey);

    // 4. Return success response immediately to avoid blocking
    const response = NextResponse.json({ 
      success: true, 
      message: 'Lyrics callback received',
      taskId: taskId,
      processedAt: new Date().toISOString()
    });

    // 5. Process complex logic asynchronously to avoid blocking callback response
    setImmediate(() => {
      processLyricsCallbackAsync(callbackData);
    });
    
    // Log processing time to ensure it's within 15 seconds
    const processingTime = Date.now() - startTime;
    console.log(`Lyrics callback processing time: ${processingTime}ms`);
    
    return response;

  } catch (error) {
    console.error('Lyrics callback processing error:', error);
    
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

// Process lyrics callback data asynchronously
async function processLyricsCallbackAsync(callbackData: any) {
  try {
    const { code, msg, data } = callbackData;
    const taskId = data?.task_id;
    
    if (code === 200 && data?.callbackType === 'complete') {
      // Handle successfully completed callback
      console.log(`Lyrics task ${taskId} generation successful`);
      
      // 检查是否有歌词数据 - 根据真实API响应，成功时data.data是数组，失败时是null
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const successfulLyrics = data.data.find((item: any) => item.status === 'complete');
        
        if (successfulLyrics) {
          console.log(`Generated lyrics: ${successfulLyrics.title}`);
          
          // Push success result to frontend
          pushToClient(taskId, {
            type: 'lyrics_complete',
            taskId,
            status: 'SUCCESS',
            lyrics: {
              title: successfulLyrics.title,
              text: successfulLyrics.text
            }
          });
        } else {
          // 所有歌词都失败
          console.log(`All lyrics generation failed for task ${taskId}`);
          
          pushToClient(taskId, {
            type: 'lyrics_error',
            taskId,
            status: 'FAILURE',
            error: 'All lyrics generation attempts failed'
          });
        }
      } else {
        // data.data 为 null 或空数组，说明生成失败（如moderation failed）
        console.log(`Lyrics generation failed for task ${taskId}: ${msg}`);
        
        pushToClient(taskId, {
          type: 'lyrics_error',
          taskId,
          status: 'FAILURE',
          error: msg || 'Lyrics generation failed'
        });
      }
      
    } else {
      // Handle failed callback (非200状态码)
      console.log(`Lyrics task ${taskId} generation failed: ${msg}`);
      
      pushToClient(taskId, {
        type: 'lyrics_error',
        taskId,
        status: 'FAILURE',
        error: msg || 'Lyrics generation failed'
      });
    }
    
  } catch (error) {
    console.error('Async lyrics callback processing failed:', error);
    // Errors here won't affect callback response, only log
  }
}

// Periodically clean processed task cache to avoid memory leaks
setInterval(() => {
  if (processedLyricsTasks.size > 1000) {
    processedLyricsTasks.clear();
    console.log('Processed lyrics task cache cleared');
  }
}, 60 * 60 * 1000); // Clean every hour
