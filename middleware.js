// 如果你的项目结构中有 src/ 目录，文件路径应该是 src/middleware.js
// 如果没有 src/ 目录，文件路径应该是 middleware.js，与 pages/ 同级

import { clerkMiddleware } from '@clerk/nextjs/server';

// 使用 Clerk 的中间件，这将确保 Clerk 能够正确处理身份验证
export default clerkMiddleware();
