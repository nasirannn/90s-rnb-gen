"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Custom Hooks
import { useMusicGeneration } from "@/hooks/use-music-generation";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useLyricsGeneration } from "@/hooks/use-lyrics-generation";
import { useMusicGenerationLogic } from "@/hooks/use-music-generation-logic";

// Components
import { StudioSidebar } from "./studio-sidebar";
import { CassetteTape } from "@/components/ui/cassette-tape";

// Data
import musicOptions from '@/data/music-options.json';

const { mockLibraryData } = musicOptions;

export const StudioSection = () => {
    // Custom Hooks
    const musicGeneration = useMusicGeneration();
    const audioPlayer = useAudioPlayer();
    const lyricsGeneration = useLyricsGeneration();
    const musicGenerationLogic = useMusicGenerationLogic();

    // UI States
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLibrary, setShowLibrary] = useState(false);
    const [selectedLibraryTrack, setSelectedLibraryTrack] = useState<number | null>(null);

    // Destructure states and functions
    const {
        mode, setMode,
        selectedGenre, setSelectedGenre,
        selectedMood, setSelectedMood,
        selectedVibe, setSelectedVibe,
        customPrompt, setCustomPrompt,
        songTitle, setSongTitle,
        instrumentalMode, setInstrumentalMode,
        keepPrivate, setKeepPrivate,
        bpm, setBpm,
        grooveType, setGrooveType,
        leadInstrument, setLeadInstrument,
        drumKit, setDrumKit,
        bassTone, setBassTone,
        vocalStyle, setVocalStyle,
        vocalGender, setVocalGender,
        harmonyPalette, setHarmonyPalette,
        isGenerating, setIsGenerating,
        allGeneratedTracks, setAllGeneratedTracks,
        activeTrackIndex, setActiveTrackIndex,
    } = musicGeneration;

    const {
        isPlaying, setIsPlaying,
        currentTime, setCurrentTime,
        duration, setDuration,
        volume, setVolume,
        isMuted, setIsMuted,
        previousVolume, setPreviousVolume,
        audioRef,
        handleTrackSelect,
        togglePlayPause,
        handleAudioLoad,
        handleTimeUpdate,
        handleAudioEnd,
        handleDownload,
        formatTime,
        handleVolumeInteraction,
        handleMuteToggle,
    } = audioPlayer;

    const {
        showLyricsDialog, setShowLyricsDialog,
        lyricsPrompt, setLyricsPrompt,
        isGeneratingLyrics, setIsGeneratingLyrics,
        handleGenerateLyrics: handleGenerateLyricsHook,
    } = lyricsGeneration;

    // Utility functions
    const currentTrack = allGeneratedTracks[activeTrackIndex];

    // Event handlers
    const handleGenerate = () => musicGenerationLogic.handleGenerate(
        mode, selectedMood, selectedGenre, selectedVibe, customPrompt,
        instrumentalMode, songTitle, grooveType, leadInstrument, drumKit,
        bassTone, vocalStyle, vocalGender, harmonyPalette, bpm,
        setIsGenerating, setAllGeneratedTracks, setActiveTrackIndex
    );

    const handleGenerateLyrics = () => handleGenerateLyricsHook(setCustomPrompt);

    return (
        <>
            <section id="studio" className="h-screen flex bg-background">
                {/* ========================================================================= */}
                {/* LEFT SIDEBAR */}
                {/* ========================================================================= */}
                <StudioSidebar
                    sidebarOpen={sidebarOpen}
                    showLibrary={showLibrary}
                    selectedLibraryTrack={selectedLibraryTrack}
                    setSidebarOpen={setSidebarOpen}
                    setShowLibrary={setShowLibrary}
                    setSelectedLibraryTrack={setSelectedLibraryTrack}
                    mode={mode}
                    setMode={setMode}
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                    selectedMood={selectedMood}
                    setSelectedMood={setSelectedMood}
                    selectedVibe={selectedVibe}
                    setSelectedVibe={setSelectedVibe}
                    customPrompt={customPrompt}
                    setCustomPrompt={setCustomPrompt}
                    songTitle={songTitle}
                    setSongTitle={setSongTitle}
                    instrumentalMode={instrumentalMode}
                    setInstrumentalMode={setInstrumentalMode}
                    keepPrivate={keepPrivate}
                    setKeepPrivate={setKeepPrivate}
                    bpm={bpm}
                    setBpm={setBpm}
                    grooveType={grooveType}
                    setGrooveType={setGrooveType}
                    leadInstrument={leadInstrument}
                    setLeadInstrument={setLeadInstrument}
                    drumKit={drumKit}
                    setDrumKit={setDrumKit}
                    bassTone={bassTone}
                    setBassTone={setBassTone}
                    vocalStyle={vocalStyle}
                    setVocalStyle={setVocalStyle}
                    vocalGender={vocalGender}
                    setVocalGender={setVocalGender}
                    harmonyPalette={harmonyPalette}
                    setHarmonyPalette={setHarmonyPalette}
                    showLyricsDialog={showLyricsDialog}
                    setShowLyricsDialog={setShowLyricsDialog}
                    handleGenerateLyrics={handleGenerateLyrics}
                    isGeneratingLyrics={isGeneratingLyrics}
                    lyricsPrompt={lyricsPrompt}
                    setLyricsPrompt={setLyricsPrompt}
                    isGenerating={isGenerating}
                    handleGenerate={handleGenerate}
                />

                {/* ========================================================================= */}
                {/* RIGHT CONTENT AREA */}
                {/* ========================================================================= */}
                <div 
                    className="flex-1 h-full flex flex-col relative"
                    style={{
                        backgroundImage: (() => {
                            // 优先使用当前播放的歌曲封面
                            if (currentTrack?.coverImage) {
                                return `url(${currentTrack.coverImage})`;
                            }
                            // 如果没有当前歌曲，使用选中的库歌曲封面
                            if (selectedLibraryTrack !== null) {
                                const libraryTrack = mockLibraryData.find(track => track.id === selectedLibraryTrack);
                                if (libraryTrack?.coverImage) {
                                    return `url(${libraryTrack.coverImage})`;
                                }
                            }
                            // 默认渐变背景
                            return 'linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--muted)) / 0.2)';
                        })(),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* 背景遮罩层 */}
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-sm z-0" />
                    {/* Main Content Display */}
                    <div className="flex-1 flex items-center justify-center p-8 relative z-20">
                        {(allGeneratedTracks.length > 0 && !isGenerating) || selectedLibraryTrack !== null ? (
                            <div className="space-y-8">
                                {/* Current Track Display */}
                                {currentTrack && (
                                    <div className="text-center space-y-8">
                                        {/* 专辑封面 - 居中显示 */}
                                        <div className="flex justify-center">
                                            <div className="relative w-48 h-48">
                                                <div className="w-48 h-48 bg-black rounded-full border-4 border-gray-800 flex items-center justify-center overflow-hidden">
                                                    {currentTrack.coverImage ? (
                                                        <Image
                                                            src={currentTrack.coverImage}
                                                            alt={currentTrack.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-orange-500 via-red-600 to-yellow-500 flex items-center justify-center">
                                                            <Music className="w-16 h-16 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 版本选择器 */}
                                        {allGeneratedTracks.length > 1 && (
                                            <div className="flex items-center justify-center gap-3">
                                                {allGeneratedTracks.map((track: any, index: number) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleTrackSelect(index)}
                                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${activeTrackIndex === index
                                                            ? 'bg-primary scale-125'
                                                            : 'bg-muted hover:bg-muted/80'
                                                            }`}
                                                        title={`Version ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* 歌曲信息 - 简洁排版 */}
                                        <div className="text-center space-y-4">
                                            <h3 className="text-3xl font-bold text-foreground">{currentTrack.title}</h3>
                                        </div>

                                        {/* 进度条 - 极简设计 */}
                                        <div className="space-y-3 max-w-md mx-auto">
                                            <div className="flex justify-between text-lg text-muted-foreground font-mono">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                            <div
                                                className="w-full h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
                                                onClick={(e) => {
                                                    if (audioRef.current && duration > 0) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const percent = (e.clientX - rect.left) / rect.width;
                                                        const newTime = percent * duration;
                                                        audioRef.current.currentTime = newTime;
                                                        setCurrentTime(newTime);
                                                    }
                                                }}
                                            >
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                                                />
                                            </div>
                                        </div>

                                        {/* 播放控制 - 简洁按钮 */}
                                        <div className="flex items-center justify-center gap-8">
                                            <button className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => togglePlayPause(currentTrack)}
                                                className="h-16 w-16 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full"
                                            >
                                                {isPlaying ? (
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </button>

                                            <button className="h-12 w-12 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Library 选中项目展示 - 重新布局 */}
                                {selectedLibraryTrack !== null && !currentTrack && (
                                    <div className="w-full max-w-4xl mx-auto space-y-8">
                                        {/* 1. 磁带 */}
                                        <div className="flex justify-center items-center -mt-8">
                                            <div className="w-[447px] h-[304px] relative z-10">
                                                <CassetteTape 
                                                    sideLetter={selectedLibraryTrack % 2 === 0 ? "A" : "B"}
                                                    duration={(() => {
                                                        const track = mockLibraryData.find(track => track.id === selectedLibraryTrack);
                                                        if (!track) return "5min";
                                                        
                                                        // 模拟计算时长（实际应该从API获取）
                                                        const duration = Math.floor(Math.random() * 4) + 3; // 3-6分钟
                                                        return `${duration}min`;
                                                    })()}
                                                    title={(() => {
                                                        const track = mockLibraryData.find(track => track.id === selectedLibraryTrack);
                                                        return track?.title || 'Track Title';
                                                    })()}
                                                    isPlaying={isPlaying}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        </div>


                                        {/* 2. 歌词 */}
                                        <div className="max-w-3xl mx-auto">
                                            {mockLibraryData.find(track => track.id === selectedLibraryTrack)?.lyrics ? (
                                                <div className="p-8">
                                                    <div className="text-foreground leading-relaxed whitespace-pre-line text-lg text-center max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                                                        {mockLibraryData.find(track => track.id === selectedLibraryTrack)?.lyrics}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-muted to-muted/70 rounded-full flex items-center justify-center border-2 border-dashed border-border mb-4">
                                                        <Music className="w-12 h-12 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-foreground mb-2">纯音乐</h3>
                                                    <p className="text-muted-foreground">
                                                        这是一首纯音乐作品，请欣赏旋律
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. 播放器 - 悬浮在右侧主内容区底部 */}
                                        <div className="absolute bottom-6 left-6 right-6 bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-4 shadow-lg z-30 max-h-20">
                                            <div className="flex items-center gap-4 h-full">
                                                {/* 左侧：播放控制按钮 */}
                                                <div className="flex items-center gap-3">
                                                    {/* 上一首 */}
                                                    <button
                                                        onClick={() => {
                                                            const currentIndex = mockLibraryData.findIndex(track => track.id === selectedLibraryTrack);
                                                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : mockLibraryData.length - 1;
                                                            setSelectedLibraryTrack(mockLibraryData[prevIndex].id);
                                                        }}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-all duration-200 flex items-center justify-center"
                                                        title="Previous Track"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>

                                                    {/* 播放/暂停 */}
                                                    <button
                                                        onClick={() => togglePlayPause(currentTrack)}
                                                        className="h-10 w-10 p-0 text-foreground hover:bg-muted/80 rounded-full transition-all duration-200 flex items-center justify-center"
                                                    >
                                                        {isPlaying ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* 下一首 */}
                                                    <button
                                                        onClick={() => {
                                                            const currentIndex = mockLibraryData.findIndex(track => track.id === selectedLibraryTrack);
                                                            const nextIndex = currentIndex < mockLibraryData.length - 1 ? currentIndex + 1 : 0;
                                                            setSelectedLibraryTrack(mockLibraryData[nextIndex].id);
                                                        }}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-all duration-200 flex items-center justify-center"
                                                        title="Next Track"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* 中间：进度条和时间 */}
                                                <div className="flex-1 flex flex-col justify-center space-y-2">
                                                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                                        <span>{formatTime(currentTime)}</span>
                                                        <span>{formatTime(duration)}</span>
                                                    </div>
                                                    <div
                                                        className="w-full h-1.5 bg-muted rounded-full cursor-pointer overflow-hidden"
                                                        onClick={(e) => {
                                                            if (audioRef.current && duration > 0) {
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                const percent = (e.clientX - rect.left) / rect.width;
                                                                const newTime = percent * duration;
                                                                audioRef.current.currentTime = newTime;
                                                                setCurrentTime(newTime);
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            className="h-full bg-primary rounded-full transition-all duration-300"
                                                            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* 右侧：下载按钮 */}
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => {
                                                            const track = mockLibraryData.find(track => track.id === selectedLibraryTrack);
                                                            if (track) {
                                                                // 创建模拟的下载链接
                                                                const link = document.createElement('a');
                                                                link.href = '#'; // 模拟链接
                                                                link.download = `${track.title}.mp3`;
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                
                                                                // 显示提示信息
                                                                alert('下载功能将在实际部署时启用');
                                                            }
                                                        }}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-all duration-200 flex items-center justify-center"
                                                        title="Download Track"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Audio Element */}
                                {currentTrack && (
                                    <audio
                                        ref={audioRef}
                                        src={currentTrack.audioUrl}
                                        onLoadedMetadata={handleAudioLoad}
                                        onTimeUpdate={handleTimeUpdate}
                                        onEnded={handleAudioEnd}
                                        preload="metadata"
                                    />
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center text-center space-y-8">
                                <div className="w-48 h-48 mx-auto bg-muted/50 rounded-full flex items-center justify-center border-2 border-dashed border-border">
                                    <Music className="w-20 h-20 text-muted-foreground" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold">Ready to Create Music</h3>
                                    <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                                        Select your preferences and hit generate to create your 90s R&B masterpiece
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}; 
