import { query } from './neon';

export interface MusicGeneration {
  id: string;
  user_id: string;
  title?: string;
  genre?: string;
  mood?: string;
  style?: string;
  prompt?: string;
  audio_url?: string;
  cover_url?: string;
  duration?: number;
  is_private: boolean;
  is_instrumental: boolean;
  created_at: string;
  updated_at: string;
}

// 创建音乐生成记录
export const createMusicGeneration = async (
  userId: string,
  data: {
    title?: string;
    genre?: string;
    mood?: string;
    style?: string;
    prompt?: string;
    audio_url?: string;
    cover_url?: string;
    duration?: number;
    is_private?: boolean;
    is_instrumental?: boolean;
  }
): Promise<MusicGeneration> => {
  try {
    const result = await query(
      `INSERT INTO music_generations (
        user_id, title, genre, mood, style, prompt, 
        audio_url, cover_url, duration, is_private, is_instrumental
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        userId,
        data.title,
        data.genre,
        data.mood,
        data.style,
        data.prompt,
        data.audio_url,
        data.cover_url,
        data.duration,
        data.is_private || false,
        data.is_instrumental || false
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating music generation:', error);
    throw error;
  }
};

// 获取用户的音乐生成记录
export const getUserMusicGenerations = async (userId: string, limit: number = 10, offset: number = 0): Promise<MusicGeneration[]> => {
  try {
    const result = await query(
      'SELECT * FROM music_generations WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting user music generations:', error);
    throw error;
  }
};

// 获取公开的音乐生成记录
export const getPublicMusicGenerations = async (limit: number = 10, offset: number = 0): Promise<MusicGeneration[]> => {
  try {
    const result = await query(
      'SELECT * FROM music_generations WHERE is_private = false ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting public music generations:', error);
    throw error;
  }
};

// 更新音乐生成记录
export const updateMusicGeneration = async (
  id: string,
  data: Partial<MusicGeneration>
): Promise<MusicGeneration> => {
  try {
    const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'user_id' && key !== 'created_at');
    const values = fields.map((field, index) => `$${index + 2}`);
    const setClause = fields.map(field => `${field} = $${fields.indexOf(field) + 2}`).join(', ');
    
    const result = await query(
      `UPDATE music_generations SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...fields.map(field => data[field as keyof MusicGeneration])]
    );

    if (result.rows.length === 0) {
      throw new Error('Music generation not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating music generation:', error);
    throw error;
  }
};

// 删除音乐生成记录
export const deleteMusicGeneration = async (id: string, userId: string): Promise<boolean> => {
  try {
    const result = await query(
      'DELETE FROM music_generations WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting music generation:', error);
    throw error;
  }
};
