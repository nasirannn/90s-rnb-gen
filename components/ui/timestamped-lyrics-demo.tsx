'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTimestampedLyrics } from '@/hooks/use-timestamped-lyrics';
import { KaraokeLyrics } from './karaoke-lyrics';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface TimestampedLyricsDemoProps {
  className?: string;
}

export function TimestampedLyricsDemo({ className = '' }: TimestampedLyricsDemoProps) {
  const [taskId, setTaskId] = useState('');
  const [audioId, setAudioId] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    lyrics,
    currentLyricIndex,
    waveformData,
    isLoading,
    error,
    fetchLyrics,
    updateCurrentTime,
    clearLyrics,
  } = useTimestampedLyrics({
    currentTime,
  });

  const handleFetchLyrics = async () => {
    if (!taskId || !audioId) {
      alert('Please enter both Task ID and Audio ID');
      return;
    }
    await fetchLyrics(taskId, audioId);
  };

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
    updateCurrentTime(time);
  }, [updateCurrentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 模拟播放进度
  const simulatePlayback = useCallback(() => {
    if (!isPlaying || lyrics.length === 0) return;
    
    const lastLyric = lyrics[lyrics.length - 1];
    const totalDuration = lastLyric ? lastLyric.endTime : 0;
    
    if (currentTime >= totalDuration) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }
    
    setTimeout(() => {
      if (isPlaying) {
        const newTime = currentTime + 0.1; // 每100ms增加0.1秒
        handleTimeChange(newTime);
      }
    }, 100);
  }, [isPlaying, lyrics, currentTime, handleTimeChange]);

  // 当播放状态改变时，开始或停止模拟
  useEffect(() => {
    if (isPlaying) {
      simulatePlayback();
    }
  }, [isPlaying, simulatePlayback]);

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Timestamped Lyrics Demo</h3>
        
        {/* 输入区域 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taskId">Task ID</Label>
            <Input
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="Enter task ID from music generation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audioId">Audio ID</Label>
            <Input
              id="audioId"
              value={audioId}
              onChange={(e) => setAudioId(e.target.value)}
              placeholder="Enter audio ID"
            />
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-4">
          <Button onClick={handleFetchLyrics} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch Lyrics'}
          </Button>
          <Button onClick={clearLyrics} variant="outline">
            Clear Lyrics
          </Button>
        </div>

        {/* 播放控制 */}
        {lyrics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <div className="flex items-center gap-2">
                <Label>Time:</Label>
                <Input
                  type="number"
                  value={currentTime.toFixed(1)}
                  onChange={(e) => handleTimeChange(parseFloat(e.target.value) || 0)}
                  className="w-20"
                  step="0.1"
                />
                <span className="text-sm text-muted-foreground">seconds</span>
              </div>
            </div>

            {/* 进度条 */}
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-100"
                  style={{
                    width: lyrics.length > 0 
                      ? `${(currentTime / (lyrics[lyrics.length - 1]?.endTime || 1)) * 100}%`
                      : '0%'
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{lyrics.length > 0 ? lyrics[lyrics.length - 1]?.endTime.toFixed(1) : '0'}s</span>
              </div>
            </div>
          </div>
        )}

        {/* 错误显示 */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium">Error:</p>
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* 歌词显示 */}
        <KaraokeLyrics
          lyrics={lyrics}
          currentLyricIndex={currentLyricIndex}
          showWaveform={true}
          waveformData={waveformData}
          className="min-h-96"
        />
      </div>
    </div>
  );
}
