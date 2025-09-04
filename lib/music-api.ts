// API service configuration
export interface GenerateMusicRequest {
  mode: 'basic' | 'custom';
  // Basic mode fields
  mood?: string;
  customPrompt?: string;
  instrumentalMode?: boolean;
  
  // Custom mode fields
  genre?: string;
  vibe?: string;
  songTitle?: string;
  grooveType?: string;
  leadInstrument?: string[];
  drumKit?: string;
  bassTone?: string;
  vocalStyle?: string;
  vocalGender?: string;
  harmonyPalette?: string;
  bpm?: number;
}

export interface GeneratedMusic {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl?: string;
  duration: number;
  genre: string;
  mood: string;
}

export interface SunoApiResponse {
  taskId?: string;
  status?: 'generating' | 'complete' | 'error';
  data?: {
    id: string;
    title: string;
    audio_url: string;
    image_url?: string;
    duration: number;
  }[];
  // For task status response
  id?: string;
  title?: string;
  audio_url?: string;
  image_url?: string;
  duration?: number;
}

export interface GenerateCoverRequest {
  prompt: string;
}

export interface CoverApiResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    images?: string[] | null;
  };
}

class MusicApiService {
  private baseUrl = 'https://api.kie.ai';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Generate music prompt for basic mode
  private generateQuickModePrompt(mood: string, customPrompt?: string): string {
    const moodPrompts = {
      'joyful': 'upbeat, happy, celebratory Contemporary R&B',
      'melancholic': 'melancholy, introspective, emotional Contemporary R&B',
      'romantic': 'romantic, intimate, loving Contemporary R&B',
      'nostalgic': 'nostalgic, reminiscent, wistful Contemporary R&B',
      'mysterious': 'mysterious, enigmatic, sultry Contemporary R&B',
      'chill': 'relaxed, laid-back, chill Contemporary R&B',
      'energetic': 'energetic, vibrant, dynamic Contemporary R&B',
      'confident': 'confident, empowering, strong Contemporary R&B',
    };

    let prompt = `Create a ${moodPrompts[mood as keyof typeof moodPrompts]} with authentic 1990s Black R&B production, period-appropriate instrumentation, vocals, and mixing. `;
    
    if (customPrompt) {
      prompt += customPrompt + ' ';
    }

    prompt += 'High quality audio, professional production, polished 90s sound.';
    
    return prompt;
  }

  // Generate style for custom mode
  private generateCustomStyle(request: GenerateMusicRequest): string {
    const genreMap = {
      'new-jack-swing': 'New Jack Swing',
      'hip-hop-soul': 'Hip-Hop Soul',
      'contemporary-rnb': 'Contemporary R&B',
      'quiet-storm': 'Quiet Storm',
      'neo-soul': 'Neo-Soul',
    };

    const vibeMap = {
      'slow-jam': 'smooth, romantic slow tempo',
      'upbeat': 'energetic and danceable',
      'chill': 'relaxed and laid-back',
      'raw': 'authentic, unpolished sound',
      'polished': 'refined professional production quality',
      'groovy': 'funky rhythmic dance vibes',
    };

    let style = genreMap[request.genre as keyof typeof genreMap] || 'Contemporary R&B';
    
    if (request.vibe) {
      style += `, ${vibeMap[request.vibe as keyof typeof vibeMap]}`;
    }
    
    if (request.grooveType || request.leadInstrument?.length || request.drumKit || request.bassTone) {
      style += ', 1990s authentic production';
    }
    
    return style;
  }

  // Generate detailed prompt for custom mode
  private generateCustomPrompt(request: GenerateMusicRequest): string {
    let prompt = '';
    
    if (request.customPrompt) {
      prompt = request.customPrompt;
    } else {
      prompt = `A ${this.generateCustomStyle(request)} song with authentic 90s Black R&B sound. `;
      
      if (request.bpm) {
        prompt += `Tempo around ${request.bpm} BPM. `;
      }
      
      if (request.harmonyPalette) {
        prompt += `Rich harmonic progressions. `;
      }
      
      prompt += 'High quality production, period-appropriate instrumentation and mixing.';
    }
    
    return prompt;
  }

