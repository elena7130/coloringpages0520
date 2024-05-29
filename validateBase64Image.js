const fs = require('fs');

// 假设 base64Data 是您从 Replicate API 获取的 Base64 数据
const base64Data = "YOUR_BASE64_DATA_HERE"; // 替换为实际的 Base64 数据

// 解码 Base64 数据并保存为 PNG 文件
fs.writeFile('output.png', Buffer.from(base64Data, 'base64'), (err) => {
    if (err) {
        console.error('Error writing image to file:', err);
    } else {
        console.log('Image written to file successfully.');
    }
});
