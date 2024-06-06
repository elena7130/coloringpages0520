import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await sql`SELECT * FROM images ORDER BY created_at DESC`;

    // 添加详细日志记录以查看返回的数据
    console.log('Database result:', result);

    // 验证数据格式并添加日志记录
    const validResult = Array.isArray(result.rows) && result.rows.every(image => {
      const isValid = image.url && image.description && image.created_at;
      if (!isValid) {
        console.error('Invalid image entry:', JSON.stringify(image));
      }
      return isValid;
    });

    if (!validResult) {
      console.error('Invalid data format:', JSON.stringify(result.rows));
      return res.status(500).json({ error: 'Invalid data format' });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
}
