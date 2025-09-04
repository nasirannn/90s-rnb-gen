import { useState } from "react";

export const useLyricsGeneration = () => {
  // Lyrics Generation States
  const [showLyricsDialog, setShowLyricsDialog] = useState(false);
  const [lyricsPrompt, setLyricsPrompt] = useState("");
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);

  const handleGenerateLyrics = async (setCustomPrompt: (value: string) => void) => {
    if (!lyricsPrompt.trim()) {
      alert("Please enter a prompt for lyrics generation");
      return;
    }

    setIsGeneratingLyrics(true);

    try {
      console.log('Starting AI lyrics generation with prompt:', lyricsPrompt);

      // 调用歌词生成API
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: lyricsPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lyrics generation failed');
      }

      const result = await response.json();
      console.log('Lyrics API result:', result);

      if (result.success && result.data?.taskId) {
        console.log('Lyrics generation started, taskId:', result.data.taskId);

        // 建立SSE连接等待回调结果
        const taskId = result.data.taskId;
        const eventSource = new EventSource(`/api/music-stream?taskId=${taskId}`);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received lyrics SSE data:', data);

            if (data.type === 'lyrics_complete' && data.lyrics) {
              console.log('Received generated lyrics:', data.lyrics.title);

              // 将生成的歌词填入文本框
              setCustomPrompt(data.lyrics.text);
              setIsGeneratingLyrics(false);
              setShowLyricsDialog(false);
              setLyricsPrompt("");
              eventSource.close();

            } else if (data.type === 'lyrics_error') {
              console.error('Lyrics generation failed via callback:', data.error);

              // 根据错误状态显示不同的错误信息
              if (data.error && data.error.includes('moderation')) {
                alert('歌词生成失败：内容被标记为需要审核，请尝试使用不同的提示词');
              } else {
                alert(`歌词生成失败：${data.error}`);
              }

              setIsGeneratingLyrics(false);
              eventSource.close();
            }

          } catch (parseError) {
            console.error('Failed to parse lyrics SSE data:', parseError);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Lyrics SSE connection error:', error);
          eventSource.close();
          setIsGeneratingLyrics(false);
          throw new Error('Connection to lyrics generation service failed');
        };

        // 设置30秒超时
        setTimeout(() => {
          if (eventSource.readyState !== EventSource.CLOSED) {
            eventSource.close();
            setIsGeneratingLyrics(false);
            throw new Error('Lyrics generation timeout');
          }
        }, 30000);

      } else {
        throw new Error('Failed to start lyrics generation');
      }

    } catch (error) {
      console.error("Lyrics generation failed:", error);
      alert(error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : "Lyrics generation failed, please try again");
      setIsGeneratingLyrics(false);
    }
  };

  return {
    // States
    showLyricsDialog, setShowLyricsDialog,
    lyricsPrompt, setLyricsPrompt,
    isGeneratingLyrics, setIsGeneratingLyrics,
    
    // Functions
    handleGenerateLyrics,
  };
};
