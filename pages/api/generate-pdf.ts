import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import fetch from 'node-fetch';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const imageUrl = req.query.imageUrl as string;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: Status ${response.status}`);
    }
    const imageBuffer = await response.buffer();

    const doc = new PDFDocument({ margin: 0 });
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      const filename = imageUrl.split('/').pop();
      if (!filename) {
        throw new Error('Invalid image URL');
      }
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}.pdf"`);
      res.send(pdfData);
    });

    doc.image(imageBuffer, {
      fit: [590, 730],
      align: 'center',
      valign: 'center'
    });

    doc.fontSize(12).text('https://www.dragon-coloringpages.com/', 0, 750, { align: 'center', width: 590 });

    doc.end();
  } catch (error: any) {
    console.error('Failed to generate PDF:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(500).json({ error: message });
  }
};

export default handler;
