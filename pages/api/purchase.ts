import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
const LEMON_SQUEEZY_HOST = process.env.LEMON_SQUEEZY_HOST || 'https://api.lemonsqueezy.com';
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { plan, userId } = req.body;

  try {
    let variantId;
    if (plan === 'subscribe') {
      variantId = process.env.LEMON_SQUEEZY_MEMBERSHIP_MONTHLY_VARIANT_ID;
    } else if (plan === 'one-time') {
      variantId = process.env.LEMON_SQUEEZY_MEMBERSHIP_SINGLE_TIME_VARIANT_ID;
    } else {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    const response = await axios.post(
      `${LEMON_SQUEEZY_HOST}/v1/checkouts`,
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                userId: userId,
                planType: plan,
              },
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: LEMON_SQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: 'variants', id: variantId },
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ url: response.data.data.attributes.url });
  } catch (error) {
    console.error('Error creating Lemon Squeezy checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
}
