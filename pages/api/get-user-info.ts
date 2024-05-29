// pages/api/get-user-info.ts
/// pages/api/get-user-info.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userGeneration = await sql`SELECT remaining_generations FROM user_generations WHERE user_id = ${userId}`;
    if (userGeneration.rows.length === 0) {
      await sql`INSERT INTO user_generations (user_id, remaining_generations) VALUES (${userId}, 3)`;
      return res.status(200).json({ remaining_generations: 3 });
    } else {
      return res.status(200).json({ remaining_generations: userGeneration.rows[0].remaining_generations });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
}
