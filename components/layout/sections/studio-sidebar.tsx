"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Music, Library, Minus, Plus, Sparkles, Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import musicOptions from '@/data/music-options.json';
import { generateMusicPrompt } from '@/lib/prompt-generator';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import AuthModal from '@/components/ui/auth-modal';
import { Skeleton } from '@/components/ui/skeleton';

// 智能Tooltip组件
const SmartTooltip = ({ children, content, position = "right" }: { 
  children: React.ReactNode; 
  content: string; 
  position?: "right" | "left" | "top" | "bottom" 
}) => {
  const getTooltipClasses = () => {
    const baseClasses = "absolute px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] shadow-xl border border-white/10 pointer-events-none";
    
    switch (position) {
      case "left":
        return `${baseClasses} right-full mr-3 top-1/2 transform -translate-y-1/2`;
      case "top":
        return `${baseClasses} bottom-full mb-3 left-1/2 transform -translate-x-1/2`;
      case "bottom":
        return `${baseClasses} top-full mt-3 left-1/2 transform -translate-x-1/2`;
      default: // right
        return `${baseClasses} left-full ml-3 top-1/2 transform -translate-y-1/2`;
    }
  };

  return (
    <div className="relative group">
      {children}
      <div className={getTooltipClasses()}>
        {content}
      </div>
    </div>
  );
};

const { 
  genres, 
  moods, 
  vibes, 
  grooveTypes, 
  leadInstruments, 
  drumKits, 
  bassTones, 
  vocalGenders, 
  harmonyPalettes,
  mockLibraryData
} = musicOptions;

interface StudioSidebarProps {
  sidebarOpen: boolean;
  showLibrary: boolean;
  selectedLibraryTrack: number | null;
  setSidebarOpen: (open: boolean) => void;
  setShowLibrary: (show: boolean) => void;
  setSelectedLibraryTrack: (id: number | null) => void;
  
  // Music generation states
  mode: "basic" | "custom";
  setMode: (mode: "basic" | "custom") => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  selectedVibe: string;
  setSelectedVibe: (vibe: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  songTitle: string;
  setSongTitle: (title: string) => void;
  instrumentalMode: boolean;
  setInstrumentalMode: (mode: boolean) => void;
  keepPrivate: boolean;
  setKeepPrivate: (isPrivate: boolean) => void;
  bpm: number[];
  setBpm: (bpm: number[]) => void;
  grooveType: string;
  setGrooveType: (type: string) => void;
  leadInstrument: string[];
  setLeadInstrument: (instruments: string[]) => void;
  drumKit: string;
  setDrumKit: (kit: string) => void;
  bassTone: string;
  setBassTone: (tone: string) => void;
  vocalStyle: string;
  setVocalStyle: (style: string) => void;
  vocalGender: string;
  setVocalGender: (gender: string) => void;
  harmonyPalette: string;
  setHarmonyPalette: (palette: string) => void;
  
  // Lyrics generation
  showLyricsDialog: boolean;
  setShowLyricsDialog: (show: boolean) => void;
  handleGenerateLyrics: () => void;
  isGeneratingLyrics: boolean;
  lyricsPrompt: string;
  setLyricsPrompt: (prompt: string) => void;
  
  // Generation
  isGenerating: boolean;
  handleGenerate: () => void;
}

export const StudioSidebar = (props: StudioSidebarProps) => {
  const [bpmMode, setBpmMode] = React.useState<'slow' | 'moderate' | 'medium' | 'custom'>('slow');
  
  // Authentication state
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  
  // Credits state
  const { credits, consumeCredit } = useCredits();
  
  // Handle generate button click with auth and credits check
  const handleGenerateWithAuth = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (credits <= 0) {
      // TODO: Show credits insufficient modal
      alert("Insufficient credits! Please purchase more credits to continue.");
      return;
    }
    
    // Consume credit and generate
    if (consumeCredit()) {
      handleGenerate();
    }
  };
  
