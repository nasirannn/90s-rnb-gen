"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";

interface IntroductionProps {
  icon: string;
  title: string;
  description: string;
}

interface GenreData {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
}

const genreData: GenreData[] = [
  {
    id: "new-jack-swing",
    title: "New Jack Swing",
    description: "Fused R&B melodies with hip-hop beats, giving R&B a harder, funkier edge. Key artists: Guy, Bobby Brown, Janet Jackson.",
    audioUrl: "/audio/sample1.mp3",
    duration: "3:45",
  },
  {
    id: "hip-hop-soul",
    title: "Hip-Hop Soul",
    description: "Blended hip-hop's gritty beats with emotional storytelling, making it the \"real voice of the streets.\" Key artists: Mary J. Blige, Jodeci.",
    audioUrl: "/audio/sample2.mp3",
    duration: "4:12",
  },
  {
    id: "neo-soul",
    title: "Neo-Soul",
    description: "Mixed classic soul with modern R&B, jazz, and funk. Poetic, organic, and deeply introspective. Key artists: Erykah Badu, D'Angelo.",
    audioUrl: "/audio/sample3.mp3",
    duration: "3:28",
  },
  {
    id: "quiet-storm",
    title: "Quiet Storm",
    description: "Slow tempos, lush arrangements, intimate lyrics. The soundtrack of late nights — silky, romantic, and designed for candlelit moods. Key artists: Babyface, Anita Baker, Toni Braxton.",
    audioUrl: "/audio/sample4.mp3",
    duration: "4:05",
  },
];

const benefitList: IntroductionProps[] = [
  {
    icon: "/icons/1940s-1960s.svg",
    title: "1. The Origins",
    description:
      "Early R&B emphasized strong rhythms, soulful vocals, and themes of love and everyday struggles. Artists like Ray Charles, Ruth Brown, and Sam Cooke brought gospel passion into secular music, while groups like The Drifters and The Coasters shaped the doo-wop tradition. This period laid the foundation for soul music and Motown.",
  },
  {
    icon: "/icons/1970s-1980s.svg",
    title: "2. The Soul & Funk Era",
    description:
      "During the 1970s, R&B evolved into richer, funkier sounds. Soul and funk influences created music that was both political and danceable. Aretha Franklin, Stevie Wonder, Marvin Gaye, and Earth, Wind & Fire defined this era with socially conscious lyrics, lush arrangements, and groove-heavy rhythms. The late '70s and early '80s also saw the rise of quiet storm radio formats—smooth, romantic R&B designed for late-night listening.",
  },
  {
    icon: "/icons/1990s.svg",
    title: "3. The Golden Age",
    description:
      "The 1990s are often called R&B's golden era, defined by innovation and crossover success. Subgenres flourished: New Jack Swing (Teddy Riley, Janet Jackson, Guy) fused R&B with hip-hop beats. Hip-Hop Soul (Mary J. Blige, Jodeci) blended raw hip-hop production with soulful vocals. Quiet Storm (Toni Braxton, Babyface) continued with smooth, mellow ballads. Neo-Soul (Erykah Badu, D'Angelo, Maxwell) brought jazz, funk, and conscious themes into modern R&B. This was the era of Boyz II Men, TLC, Brandy, Aaliyah, Usher, and many others, shaping the soundtrack of a generation.",
  },
  {
    icon: "/icons/2000s.svg",
    title: "4. Contemporary R&B",
    description:
      "In the 21st century, R&B fused even more with pop, electronic, and hip-hop. Artists like Beyoncé, Alicia Keys, Usher, and later The Weeknd, Frank Ocean, and H.E.R. pushed R&B into global mainstream. The production became more polished, incorporating trap beats, atmospheric synths, and experimental songwriting. Contemporary R&B spans a wide spectrum—from radio-friendly hits to underground, genre-bending sounds.",
  },
];

export const IntroductionSection = () => {
  const [currentTrack, setCurrentTrack] = useState<string>("new-jack-swing");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
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

  const handleAccordionChange = (value: string) => {
    // 切换显示流派信息，但不切换音频播放
    if (value) {
      setCurrentTrack(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentGenre = genreData.find(g => g.id === currentTrack);

  return (
    <section id="introduction" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Introduction</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What is R&B?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rhythm and Blues (R&B) is a genre that blends soulful vocals with rhythm-driven grooves. Emerging in the 1940s and evolving through soul, funk, and disco, R&B became one of the most influential genres shaping modern popular music.
          </p>
          <Link 
            href="/blog/a-journey-through-the-eras-of-rnb"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Read full article
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card key={title} className="bg-muted/50 dark:bg-card">
              <CardHeader>
                <div className="flex justify-between">
                  <Image
                    src={icon}
                    alt={`${title} icon`}
                    width={48}
                    height={48}
                    className="mb-6"
                  />
                  <span className="text-lg text-muted-foreground/70 font-medium">
                    {index === 0 && "1940s–1960s"}
                    {index === 1 && "1970s–1980s"}
                    {index === 2 && "1990s"}
                    {index === 3 && "2000s–Present"}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                <div className="line-clamp-4 overflow-hidden">
                  {description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 90s R&B Golden Era Section */}
      <div className="mt-24 grid lg:grid-cols-2 place-items-center lg:gap-24">
        {/* Audio Player */}
        <div className="order-2 lg:order-1 w-full max-w-lg">
          <div className="px-6 py-6">
              {/* Track Cover with Play Button */}
              <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎵</span>
                  </div>
                </div>
                
                {/* Play Button in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 shadow-lg"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </Button>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-sm px-2 py-1 rounded-md">
                    {currentGenre?.duration}
                  </div>
                </div>

                {/* Song Title at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {currentGenre?.title}
                  </h3>
                </div>
              </div>




          </div>
        </div>

        {/* Genre Accordion */}
        <div className="order-1 lg:order-2 w-full">
                      <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Link href="/blog/golden-era-90s-rnb-genres">
                  <h2 className="text-3xl md:text-4xl font-bold cursor-pointer hover:text-primary transition-colors">
                    4 Classic 90s R&B Genres
                  </h2>
                </Link>
                <Link 
                  href="/blog/golden-era-90s-rnb-genres"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                </Link>
              </div>
              <p className="text-lg text-muted-foreground">
                Explore the diverse sounds that defined a decade of soulful music...
              </p>
            </div>

          <Accordion 
            type="single" 
            collapsible 
            value={currentTrack}
            onValueChange={handleAccordionChange}
            className="w-full"
          >
            {genreData.map((genre, index) => (
              <AccordionItem key={genre.id} value={genre.id} className="border-border/50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`font-semibold cursor-pointer hover:text-primary transition-colors ${
                        currentTrack === genre.id ? 'text-primary' : 'text-foreground'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrack === genre.id) {
                          handlePlayPause();
                        } else {
                          setCurrentTrack(genre.id);
                          if (audioRef.current) {
                            audioRef.current.src = genre.audioUrl;
                            audioRef.current.play();
                            setIsPlaying(true);
                          }
                        }
                      }}
                    >
                      {index + 1}. {genre.title}
                    </span>
                    <div className="flex items-center justify-center w-4 h-4">
                      {currentTrack === genre.id && isPlaying && (
                        <div className="flex items-center gap-0.5">
                          <div className="w-0.5 h-3 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-0.5 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {genre.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        src={currentGenre?.audioUrl}
      />
    </section>
  );
};
