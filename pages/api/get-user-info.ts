// pages/api/get-user-info.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  // 检查是否获取到 userId
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 查询用户的生成次数
    const userGeneration = await sql`SELECT remaining_generations FROM user_generations WHERE user_id = ${userId}`;

    // 如果用户不存在，则插入新的用户记录并设置生成次数为10次
    if (userGeneration.rows.length === 0) {
      await sql`INSERT INTO user_generations (user_id, remaining_generations) VALUES (${userId}, 10)`;
      return res.status(200).json({ remaining_generations: 10 });
    } else {
      // 如果用户存在，则返回当前的生成次数
      return res.status(200).json({ remaining_generations: userGeneration.rows[0].remaining_generations });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
}
