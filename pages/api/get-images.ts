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
    // 增加日志记录请求的时间
    console.log('Request received at:', new Date().toISOString());

    // 执行 SQL 查询获取图像数据
    const result = await sql`SELECT * FROM images ORDER BY created_at DESC`;

    // 增加日志记录查询完成的时间和结果
    console.log('Query completed at:', new Date().toISOString());
    console.log('Database result:', result);

    // 验证数据格式并添加详细日志记录
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

    // 返回成功的响应
    return res.status(200).json(result.rows);
  } catch (error: any) { // 添加类型断言 'any'
    // 增加日志记录错误发生的时间
    console.error('Error fetching images at:', new Date().toISOString(), error.message);
    return res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
}
