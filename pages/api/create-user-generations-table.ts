// pages/api/create-user-generations-table.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_generations (
        user_id VARCHAR(255) PRIMARY KEY,
        remaining_generations INT DEFAULT 3
      );
    `;
    res.status(200).json({ message: 'Table created successfully' });
  } catch (error) {
    // 使用类型断言将 error 视为 Error 类型
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: errorMessage });
  }
}