  const {
    sidebarOpen,
    showLibrary,
    selectedLibraryTrack,
    setSidebarOpen,
    setShowLibrary,
    setSelectedLibraryTrack,
    mode,
    setMode,
    selectedGenre,
    setSelectedGenre,
    selectedMood,
    setSelectedMood,
    selectedVibe,
    setSelectedVibe,
    customPrompt,
    setCustomPrompt,
    songTitle,
    setSongTitle,
    instrumentalMode,
    setInstrumentalMode,
    keepPrivate,
    setKeepPrivate,
    bpm,
    setBpm,
    grooveType,
    setGrooveType,
    leadInstrument,
    setLeadInstrument,
    drumKit,
    setDrumKit,
    bassTone,
    setBassTone,
    vocalStyle,
    setVocalStyle,
    vocalGender,
    setVocalGender,
    harmonyPalette,
    setHarmonyPalette,
    showLyricsDialog,
    setShowLyricsDialog,
    handleGenerateLyrics,
    isGeneratingLyrics,
    lyricsPrompt,
    setLyricsPrompt,
    isGenerating,
    handleGenerate,
  } = props;

  return (
    <div className={`transition-all duration-300 ease-in-out bg-muted/30 ${sidebarOpen ? 'w-[32rem]' : 'w-16'} h-full flex`}>
      {/* Always Visible Navigation Tab */}
      <div className="w-16 h-full flex flex-col bg-muted/30">
        <div className="flex flex-col items-center gap-4 p-4">
          {/* Home Button */}
          <SmartTooltip content="Home" position="right">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 rounded-xl"
            >
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </Link>
            </Button>
          </SmartTooltip>

          {/* Studio Button */}
          <SmartTooltip content="Create" position="right">
            <Button
              onClick={() => {
                setShowLibrary(false);
                setSidebarOpen(true);
              }}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 rounded-xl ${sidebarOpen && !showLibrary ? 'bg-white text-black' : 'text-muted-foreground hover:text-white'}`}
            >
              <Music className="h-5 w-5" />
            </Button>
          </SmartTooltip>

          {/* Library Button */}
          <SmartTooltip content="Library" position="right">
            <Button
              onClick={() => {
                setShowLibrary(true);
                setSidebarOpen(true);
              }}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 rounded-xl ${sidebarOpen && showLibrary ? 'bg-white text-black' : 'text-muted-foreground hover:text-white'}`}
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Library className="h-5 w-5" />
              )}
            </Button>
          </SmartTooltip>
        </div>

        {/* User Avatar or Sign In Button - Fixed at bottom */}
        <div className="mt-auto mb-4 flex justify-center">
          {user ? (
            // Show user's actual avatar when logged in
            <SmartTooltip content="User Profile" position="right">
              <Avatar className="w-10 h-10 cursor-pointer hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-white/20">
                <AvatarImage 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                  alt="User Avatar"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white font-semibold text-sm">
                  {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                   user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </SmartTooltip>
          ) : (
            // Show Sign In button when not logged in
            <SmartTooltip content="Sign In to access all features" position="right">
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="sm"
                className="w-10 h-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full hover:scale-110 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Button>
            </SmartTooltip>
          )}
        </div>
      </div>

      {/* Right Panel Content */}
      {sidebarOpen && (
        <div className="flex-1 flex flex-col h-full relative">

          
                      <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showLibrary ? (
                    <Library className="h-8 w-8 text-primary" />
                  ) : (
                    <Music className="h-8 w-8 text-primary" />
                  )}
                  <h2 className="text-4xl font-semibold">{showLibrary ? "Library" : "Studio"}</h2>
                </div>
                
                {/* 收起按钮 - 简单精致 */}
                <Button
                  onClick={() => {
                    setSidebarOpen(false);
                    setShowLibrary(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>


          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-6">
            {/* Library Content */}
            {showLibrary && (
              <div className="space-y-4">
                {/* Skeleton Loading State */}
                {isGenerating && (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-4 p-4">
                        <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Library List */}
                <div className="space-y-3">
                  {mockLibraryData.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => setSelectedLibraryTrack(selectedLibraryTrack === track.id ? null : track.id)}
                      className={`flex items-center gap-4 p-4 transition-all duration-200 cursor-pointer group ${selectedLibraryTrack === track.id
                        ? 'bg-primary/10 rounded-xl'
                        : 'hover:bg-muted/20 rounded-xl'
                        }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={track.coverImage}
                          alt={track.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 w-0">
                        <div className={`font-medium text-base transition-colors ${selectedLibraryTrack === track.id
                          ? 'text-primary'
                          : 'group-hover:text-primary'
                          }`}>
                          {track.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 leading-relaxed w-full" style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {track.style || `${track.genre}, ${track.vibe}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Studio Content */}
            {!showLibrary && (
              <>
                {/* Mode Tabs - Internal at top */}
                <div className="mb-6">
                  <div className="bg-muted/30 rounded-xl p-1">
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setMode("basic")}
                        className={`py-2.5 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                          mode === "basic"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        ⚡️ Basic Mode
                      </button>
                      <button
                        onClick={() => setMode("custom")}
                        className={`py-2.5 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                          mode === "custom"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        🎹 Tune Mode
                      </button>
                    </div>
                  </div>
                </div>

                {/* Basic Mode Description */}
                {mode === "basic" && (
                  <div className="py-3 text-sm text-muted-foreground">
                    Create random R&B songs with polished production in 90s style. Simple and fast setup.
                  </div>
                )}

                {/* Tune Mode Description */}
                {mode === "custom" && (
                  <div className="py-3 text-sm text-muted-foreground">
                    Fine-tune every aspect of your track with detailed controls for genre, instruments, and style.
                  </div>
                )}

                {/* Mode Content */}
                {mode === "basic" ? (
                  <>
                    {/* Basic Mode Content - 流式布局 */}
                    <div className="space-y-8">
                      {/* Basic Settings Section */}
                      <section className="pb-6 border-b border-border/20">
                      
                        {/* Instrumental Mode */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3">
                            <div className="flex-1">
                              <div className="font-medium text-foreground">
                                Instrumental Mode
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {instrumentalMode
                                  ? "Without lyrics"
                                  : "Include lyrics"
                                }
                              </div>
                            </div>
                            <div className="ml-4">
                              <Switch
                                checked={instrumentalMode}
                                onCheckedChange={setInstrumentalMode}
                              />
                            </div>
                          </div>
                        </div>
                      </section>



                      {/* Mood Selection Section */}
                      <section className="pb-6 border-b border-border/20">
                        <h3 className="text-lg font-semibold mb-4">
                          Mood Selection
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            {moods.map((mood: any) => (
                              <button
                                key={mood.id}
                                onClick={() => setSelectedMood(mood.id)}
                                className={`p-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${selectedMood === mood.id
                                  ? 'bg-primary/20 border-primary/40 text-primary shadow-sm'
                                  : 'bg-background/50 border-input/30 text-muted-foreground hover:bg-muted/20 hover:border-input/50 hover:text-foreground'
                                  }`}
                              >
                                <span className="text-lg">{mood.emoji}</span>
                                <span className="text-xs font-medium leading-tight">
                                  {mood.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </section>

                      {/* Custom Prompt Section */}
                      <section className="pb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          Prompt
                          <div className="group relative">
                            <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg cursor-help">
                              💡
                            </div>
                            <div className="absolute left-0 top-full mt-1 p-3 bg-popover text-popover-foreground text-xs rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-64">
                              Describe the mood or vibe you want, like romantic, nostalgic, chill, or energetic. Please avoid artist names, song titles, or brands.
                            </div>
                          </div>
                        </h3>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Write prompt or story of your song..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            maxLength={400}
                            className="min-h-[140px] resize-none"
                          />
                          <div className="text-sm text-muted-foreground text-right">
                            {customPrompt.length}/400
                          </div>
                        </div>
                      </section>

                      {/* Keep Private Section - Basic Mode */}
                      <section className="pb-6 border-b border-border/20">
                        <div className="flex items-center justify-between py-3">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Keep Private
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {keepPrivate
                                ? "Your song will be private"
                                : "Your song will be visible to other users"
                              }
                            </div>
                          </div>
                          <div className="ml-4">
                            <Switch
                              checked={keepPrivate}
                              onCheckedChange={setKeepPrivate}
                            />
                          </div>
                        </div>
                      </section>

                      {/* Generate Button - Basic Mode */}
                      <section className="pt-6">
                        <Button
                          onClick={() => {
                            const generatedPrompt = generateMusicPrompt({
                              mode,
                              selectedMood,
                              selectedGenre,
                              selectedVibe,
                              grooveType,
                              leadInstrument,
                              drumKit,
                              bassTone,
                              instrumentalMode,
                              harmonyPalette,
                              vocalGender,
                              bpm,
                              customPrompt
                            });
                            console.log("Generated Prompt:", generatedPrompt);
                            handleGenerateWithAuth();
                          }}
                          disabled={isGenerating || !selectedMood || credits <= 0}
                          className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/90 hover:via-primary/85 hover:to-primary/80 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Music className="mr-2 h-4 w-4" />
                              Generate Track
                            </>
                          )}
                        </Button>
                      </section>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Tune Mode Content - 流式布局 */}
                    <div className="space-y-8">
                      {/* Basic Settings Section */}
                      <section className="pb-6 border-b border-border/20">
                        {/* Instrumental Mode */}
                        <div className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-foreground">
                              Instrumental Mode
                            </div>
                            <Switch
                              checked={instrumentalMode}
                              onCheckedChange={setInstrumentalMode}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {instrumentalMode
                              ? "Without lyrics"
                              : "Include lyrics"
                            }
                          </div>
                        </div>
                          
                        {/* Vocal Gender - Only show when not in instrumental mode */}
                        {!instrumentalMode && (
                          <div className="mt-3 flex items-center justify-between">
                            <Label className="text-sm font-medium text-foreground">Vocal Gender</Label>
                            <div className="flex gap-2">
                              {vocalGenders.map((gender: any) => (
                                <button
                                  key={gender.id}
                                  onClick={() => setVocalGender(gender.id)}
                                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                                    vocalGender === gender.id
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                  }`}
                                >
                                  {gender.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>

                      {/* Song Title Section */}
                      <section className="pb-6 border-b border-border/20">
                        <h3 className="text-lg font-semibold mb-4">
                          Title
                        </h3>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Enter your song title..."
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            maxLength={80}
                            className="w-full h-10 px-4 border border-input/50 rounded-lg bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                          />
                          <div className="text-sm text-muted-foreground text-right">
                            {songTitle.length}/80
                          </div>
                        </div>
                      </section>

                      {/* Style & Vibe Section */}
                      <section className="pb-6 border-b border-border/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            Style & Vibe
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedGenre("");
                              setSelectedVibe("");
                              setGrooveType("");
                              setBpm([60]);
                            }}
                            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200"
                          >
                            Reset
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Style Options - 圆角标签样式 */}
                          <div className="grid grid-cols-3 gap-3">


                            {/* Genre Selection */}
                            <div className="relative">
                              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                                <SelectTrigger className={`w-full px-2 py-2 h-auto font-medium rounded-xl transition-all duration-200 ${
                                  selectedGenre 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                                }`}>
                                  <SelectValue placeholder="Genre">
                                    {selectedGenre && (
                                      <span className="font-medium">
                                        {genres.find((g: any) => g.id === selectedGenre)?.name}
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {genres.map((genre: any) => (
                                    <SelectItem key={genre.id} value={genre.id} className="py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="text-left">
                                          <div className="font-medium text-left">{genre.name}</div>
                                          <div className="text-sm text-muted-foreground text-left">{genre.description}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Vibe Selection */}
                            <div className="relative">
                              <Select value={selectedVibe} onValueChange={setSelectedVibe}>
                                <SelectTrigger className={`w-full px-2 py-2 h-auto font-medium rounded-xl transition-all duration-200 ${
                                  selectedVibe 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                                }`}>
                                  <SelectValue placeholder="Vibe">
                                    {selectedVibe && (
                                      <span className="font-medium">
                                        {vibes.find((v: any) => v.id === selectedVibe)?.name}
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {vibes.map((vibe: any) => (
                                    <SelectItem key={vibe.id} value={vibe.id} className="py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="text-left">
                                          <div className="font-medium text-left">{vibe.name}</div>
                                          <div className="text-sm text-muted-foreground text-left">{vibe.description}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Groove Type */}
                            <div className="relative">
                              <Select value={grooveType} onValueChange={setGrooveType}>
                                <SelectTrigger className={`w-full px-2 py-2 h-auto font-medium rounded-xl transition-all duration-200 ${
                                  grooveType 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                                }`}>
                                  <SelectValue placeholder="Groove">
                                    {grooveType && (
                                      <span className="font-medium">
                                        {grooveTypes.find((t: any) => t.id === grooveType)?.name}
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {grooveTypes.map((type: any) => (
                                    <SelectItem key={type.id} value={type.id} className="py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="text-left">
                                          <div className="font-medium text-left">{type.name}</div>
                                          <div className="text-sm text-muted-foreground text-left">{type.description}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* BPM Selection */}
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  setBpm([70]); // 60-80 的中间值
                                  setBpmMode('slow');
                                }}
                                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                                  bpmMode === 'slow'
                                    ? 'bg-primary/20 border-primary/40 text-primary shadow-sm'
                                    : 'bg-background/50 border-input/30 text-muted-foreground hover:bg-muted/20 hover:border-input/50 hover:text-foreground'
                                }`}
                              >
                                <div className="font-medium">Slow</div>
                                <div className="text-xs text-muted-foreground">60-80 BPM</div>
                              </button>
                              
                              <button
                                onClick={() => {
                                  setBpm([90]); // 80-100 的中间值
                                  setBpmMode('moderate');
                                }}
                                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                                  bpmMode === 'moderate'
                                    ? 'bg-primary/20 border-primary/40 text-primary shadow-sm'
                                    : 'bg-background/50 border-input/30 text-muted-foreground hover:bg-muted/20 hover:border-input/50 hover:text-foreground'
                                }`}
                              >
                                <div className="font-medium">Moderate</div>
                                <div className="text-xs text-muted-foreground">80-100 BPM</div>
                              </button>
                              
                              <button
                                onClick={() => {
                                  setBpm([110]); // 100-120 的中间值
                                  setBpmMode('medium');
                                }}
                                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                                  bpmMode === 'medium'
                                    ? 'bg-primary/20 border-primary/40 text-primary shadow-sm'
                                    : 'bg-background/50 border-input/30 text-muted-foreground hover:bg-muted/20 hover:border-input/50 hover:text-foreground'
                                }`}
                              >
                                <div className="font-medium">Medium</div>
                                <div className="text-xs text-muted-foreground">100-120 BPM</div>
                              </button>
                              
                              <button
                                onClick={() => {
                                  setBpmMode('custom');
                                }}
                                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                                  bpmMode === 'custom'
                                    ? 'bg-primary/20 border-primary/40 text-primary shadow-sm'
                                    : 'bg-background/50 border-input/30 text-muted-foreground hover:bg-muted/20 hover:border-input/50 hover:text-foreground'
                                }`}
                              >
                                <div className="font-medium">Custom</div>
                                <div className="text-xs text-muted-foreground">Manual input</div>
                              </button>
                            </div>
                            
                            {/* Custom BPM Input - Only show when custom is selected */}
                            {bpmMode === 'custom' && (
                              <div className="space-y-3 pt-2 border-t border-border/20">
                                <div className="flex items-center gap-3">
                                  <SmartTooltip content={bpm[0] <= 60 ? "Minimum to 60" : "Decrease BPM"} position="top">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setBpm([Math.max(60, bpm[0] - 0.5)])}
                                      disabled={bpm[0] <= 60}
                                      className="h-10 w-10 p-0 rounded-lg border-input/50 hover:border-input hover:bg-muted/20 transition-all duration-200"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </SmartTooltip>

                                  <div className="flex-1 relative">
                                    <input
                                      type="number"
                                      value={bpm[0]}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                          setBpm([60]);
                                        } else {
                                          const numValue = parseFloat(value);
                                          if (!isNaN(numValue)) {
                                            setBpm([numValue]);
                                          }
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (isNaN(value) || value < 60) {
                                          setBpm([60]);
                                        } else if (value > 120) {
                                          setBpm([120]);
                                        }
                                      }}
                                      min="60"
                                      max="120"
                                      step="0.5"
                                      className="w-full h-10 pr-12 text-center text-sm border border-input/50 bg-background/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                                      BPM
                                    </div>
                                  </div>

                                  <SmartTooltip content={bpm[0] >= 120 ? "Maximum BPM is 120" : "Increase BPM"} position="top">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setBpm([Math.min(120, bpm[0] + 0.5)])}
                                      disabled={bpm[0] >= 120}
                                      className="h-10 w-10 p-0 rounded-lg border-input/50 hover:border-input hover:bg-muted/20 transition-all duration-200"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </SmartTooltip>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>

                      {/* Arrangement Section */}
                      <section className="pb-6 border-b border-border/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            Arrangement & Performance
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLeadInstrument([]);
                              setDrumKit("");
                              setBassTone("");
                              setHarmonyPalette("");
                            }}
                            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200"
                          >
                            Reset
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {/* Lead Instrument */}
                          <div className="space-y-3">
                            <Select value={leadInstrument.join(',')} onValueChange={(value) => {
                              const selectedIds = value.split(',').filter(Boolean);
                              setLeadInstrument(selectedIds);
                            }}>
                              <SelectTrigger className={`cursor-pointer ${leadInstrument.length > 0 ? "" : "text-muted-foreground"}`}>
                                <SelectValue placeholder="Lead Instrument">
                                  {leadInstrument.length > 0 ? (
                                    <div className="flex items-center gap-1 max-w-full">
                                      {leadInstrument.map((id, index) => (
                                        <span key={id} className="font-medium">
                                          {leadInstruments.find((i: any) => i.id === id)?.name}
                                          {index < leadInstrument.length - 1 && ", "}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">Select up to 2 instruments</span>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                <div className="p-2 space-y-2">
                                  {leadInstruments.map((instrument: any) => {
                                    const isSelected = leadInstrument.includes(instrument.id);
                                    const isDisabled = !isSelected && leadInstrument.length >= 2;

                                    return (
                                      <div
                                        key={instrument.id}
                                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${isSelected
                                          ? 'bg-primary/10 border border-primary/20'
                                          : isDisabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-muted'
                                          }`}
                                        onClick={() => {
                                          if (isDisabled) return;
                                          if (isSelected) {
                                            setLeadInstrument(leadInstrument.filter((id: string) => id !== instrument.id));
                                          } else {
                                            setLeadInstrument([...leadInstrument, instrument.id]);
                                          }
                                        }}
                                      >
                                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${isSelected
                                          ? 'bg-primary border-primary'
                                          : 'border-muted-foreground'
                                          }`}>
                                          {isSelected && (
                                            <div className="w-2 h-2 bg-white rounded-sm" />
                                          )}
                                        </div>
                                        <div className="flex-1 text-left">
                                          <div className="font-medium">{instrument.name}</div>
                                          <div className="text-sm text-muted-foreground">{instrument.description}</div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                {leadInstrument.length > 0 && (
                                  <div className="p-2 border-t">
                                    <button
                                      onClick={() => setLeadInstrument([])}
                                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Clear selection
                                    </button>
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Drum Kit & Bass Tone */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex-1">
                              <Select value={drumKit} onValueChange={setDrumKit}>
                                <SelectTrigger className={drumKit ? "" : "text-muted-foreground"}>
                                  <SelectValue placeholder="Drum Kit">
                                    {drumKit && (
                                      <span className="font-medium">
                                        {drumKits.find((k: any) => k.id === drumKit)?.name}
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {drumKits.map((kit: any) => (
                                    <SelectItem key={kit.id} value={kit.id} className="py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="text-left">
                                          <div className="font-medium text-left">{kit.name}</div>
                                          <div className="text-sm text-muted-foreground text-left">{kit.description}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex-1">
                              <Select value={bassTone} onValueChange={setBassTone}>
                                <SelectTrigger className={bassTone ? "" : "text-muted-foreground"}>
                                  <SelectValue placeholder="Bass Tone">
                                    {bassTone && (
                                      <span className="font-medium">
                                        {bassTones.find((t: any) => t.id === bassTone)?.name}
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {bassTones.map((tone: any) => (
                                    <SelectItem key={tone.id} value={tone.id} className="py-3">
                                      <div className="text-left">
                                        <div className="font-medium text-left">{tone.name}</div>
                                        <div className="text-sm text-muted-foreground text-left">{tone.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Harmony Palette */}
                          <div className="space-y-3">
                            <Select value={harmonyPalette} onValueChange={setHarmonyPalette}>
                              <SelectTrigger className={harmonyPalette ? "" : "text-muted-foreground"}>
                                <SelectValue placeholder="Harmony Palette">
                                  {harmonyPalette && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">
                                        {harmonyPalettes.find((p: any) => p.id === harmonyPalette)?.emoji}
                                      </span>
                                      <span className="text-sm font-medium">
                                        {harmonyPalettes.find((p: any) => p.id === harmonyPalette)?.name}
                                      </span>
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {harmonyPalettes.map((palette: any) => (
                                  <SelectItem key={palette.id} value={palette.id} className="py-3">
                                    <div className="flex items-center gap-3">
                                      <span className="text-lg">
                                        {palette.emoji}
                                      </span>
                                      <div className="text-left">
                                        <div className="font-medium text-left">{palette.name}</div>
                                        <div className="text-sm text-muted-foreground text-left">{palette.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </section>

                      {/* Lyrics Section */}
                      {!instrumentalMode && (
                        <section className="pb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                              Lyrics
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCustomPrompt("")}
                              className="h-6 px-2 text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 transition-opacity"
                              title="Clear lyrics"
                            >
                              Clear
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="relative">
                              <Textarea
                                placeholder="Write your song lyrics here..."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                maxLength={5000}
                                className="min-h-[120px] resize-none pr-32 pb-8"
                              />
                              {/* Generate Lyrics Button - Inside textarea */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowLyricsDialog(true)}
                                className="absolute bottom-2 right-2 h-6 px-2 text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90 flex items-center gap-1"
                                title="Generate lyrics with AI"
                              >
                                <Sparkles className="h-3 w-3" />
                                <span className="text-xs font-medium">Generate with AI</span>
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground text-right">
                              {customPrompt.length}/5000
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Keep Private Section - Custom Mode */}
                      <section className="pb-6 border-b border-border/20">
                        <div className="flex items-center justify-between py-3">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Keep Private
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {keepPrivate
                                ? "Your song will be private"
                                : "Your song will be visible to other users"
                              }
                            </div>
                          </div>
                          <div className="ml-4">
                            <Switch
                              checked={keepPrivate}
                              onCheckedChange={setKeepPrivate}
                            />
                          </div>
                        </div>
                      </section>

                      {/* Generate Button - Integrated at bottom */}
                      <section className="pt-6">
                        <Button
                          onClick={() => {
                            const generatedPrompt = generateMusicPrompt({
                              mode,
                              selectedMood,
                              selectedGenre,
                              selectedVibe,
                              grooveType,
                              leadInstrument,
                              drumKit,
                              bassTone,
                              instrumentalMode,
                              harmonyPalette,
                              vocalGender,
                              bpm,
                              customPrompt
                            });
                            console.log("Generated Prompt:", generatedPrompt);
                            handleGenerateWithAuth();
                          }}
                          disabled={isGenerating || (mode as string === "basic" ? !selectedMood : (!selectedGenre || !selectedVibe)) || credits <= 0}
                          className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/90 hover:via-primary/85 hover:to-primary/80 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Music className="mr-2 h-4 w-4" />
                              Generate Track
                            </>
                          )}
                        </Button>
                      </section>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};
