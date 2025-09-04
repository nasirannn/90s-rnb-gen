# Neon Database Setup Guide

## 1. 环境变量配置

在你的 `.env.local` 文件中添加以下配置：

```env
# Supabase (仅用于认证)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Neon Database (用于数据存储)
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require

# 其他配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. 数据库初始化

### 方法1：通过API路由初始化
访问 `http://localhost:3000/api/init-db` 并发送POST请求

### 方法2：手动执行SQL
在Neon控制台中执行以下SQL：

```sql
-- 创建用户积分表
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建音乐生成记录表
CREATE TABLE IF NOT EXISTS music_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255),
  genre VARCHAR(100),
  mood VARCHAR(100),
  style VARCHAR(100),
  prompt TEXT,
  audio_url TEXT,
  cover_url TEXT,
  duration INTEGER,
  is_private BOOLEAN DEFAULT FALSE,
  is_instrumental BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. 测试数据库连接

访问 `http://localhost:3000/api/test-db` 来测试数据库连接。

## 4. 使用数据库功能

### 用户管理
```typescript
import { getOrCreateUser, updateUserCredits, consumeUserCredit } from '@/lib/user-db';

// 获取或创建用户
const user = await getOrCreateUser(supabaseUserId, email, name, avatar_url);

// 更新用户积分
await updateUserCredits(userId, newCredits);

// 消费积分
const success = await consumeUserCredit(userId);
```

### 音乐生成记录管理
```typescript
import { createMusicGeneration, getUserMusicGenerations } from '@/lib/music-db';

// 创建音乐生成记录
const music = await createMusicGeneration(userId, {
  title: 'My Song',
  genre: 'R&B',
  mood: 'Smooth',
  audio_url: 'https://example.com/audio.mp3'
});

// 获取用户的音乐记录
const userMusic = await getUserMusicGenerations(userId);
```

## 5. 数据库表结构

### user_credits 表
- `user_id`: UUID (主键，对应Supabase用户ID)
- `credits`: 积分数量
- `created_at`: 创建时间
- `updated_at`: 更新时间

### music_generations 表
- `id`: UUID (主键)
- `user_id`: 用户ID (对应Supabase用户ID)
- `title`: 歌曲标题
- `genre`: 音乐类型
- `mood`: 音乐情绪
- `style`: 音乐风格
- `prompt`: 生成提示词
- `audio_url`: 音频文件URL
- `cover_url`: 封面图片URL
- `duration`: 时长(秒)
- `is_private`: 是否私有
- `is_instrumental`: 是否纯音乐
- `created_at`: 创建时间
- `updated_at`: 更新时间



## 6. 注意事项

1. 确保 `DATABASE_URL` 环境变量正确配置
2. 数据库连接使用SSL模式
3. 所有数据库操作都使用连接池
4. 错误处理已内置在工具函数中
5. 用户认证仍使用Supabase，数据库仅用于数据存储
