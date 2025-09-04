"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, ArrowRight } from "lucide-react";

interface ShowcaseTrack {
  id: string;
  title: string;
  creator: string;
  duration: string;
  audioUrl: string;
  coverImage?: string;
  genre?: string;
}

const showcaseTracks: ShowcaseTrack[] = [
  {
    id: "1",
    title: "Cybernetic Dreams",
    creator: "Created By Electronic Pulse",
    duration: "3:45",
    audioUrl: "/audio/sample1.mp3",
    genre: "Electronic",
  },
  {
    id: "2", 
    title: "Whispers of the Cosmos",
    creator: "Created By Ambient Chill",
    duration: "4:12",
    audioUrl: "/audio/sample2.mp3",
    genre: "Ambient",
  },
  {
    id: "3",
    title: "Neon Samurai",
    creator: "Created By Synthwave",
    duration: "2:58",
    audioUrl: "/audio/sample3.mp3",
    genre: "Synthwave",
  },
  {
    id: "4",
    title: "Endless Highways",
    creator: "Created By female vocals, pop",
    duration: "2:45",
    audioUrl: "/audio/sample4.mp3",
    genre: "Pop",
  },
];

export const ShowcaseSection = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = (trackId: string) => {
    if (currentTrack === trackId && isPlaying) {
      // Pause current track
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Play new track or resume current
      if (currentTrack !== trackId) {
        setCurrentTrack(trackId);
        const track = showcaseTracks.find(t => t.id === trackId);
        if (track && audioRef.current) {
          audioRef.current.src = track.audioUrl;
        }
      }
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section id="showcase" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
            Showcase
          </h2>

          <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
            Listen to AI-Generated 90s R&B
          </h2>

          <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
            Experience the authentic sound of 90s R&B music created by our AI. 
            Each track showcases different styles and moods from the golden era.
          </h3>
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {showcaseTracks.map((track) => (
            <Card key={track.id} className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardContent className="p-0">
                {/* Track Cover */}
                <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎵</span>
                    </div>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                      onClick={() => handlePlayPause(track.id)}
                    >
                      {currentTrack === track.id && isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-sm px-2 py-1 rounded-md">
                      {track.duration}
                    </div>
                  </div>
                </div>

                {/* Track Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {track.creator}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg">
            Explore More Tracks
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Audio Player Controls */}
        {currentTrack && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-4">
            <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <Button
                    size="sm"
                    className="w-10 h-10 rounded-full"
                    onClick={() => handlePlayPause(currentTrack)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </Button>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {showcaseTracks.find(t => t.id === currentTrack)?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {showcaseTracks.find(t => t.id === currentTrack)?.genre}
                    </p>
                  </div>

                  {/* Time Display */}
                  <div className="text-xs text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* Mute Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTrack(null);
          }}
        />
      </div>
    </section>
  );
};
