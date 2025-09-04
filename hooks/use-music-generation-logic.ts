export const useMusicGenerationLogic = () => {
  const handleGenerate = async (
    mode: "basic" | "custom",
    selectedMood: string,
    selectedGenre: string,
    selectedVibe: string,
    customPrompt: string,
    instrumentalMode: boolean,
    songTitle: string,
    grooveType: string,
    leadInstrument: string[],
    drumKit: string,
    bassTone: string,
    vocalStyle: string,
    vocalGender: string,
    harmonyPalette: string,
    bpm: number[],
    setIsGenerating: (value: boolean) => void,
    setAllGeneratedTracks: (tracks: any[]) => void,
    setActiveTrackIndex: (index: number) => void
  ) => {
    if (mode === "basic") {
      if (!selectedMood) {
        alert("Please select a mood");
        return;
      }
    } else {
      if (!selectedGenre || !selectedVibe) {
        alert("Please select genre and vibe");
        return;
      }
    }

    setIsGenerating(true);
    setAllGeneratedTracks([]);
    setActiveTrackIndex(0);

    try {
      // 构造完整的请求数据
      const requestData = {
        mode,
        mood: selectedMood,
        customPrompt,
        instrumentalMode,
        genre: selectedGenre,
        vibe: selectedVibe,
        songTitle,
        grooveType,
        leadInstrument,
        drumKit,
        bassTone,
        vocalStyle,
        vocalGender,
        harmonyPalette,
        bpm: bpm[0]
      };

      console.log('Request data:', requestData);

      // 调用真实API
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Music generation failed');
      }

      const result = await response.json();
      console.log('API result:', result);

      if (result.success && result.data?.taskId) {
        console.log('Music generation started, taskId:', result.data.taskId);

        // 建立SSE连接等待回调结果
        const taskId = result.data.taskId;
        const eventSource = new EventSource(`/api/music-stream?taskId=${taskId}`);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received SSE data:', data);

            if (data.type === 'complete' && data.music) {
              console.log(`Received ${data.music.length} generated tracks`);

              // 转换Suno API数据格式为前端格式
              const tracks = data.music.map((track: any, index: number) => ({
                audioUrl: track.audio_url || track.audioUrl,
                title: track.title || `Generated Track ${String.fromCharCode(65 + index)}`,
                duration: track.duration || 180,
                genre: mode === "basic" ? "contemporary-rnb" : selectedGenre,
                mood: selectedMood,
                vibe: mode === "basic" ? "polished" : selectedVibe,
                coverImage: track.image_url || track.imageUrl || null
              }));

              setAllGeneratedTracks(tracks);
              setIsGenerating(false);
              eventSource.close();

            } else if (data.type === 'error') {
              console.error('Music generation failed via callback');
              throw new Error('Music generation failed');
            }

          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          eventSource.close();
          setIsGenerating(false);
          throw new Error('Connection to music generation service failed');
        };

        // 设置30秒超时
        setTimeout(() => {
          if (eventSource.readyState !== EventSource.CLOSED) {
            eventSource.close();
            setIsGenerating(false);
            throw new Error('Music generation timeout');
          }
        }, 30000);

      } else {
        throw new Error('Failed to start music generation');
      }

    } catch (error) {
      console.error("Music generation failed:", error);
      alert(error instanceof Error ? error.message : "Music generation failed, please try again");
      setIsGenerating(false);
    }
  };

  return {
    handleGenerate,
  };
};