  // Generate comprehensive prompt from all parameters
  private generateComprehensivePrompt(request: GenerateMusicRequest): string {
    let prompt = '';
    
    if (request.mode === 'basic') {
      // Basic mode: 使用mood + customPrompt
      const moodPrompts = {
        'joyful': 'upbeat, happy, celebratory Contemporary R&B',
        'melancholic': 'melancholy, introspective, emotional Contemporary R&B',
        'romantic': 'romantic, intimate, loving Contemporary R&B',
        'nostalgic': 'nostalgic, reminiscent, wistful Contemporary R&B',
        'mysterious': 'mysterious, enigmatic, sultry Contemporary R&B',
        'chill': 'relaxed, laid-back, chill Contemporary R&B',
        'energetic': 'energetic, vibrant, dynamic Contemporary R&B',
        'confident': 'confident, empowering, strong Contemporary R&B',
      };

      prompt = `Create a ${moodPrompts[request.mood as keyof typeof moodPrompts]} with authentic 1990s Black R&B production, period-appropriate instrumentation, vocals, and mixing. `;
      
      if (request.customPrompt) {
        prompt += request.customPrompt + ' ';
      }
      
      prompt += 'High quality audio, professional production, polished 90s sound.';
      
    } else {
      // Custom mode: 拼接所有详细参数
      const genreMap = {
        'new-jack-swing': 'New Jack Swing style with syncopated rhythms, hip-hop beats, and R&B vocals',
        'hip-hop-soul': 'Hip-Hop Soul with smooth R&B vocals over hip-hop influenced beats and production',
        'contemporary-rnb': 'Contemporary R&B with sophisticated production, lush harmonies, and polished sound',
        'quiet-storm': 'Quiet Storm R&B with smooth, mellow vibes perfect for late-night listening',
        'neo-soul': 'Neo-Soul with jazz and funk influences, organic instrumentation, and soulful vocals',
      };

      const vibeMap = {
        'polished': 'polished, refined production',
        'raw': 'raw, unpolished, gritty',
        'dreamy': 'dreamy, ethereal, atmospheric',
        'powerful': 'powerful, bold, commanding',
        'intimate': 'intimate, personal, close',
      };

      // 基础风格
      if (request.genre) {
        prompt += `Create a ${genreMap[request.genre as keyof typeof genreMap]} from the 1990s era. `;
      }
      
      // Vibe
      if (request.vibe) {
        prompt += `The overall vibe should be ${vibeMap[request.vibe as keyof typeof vibeMap]}. `;
      }
      
      // BPM
      if (request.bpm) {
        prompt += `Tempo around ${request.bpm} BPM. `;
      }
      
      // Groove Type
      if (request.grooveType) {
        const grooveDescriptions = {
          'swing': 'swing groove with syncopated rhythms',
          'shuffle': 'shuffle groove with triplet feel',
          'straight': 'straight groove with steady beat',
          'laid-back': 'laid-back groove with relaxed timing',
          'pocket': 'tight pocket groove with precise timing'
        };
        prompt += `${grooveDescriptions[request.grooveType as keyof typeof grooveDescriptions] || request.grooveType} groove. `;
      }
      
      // Lead Instruments
      if (request.leadInstrument && request.leadInstrument.length > 0) {
        prompt += `Featured instruments include ${request.leadInstrument.join(', ')}. `;
      }
      
      // Drum Kit
      if (request.drumKit) {
        prompt += `Using ${request.drumKit} drum sound. `;
      }
      
      // Bass Tone
      if (request.bassTone) {
        prompt += `Bass with ${request.bassTone} tone. `;
      }
      
      // Vocal Style (when not instrumental)
      if (!request.instrumentalMode && request.vocalStyle) {
        prompt += `Vocal style: ${request.vocalStyle}. `;
      }
      
      // Harmony Palette
      if (request.harmonyPalette) {
        prompt += `Rich harmonic progressions and sophisticated chord arrangements. `;
      }
      
      // Custom lyrics/prompt
      if (request.customPrompt) {
        if (request.instrumentalMode) {
          prompt += `Additional creative direction: ${request.customPrompt} `;
        } else {
          prompt += `Song lyrics/theme: ${request.customPrompt} `;
        }
      }
      
      // 固定结尾
      prompt += 'Authentic 1990s Black R&B production with period-appropriate instrumentation, vocals, and mixing. High quality audio, professional production.';
    }
    
    return prompt;
  }

