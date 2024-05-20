import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import fetch from 'node-fetch';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const imageUrl = req.query.imageUrl as string;
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer(); // 修改：使用 .buffer() 替换 .arrayBuffer()

    const doc = new PDFDocument({ margin: 0 }); // 修改：设置边距为 0
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(imageUrl.split('/').pop()!)}"`);
      res.send(pdfData);
    });

    // 修改：调整 fit 参数以留出底部空间添加文字
    doc.image(imageBuffer, {
      fit: [590, 730], // 修改：调整高度以留出底部空间
      align: 'center',
      valign: 'top'
    });

    // 新增：在底部添加域名文字
    doc.fontSize(12).text('https://www.dragon-coloringpages.com/', 0, 750, { align: 'center', width: 570 });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};

export default handler;
