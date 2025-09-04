'use client';

import { useEffect, useRef } from 'react';
import { FormattedLyric } from '@/hooks/use-timestamped-lyrics';

interface KaraokeLyricsProps {
  lyrics: FormattedLyric[];
  currentLyricIndex: number;
  className?: string;
  showWaveform?: boolean;
  waveformData?: number[];
}

export function KaraokeLyrics({ 
  lyrics, 
  currentLyricIndex, 
  className = '',
  showWaveform = false,
  waveformData = []
}: KaraokeLyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // 自动滚动到当前歌词
  useEffect(() => {
    if (activeLyricRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeElement = activeLyricRef.current;
      
      const containerHeight = container.clientHeight;
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.clientHeight;
      
      // 计算滚动位置，让当前歌词居中显示
      const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [currentLyricIndex]);

  // 渲染波形数据
  const renderWaveform = () => {
    if (!showWaveform || waveformData.length === 0) return null;
    
    const maxValue = Math.max(...waveformData);
    
    return (
      <div className="flex items-end justify-center space-x-1 h-16 mb-4">
        {waveformData.slice(0, 100).map((value, index) => (
          <div
            key={index}
            className="bg-primary/60 rounded-sm transition-all duration-100"
            style={{
              width: '2px',
              height: `${(value / maxValue) * 100}%`,
              minHeight: '2px'
            }}
          />
        ))}
      </div>
    );
  };

  if (lyrics.length === 0) {
    return (
      <div className={`text-center text-muted-foreground py-8 ${className}`}>
        <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <p>No lyrics available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {renderWaveform()}
      
      <div 
        ref={containerRef}
        className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        <div className="space-y-2 text-center">
          {lyrics.map((lyric, index) => (
            <div
              key={lyric.id}
              ref={index === currentLyricIndex ? activeLyricRef : null}
              className={`
                px-4 py-2 rounded-lg transition-all duration-300
                ${index === currentLyricIndex 
                  ? 'bg-primary text-primary-foreground scale-105 shadow-lg' 
                  : index < currentLyricIndex
                    ? 'text-muted-foreground opacity-60'
                    : 'text-foreground opacity-80'
                }
              `}
            >
              <div className="text-lg font-medium leading-relaxed">
                {lyric.text}
              </div>
              
              {/* 显示时间信息（可选） */}
              <div className="text-xs opacity-70 mt-1">
                {Math.floor(lyric.startTime / 60)}:{(lyric.startTime % 60).toFixed(1).padStart(4, '0')} - 
                {Math.floor(lyric.endTime / 60)}:{(lyric.endTime % 60).toFixed(1).padStart(4, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
