import musicOptions from '@/data/music-options.json';

const { 
  genres, 
  moods, 
  vibes, 
  grooveTypes, 
  leadInstruments, 
  drumKits, 
  bassTones, 
  vocalGenders, 
  harmonyPalettes
} = musicOptions;

interface PromptGeneratorParams {
  mode: "basic" | "custom";
  selectedMood?: string;
  selectedGenre?: string;
  selectedVibe?: string;
  grooveType?: string;
  leadInstrument?: string[];
  drumKit?: string;
  bassTone?: string;
  instrumentalMode?: boolean;
  harmonyPalette?: string;
  vocalGender?: string;
  bpm?: number[];
  customPrompt?: string;
}

export const generateMusicPrompt = (params: PromptGeneratorParams): string => {
  const {
    mode,
    selectedMood,
    selectedGenre,
    selectedVibe,
    grooveType,
    leadInstrument = [],
    drumKit,
    bassTone,
    instrumentalMode = false,
    harmonyPalette,
    vocalGender,
    bpm = [70],
    customPrompt = ""
  } = params;

  if (mode === "basic") {
    const moodName = moods.find((m: any) => m.id === selectedMood)?.name || "";
    const basePrompt = `A ${moodName} contemporary R&B songs with polished production in 90s style`;
    
    if (customPrompt.trim()) {
      return `${basePrompt}, ${customPrompt}`;
    }
    return basePrompt;
  } else {
    // Tune mode
    const vibeName = vibes.find((v: any) => v.id === selectedVibe)?.name || "";
    const genreName = genres.find((g: any) => g.id === selectedGenre)?.name || "";
    const grooveTypeName = grooveTypes.find((t: any) => t.id === grooveType)?.name || "";
    const leadInstrumentNames = leadInstrument.map((id: string) => 
      leadInstruments.find((i: any) => i.id === id)?.name
    ).filter(Boolean).join(", ");
    const drumKitName = drumKits.find((k: any) => k.id === drumKit)?.name || "";
    const bassToneName = bassTones.find((t: any) => t.id === bassTone)?.name || "";
    const harmonyPaletteName = harmonyPalettes.find((p: any) => p.id === harmonyPalette)?.name || "";
    const vocalGenderName = vocalGenders.find((g: any) => g.id === vocalGender)?.name || "";

    const bpmValue = bpm[0] || 70;
    let basePrompt = `A ${vibeName} ${genreName} track at ${bpmValue} BPM with a ${grooveTypeName} groove, featuring ${leadInstrumentNames}, ${drumKitName} and ${bassToneName}`;
    
    if (!instrumentalMode) {
      basePrompt += `. The harmony style is ${harmonyPaletteName}. Vocals are ${vocalGenderName}`;
    }
    
    if (customPrompt.trim()) {
      basePrompt += `. ${customPrompt}`;
    }
    
    return basePrompt;
  }
};
