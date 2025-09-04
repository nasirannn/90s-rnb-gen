import { useState, useRef } from "react";

export const useAudioPlayer = () => {
  // Audio Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTrackSelect = (index: number) => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setCurrentTime(0);
    setDuration(0);
    return { setCurrentTime, setDuration, setIsPlaying };
  };

  const togglePlayPause = (currentTrack: any) => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioLoad = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleDownload = async (currentTrack: any) => {
    if (!currentTrack?.audioUrl) return;

    try {
      const response = await fetch(currentTrack.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${currentTrack.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed, please try again');
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle volume interaction (click + drag)
  const handleVolumeInteraction = (e: React.MouseEvent) => {
    const slider = e.currentTarget.parentElement;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();

    const updateVolume = (clientX: number) => {
      const width = rect.width;
      const left = rect.left;

      // 计算音量：从左到右，0% 到 100%
      let newVolume = (clientX - left) / width;

      // 限制在0-1范围内
      newVolume = Math.max(0, Math.min(1, newVolume));

      setVolume(newVolume);
      setIsMuted(false); // 调节音量时取消静音

      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    };

    // 初始点击位置
    updateVolume(e.clientX);

    // 拖拽处理
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateVolume(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mute/unmute
  const handleMuteToggle = () => {
    if (isMuted) {
      // 取消静音，恢复之前的音量
      setVolume(previousVolume);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume;
      }
      setIsMuted(false);
    } else {
      // 静音，保存当前音量
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  };

  return {
    // States
    isPlaying, setIsPlaying,
    currentTime, setCurrentTime,
    duration, setDuration,
    volume, setVolume,
    isMuted, setIsMuted,
    previousVolume, setPreviousVolume,
    audioRef,
    
    // Functions
    handleTrackSelect,
    togglePlayPause,
    handleAudioLoad,
    handleTimeUpdate,
    handleAudioEnd,
    handleDownload,
    formatTime,
    handleVolumeInteraction,
    handleMuteToggle,
  };
};
