import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import Replicate from 'replicate';
import { sql } from '@vercel/postgres';
import AWS from 'aws-sdk';
import axios from 'axios';

// 配置 AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || ''
});

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

  let { prompt, negativePrompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  prompt = `${prompt} coloring pages`;

  try {
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

    console.log("Generating image with input:", { prompt, negativePrompt });
    const input = {
      width: 896,
      height: 1344,
      prompt: prompt,
      refine: "no_refiner",
      scheduler: "K_EULER",
      lora_scale: 0.6,
      num_outputs: 1,
      guidance_scale: 7.5,
      apply_watermark: true,
      high_noise_frac: 0.8,
      negative_prompt: negativePrompt || "",
      prompt_strength: 0.8,
      num_inference_steps: 50
    };

    const output = await replicate.run(
      "paappraiser/retro-coloring-book:cbaf592788a0513ff5ca3beecdc0d9280fb44908771656f2adef630a263d9ebe",
      { input }
    ) as string[];

    if (!output || output.length === 0) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    const imageUrl = output[0];
    console.log('Generated image URL:', imageUrl);

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary'); // 确保使用正确的编码转换

    // 验证是否为有效的 PNG 文件
    const isPng = buffer.toString('hex', 0, 8) === '89504e470d0a1a0a';
    if (!isPng) {
      console.error('Downloaded file is not a valid PNG image.');
      return res.status(500).json({ error: 'The generated file is not a valid PNG image.' });
    }

    console.log("Uploading image to S3");

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

    await sql`UPDATE user_generations SET remaining_generations = remaining_generations - 1 WHERE user_id = ${userId}`;

    res.status(200).json({ url: s3Response.Location });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Error generating image', details: error.message });
  }
}
