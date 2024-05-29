// pages/api/create-images-table.ts 创建一个表来存储每张生成的图片的 URL、描述、生成时间等信息
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await sql`CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      url VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    return response.status(200).json({ message: 'Table created successfully' });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
