import { useState } from "react";

export const useMusicGeneration = () => {
  // Music Configuration States
  const [mode, setMode] = useState<"basic" | "custom">("basic");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [instrumentalMode, setInstrumentalMode] = useState(false);
  const [keepPrivate, setKeepPrivate] = useState(false);

  // Advanced Music Options
  const [bpm, setBpm] = useState([70]);
  const [grooveType, setGrooveType] = useState("");
  const [leadInstrument, setLeadInstrument] = useState<string[]>([]);
  const [drumKit, setDrumKit] = useState("");
  const [bassTone, setBassTone] = useState("");
  const [vocalStyle, setVocalStyle] = useState("");
  const [vocalGender, setVocalGender] = useState("male");
  const [harmonyPalette, setHarmonyPalette] = useState("");

  // Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [allGeneratedTracks, setAllGeneratedTracks] = useState<any[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  return {
    // States
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
  };
};
