export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: '90s-rnb-music-production',
    title: "90s R&B 音乐制作的艺术：从采样到混音",
    excerpt: "探索90年代R&B音乐制作的经典技巧，包括采样技术、混音方法和制作流程。了解如何创造出那个时代标志性的温暖音色和情感深度。",
    content: `
      <p class="mb-6 text-lg leading-relaxed text-white/80">
        90年代的R&B音乐以其独特的温暖音色和情感深度而闻名。这个时代的音乐制作技术虽然相对简单，但正是这种"简单"造就了经典。本文将深入探讨90年代R&B音乐制作的核心技巧。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">采样技术的艺术</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        采样是90年代R&B音乐制作的基础。制作人需要从黑胶唱片中提取鼓点、贝斯线条和旋律片段，然后重新组合成新的作品。这个过程需要敏锐的听觉和丰富的音乐知识。
      </p>
      <p class="mb-4 text-white/70 leading-relaxed">
        经典的采样设备如Akai MPC系列采样器，让制作人能够精确控制采样的时间、音调和力度。这种"手工艺"式的制作方法，让每首歌曲都带有独特的个性。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">混音的秘密</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        90年代R&B的混音风格追求温暖、自然的音色。制作人很少使用过度压缩，而是通过精心调整每个音轨的EQ和混响来创造空间感。
      </p>
      <p class="mb-4 text-white/70 leading-relaxed">
        贝斯和鼓点的平衡是关键。贝斯通常占据低频区域，而鼓点则在中频和高频区域寻找自己的位置。这种分层式的混音方法，让音乐既有力量又保持清晰。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">制作流程的思考</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        与今天的DAW软件不同，90年代的制作流程更加线性。制作人需要提前规划好每个部分，因为修改意味着重新录制整个轨道。
      </p>
      <p class="mb-4 text-white/70 leading-relaxed">
        这种限制反而激发了创造力。制作人必须在有限的技术条件下，通过音乐本身来打动听众。每一首歌都是经过深思熟虑的艺术品。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">现代启示</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        虽然技术已经发生了翻天覆地的变化，但90年代R&B音乐制作的核心精神依然值得学习。那就是对音乐本质的追求，对细节的重视，以及对情感的真诚表达。
      </p>
      <p class="mb-6 text-white/70 leading-relaxed">
        在今天，我们可以使用AI工具来辅助创作，但永远不要忘记，真正打动人心的，永远是那些来自内心的真实情感和精心打磨的音乐细节。
      </p>
    `,
    author: "音乐制作团队",
    date: "2024-01-15",
    readTime: "8 分钟",
    category: "制作技巧",
    tags: ["90s R&B", "音乐制作", "采样", "混音"],
    image: "/bg-studio-background.png",
    featured: true
  },
  {
    id: 2,
    slug: 'ai-music-generation-future',
    title: "AI 音乐生成的未来：技术与创意的平衡",
    excerpt: "探讨AI在音乐创作中的应用，如何保持人类创意的独特性，以及AI工具如何成为音乐人的创作伙伴。",
    content: `
      <p class="mb-6 text-lg leading-relaxed text-white/80">
        AI技术的快速发展正在改变音乐创作的方方面面。从旋律生成到编曲，从混音到母带处理，AI工具正在成为音乐人创作过程中不可或缺的一部分。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">AI在音乐创作中的应用</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        现代AI音乐生成工具能够分析大量的音乐数据，学习音乐的结构、和声进行和节奏模式。这使得AI能够生成符合特定风格的音乐片段，为音乐人提供创作灵感。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">保持人类创意的独特性</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        虽然AI能够生成音乐，但真正的情感表达和创意灵感仍然来自人类。AI应该被视为创作工具，而不是创作者的替代品。
      </p>
    `,
    author: "技术专家",
    date: "2024-01-10",
    readTime: "6 分钟",
    category: "技术前沿",
    tags: ["AI", "音乐创作", "技术", "创新"],
    image: "/only-90s-rnb-background.png"
  },
  {
    id: 3,
    slug: 'classic-rnb-rhythm-patterns',
    title: "经典R&B节奏模式解析：Groove的秘密",
    excerpt: "深入分析90年代R&B音乐的节奏结构，从鼓点编排到贝斯线条，揭示那些经典歌曲背后的节奏奥秘。",
    content: `
      <p class="mb-6 text-lg leading-relaxed text-white/80">
        R&B音乐的节奏是其灵魂所在。一个优秀的R&B节奏能够让人不由自主地跟着摇摆，这就是所谓的"Groove"。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">鼓点编排的艺术</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        90年代R&B的鼓点通常采用"四分音符"的节奏模式，强调第二和第四拍，创造出独特的摇摆感。
      </p>
    `,
    author: "节奏分析师",
    date: "2024-01-05",
    readTime: "10 分钟",
    category: "音乐理论",
    tags: ["R&B", "节奏", "Groove", "音乐理论"],
    image: "/bg-studio-background.png"
  },
  {
    id: 4,
    slug: 'home-studio-setup-guide',
    title: "从零开始：搭建你的家庭录音室",
    excerpt: "实用指南：如何用有限的预算搭建专业的家庭录音环境，包括设备选择、声学处理和软件配置。",
    content: `
      <p class="mb-6 text-lg leading-relaxed text-white/80">
        随着技术的发展，在家中搭建专业录音室已经不再是梦想。本文将为你提供完整的家庭录音室搭建指南。
      </p>
      
      <h2 class="text-2xl font-bold text-white mb-4 mt-8">设备选择</h2>
      <p class="mb-4 text-white/70 leading-relaxed">
        选择合适的录音设备是成功的关键。从麦克风到音频接口，从监听音箱到耳机，每个设备都会影响最终的录音质量。
      </p>
    `,
    author: "录音工程师",
    date: "2024-01-01",
    readTime: "12 分钟",
    category: "设备指南",
    tags: ["录音室", "设备", "声学", "录音技术"],
    image: "/only-90s-rnb-background.png"
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  if (category === "全部") return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};
