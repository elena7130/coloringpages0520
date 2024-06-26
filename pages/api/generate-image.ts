
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import Replicate from 'replicate';
import { sql } from '@vercel/postgres';
import AWS from 'aws-sdk';
import axios from 'axios';
import logger from '../../utils/logger';



// 配置 AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || ''
});

export const config = {
  api: {
    bodyParser: false,  // 确保关闭默认的bodyParser
    maxDuration: 60,  // 设置最大执行时间
  },
};

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 使用流式处理来解析 JSON 请求体
  const buffers: Uint8Array[] = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  const body = JSON.parse(data);

  let { prompt } = body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  prompt = `${prompt}  black and white coloring page`;
  

  try {
    // 检查用户的生成次数
    let userGeneration = await sql`SELECT remaining_generations FROM user_generations WHERE user_id = ${userId}`;
    if (userGeneration.rows.length === 0) {
      await sql`INSERT INTO user_generations (user_id, remaining_generations) VALUES (${userId}, 3)`;
      userGeneration = {
        ...userGeneration,
        rows: [{ remaining_generations: 3 }]
      };
    } else if (userGeneration.rows[0].remaining_generations <= 0) {
      return res.status(403).json({ error: 'No remaining generations' });
    }

    // 记录开始时间
    const startTime = performance.now();
    logger.info("Generating image with input:", { prompt });

    const input = {
      width:  384,
      height: 576,
      prompt: prompt,
      refine: "no_refiner",
      scheduler: "K_EULER",
      lora_scale: 0.6,
      num_outputs: 1,
      guidance_scale: 7.5,
      apply_watermark: true,
      high_noise_frac: 0.8,
      negative_prompt: "complex, realistic, color, gradient ",
      prompt_strength: 0.8,
      num_inference_steps: 50
    };

    const output = await replicate.run(
      "pnickolas1/sdxl-coloringbook:d2b110483fdce03119b21786d823f10bb3f5a7c49a7429da784c5017df096d33",
      { input }
    ) as string[];

    if (!output || output.length === 0) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    const imageUrl = output[0];
    logger.info('Generated image URL:', imageUrl);

    // 记录生成结束时间
    const endTime = performance.now();
    const generationTime = endTime - startTime;
    logger.info(`Image generation completed in ${generationTime.toFixed(2)} ms`);

    // 异步上传图像到 S3
    (async () => {
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary'); // 确保使用正确的编码转换

        // 验证是否为有效的 PNG 文件
        const isPng = buffer.toString('hex', 0, 8) === '89504e470d0a1a0a';
        if (!isPng) {
          logger.error('Downloaded file is not a valid PNG image.');
          return;
        }

        logger.log({level: 'info',
          message: "Uploading image to S3"});

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const uniqueIdentifier = `${Date.now()}.png`;

        const s3Key = `${year}/${month}/${day}/${uniqueIdentifier}`;

        const s3Response = await s3.upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME || '',
          Key: s3Key,
          Body: buffer,
          ContentType: 'image/png'
        }).promise();

        console.log("Image uploaded, saving metadata to database");
        await sql`INSERT INTO images (url, description, created_at) VALUES (${s3Response.Location}, ${prompt}, NOW())`;

      } catch (uploadError) {
        logger.error('Error during S3 upload:', uploadError);
      }
    })();

    // 更新用户的生成次数
    await sql`UPDATE user_generations SET remaining_generations = remaining_generations - 1 WHERE user_id = ${userId}`;

    // 立即返回生成的图像 URL 和生成时间
    res.status(200).json({ url: imageUrl, generationTime: `${generationTime.toFixed(2)} ms` });

  } catch (error: any) {
    logger.error('Error generating image:', error);
    res.status(500).json({ error: 'Error generating image', details: error.message });
  }
}
