import { query } from './neon';

// 创建用户积分表
export const createUserCreditsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_credits (
      user_id UUID PRIMARY KEY,
      credits INTEGER DEFAULT 3,
      total_earned INTEGER DEFAULT 0,
      total_spent INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  try {
    await query(createTableQuery);
    console.log('User credits table created successfully');
  } catch (error) {
    console.error('Error creating user credits table:', error);
  }
};

// 创建积分交易记录表
export const createCreditTransactionsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      transaction_type VARCHAR(20) NOT NULL, -- 'earn', 'spend', 'refund', 'bonus'
      amount INTEGER NOT NULL, -- 正数为获得，负数为消耗
      balance_after INTEGER NOT NULL, -- 交易后余额
      description TEXT, -- 交易描述
      reference_id UUID, -- 关联记录ID（如music_generation_id）
      reference_type VARCHAR(50), -- 关联类型（如'music_generation'）
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  try {
    await query(createTableQuery);
    console.log('Credit transactions table created successfully');
  } catch (error) {
    console.error('Error creating credit transactions table:', error);
  }
};

// 创建音乐生成记录表
export const createMusicGenerationsTable = async () => {
  const createTableQuery = `
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
  `;
  
  try {
    await query(createTableQuery);
    console.log('Music generations table created successfully');
  } catch (error) {
    console.error('Error creating music generations table:', error);
  }
};



// 初始化所有表
export const initializeDatabase = async () => {
  try {
    await createUserCreditsTable();
    await createCreditTransactionsTable();
    await createMusicGenerationsTable();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};
