// å¦æä½ çé¡¹ç®ç»æä¸­æ src/ ç®å½ï¼æä»¶è·¯å¾åºè¯¥æ¯ src/middleware.js
// å¦ææ²¡æ src/ ç®å½ï¼æä»¶è·¯å¾åºè¯¥æ¯ middleware.jsï¼ä¸ pages/ åçº§

import { clerkMiddleware } from '@clerk/nextjs/server';

// ä½¿ç¨ Clerk çä¸­é´ä»¶ï¼è¿å°ç¡®ä¿ Clerk è½å¤æ­£ç¡®å¤çèº«ä»½éªè¯
export default clerkMiddleware();
