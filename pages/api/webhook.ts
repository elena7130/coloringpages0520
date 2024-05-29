import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { sql } from '@vercel/postgres';

export const config = {
  api: {
    bodyParser: false, // 关闭bodyParser，使我们可以处理原始的请求体
  },
};

const LEMON_SQUEEZY_SIGNATURE_SECRET = process.env.LEMON_SQUEEZY_SIGNATURE_SECRET;

const rawBodyBuffer = async (req: NextApiRequest) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sigString = req.headers['x-signature'] as string;
  if (!sigString) {
    console.error(`Signature header not found`);
    return res.status(401).json({ error: "Signature header not found" });
  }

  const body = await rawBodyBuffer(req);
  const payload = JSON.parse(body.toString());

  const hmac = crypto.createHmac("sha256", LEMON_SQUEEZY_SIGNATURE_SECRET as string);
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signature = Buffer.from(sigString, "utf8");

  if (!crypto.timingSafeEqual(digest, signature)) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  const userId = payload.meta.custom_data && payload.meta.custom_data.userId || '';
  if (!userId) {
    return res.status(403).json({ error: "No userId provided" });
  }

  try {
    const userGenerations = await sql`
      SELECT remaining_generations FROM user_generations WHERE user_id = ${userId}
    `;

    const eventType = payload.meta.event_name;
    let newGenerations;
    let increment;

    switch (payload.data.attributes.variant_id) {
      case process.env.LEMON_SQUEEZY_MEMBERSHIP_MONTHLY_VARIANT_ID:
        increment = 100; // 按月付费，增加100次生成次数
        break;
      case process.env.LEMON_SQUEEZY_MEMBERSHIP_SINGLE_TIME_VARIANT_ID:
        increment = 80; // 按次付费，增加80次生成次数
        break;
      default:
        return res.status(400).json({ error: "Invalid variant ID" });
    }

    switch (eventType) {
      case "order_created":
        newGenerations = userGenerations.rowCount === 0 ? increment : userGenerations.rows[0].remaining_generations + increment;
        await sql`
          INSERT INTO user_generations (user_id, remaining_generations)
          VALUES (${userId}, ${newGenerations})
          ON CONFLICT (user_id)
          DO UPDATE SET remaining_generations = EXCLUDED.remaining_generations
        `;
        break;
      case "subscription_created":
        newGenerations = userGenerations.rowCount === 0 ? increment : userGenerations.rows[0].remaining_generations + increment;
        await sql`
          INSERT INTO user_generations (user_id, remaining_generations)
          VALUES (${userId}, ${newGenerations})
          ON CONFLICT (user_id)
          DO UPDATE SET remaining_generations = EXCLUDED.remaining_generations
        `;
        break;
      default:
        console.warn(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