  // Generate music
  async generateMusic(request: GenerateMusicRequest): Promise<SunoApiResponse> {
    // 根据文档设置正确的API参数
    const apiParams: any = {
      model: 'V3_5',
      callBackUrl: process.env.SUNO_CALLBACK_URL || 'https://your-domain.com/api/suno-callback',
    };

    if (request.mode === 'basic') {
      // Basic模式: customMode: false
      apiParams.customMode = false;
      apiParams.instrumental = request.instrumentalMode || false;
      
      // Basic模式的prompt = mood + 用户输入的prompt
      const moodPrompts = {
        'joyful': 'upbeat, happy, celebratory Contemporary R&B',
        'melancholic': 'melancholy, introspective, emotional Contemporary R&B',
        'romantic': 'romantic, intimate, loving Contemporary R&B',
        'nostalgic': 'nostalgic, reminiscent, wistful Contemporary R&B',
        'mysterious': 'mysterious, enigmatic, sultry Contemporary R&B',
        'confident': 'confident, empowering, strong Contemporary R&B',
      };

      let prompt = `Create a ${moodPrompts[request.mood as keyof typeof moodPrompts]} with authentic 1990s Black R&B production, period-appropriate instrumentation, vocals, and mixing. `;
      
      if (request.customPrompt) {
        prompt += request.customPrompt + ' ';
      }
      
      prompt += 'High quality audio, professional production, polished 90s sound.';
      apiParams.prompt = prompt;
      
    } else {
      // Custom模式: customMode: true
      apiParams.customMode = true;
      apiParams.instrumental = request.instrumentalMode || false;
      apiParams.model = 'V3_5'; // 保持V3_5，如需V4_5PLUS请告知
      
      // 生成style = genre + vibe + groove type + lead instrument + drum kit + bass tone + harmony palette + BPM
      let style = '';
      
      // Genre
      const genreMap = {
        'new-jack-swing': 'New Jack Swing',
        'hip-hop-soul': 'Hip-Hop Soul', 
        'contemporary-rnb': 'Contemporary R&B',
        'quiet-storm': 'Quiet Storm',
        'neo-soul': 'Neo-Soul',
      };
      style += genreMap[request.genre as keyof typeof genreMap] || 'Contemporary R&B';
      
      // Vibe
      if (request.vibe) {
        const vibeMap = {
          'slow-jam': 'smooth romantic slow tempo',
          'upbeat': 'energetic danceable',
          'chill': 'relaxed laid-back',
          'raw': 'authentic unpolished',
          'polished': 'refined professional',
          'groovy': 'funky rhythmic dance',
        };
        style += `, ${vibeMap[request.vibe as keyof typeof vibeMap]}`;
      }
      
      // Groove Type
      if (request.grooveType) {
        style += `, ${request.grooveType} groove`;
      }
      
      // Lead Instrument
      if (request.leadInstrument && request.leadInstrument.length > 0) {
        style += `, featuring ${request.leadInstrument.join(' and ')}`;
      }
      
      // Drum Kit
      if (request.drumKit) {
        style += `, ${request.drumKit} drums`;
      }
      
      // Bass Tone
      if (request.bassTone) {
        style += `, ${request.bassTone} bass`;
      }
      
      // Harmony Palette
      if (request.harmonyPalette) {
        style += `, ${request.harmonyPalette} harmonies`;
      }
      
      // BPM
      if (request.bpm) {
        style += `, ${request.bpm} BPM`;
      }
      
      apiParams.style = style;
      
      // Title
      if (request.songTitle) {
        apiParams.title = request.songTitle;
      }
      
      // Prompt处理 - 根据API文档的instrumental参数要求
      if (request.instrumentalMode) {
        // instrumental为true: 只需要style和title，不设置prompt
        // 不添加prompt参数到apiParams
      } else {
        // instrumental为false: 需要style、title和prompt（prompt将作为精确歌词使用）
        if (request.customPrompt) {
          apiParams.prompt = request.customPrompt; // 这里的prompt作为精确歌词使用
        }
      }
      
      // Vocal Gender
      if (request.vocalGender && !request.instrumentalMode) {
        const genderMap = {
          'male': 'm',
          'female': 'f'
        };
        apiParams.vocalGender = genderMap[request.vocalGender as keyof typeof genderMap];
      }
      
      // 权重参数
      apiParams.styleWeight = 0.65;
      apiParams.weirdnessConstraint = 0.65;
      apiParams.audioWeight = 0.65;
      
      // negativeTags - 避免不符合90s R&B风格的元素
      apiParams.negativeTags = "edm, techno, trap, lo-fi hip-hop, distorted noise";
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(apiParams),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API call failed: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    // Check for API success
    if (data.code === 200) {
      return {
        taskId: data.data?.taskId,
        status: 'generating',
        data: data.data
      };
    } else {
      throw new Error(`API error (${data.code}): ${data.msg || 'Unknown error'}`);
    }
    
    return data;
  }

  // Get generation status
  async getGenerationStatus(taskId: string): Promise<SunoApiResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/generate/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Get status failed: ${response.statusText} - ${errorData}`);
    }

    return await response.json();
  }

  // Poll until generation complete
  async waitForCompletion(taskId: string, maxAttempts = 30): Promise<SunoApiResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getGenerationStatus(taskId);
      
      if (status.status === 'complete') {
        return status;
      } else if (status.status === 'error') {
        throw new Error('Music generation failed');
      }
      
      // Wait 5 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    throw new Error('Music generation timeout');
  }

  // Generate cover
  async generateCover(request: GenerateCoverRequest): Promise<CoverApiResponse> {
    const apiParams = {
      prompt: request.prompt,
      callBackUrl: process.env.COVER_CALLBACK_URL || 'https://your-domain.com/api/cover-callback',
    };
    
    const response = await fetch(`${this.baseUrl}/api/v1/generate/cover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(apiParams),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Cover API call failed: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    console.log('Cover API response:', JSON.stringify(data, null, 2));
    
    // Check for API success
    if (data.code === 200) {
      return {
        code: data.code,
        msg: data.msg,
        data: {
          taskId: data.data?.taskId,
          images: data.data?.images || null
        }
      };
    } else {
      throw new Error(`Cover API error (${data.code}): ${data.msg || 'Unknown error'}`);
    }
  }

  // Get cover generation status
  async getCoverStatus(taskId: string): Promise<CoverApiResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/generate/cover/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Get cover status failed: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    return {
      code: data.code,
      msg: data.msg,
      data: {
        taskId: data.data?.taskId,
        images: data.data?.images || null
      }
    };
  }

  // Poll until cover generation complete
  async waitForCoverCompletion(taskId: string, maxAttempts = 30): Promise<CoverApiResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getCoverStatus(taskId);
      
      if (status.code === 200 && status.data.images) {
        return status;
      } else if (status.code === 501) {
        throw new Error('Cover generation failed');
      }
      
      // Wait 5 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    throw new Error('Cover generation timeout');
  }
}

export default MusicApiService;