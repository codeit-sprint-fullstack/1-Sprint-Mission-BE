import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number }; // 사용자 정보를 담기 위한 속성
    }
  }
}

// 모듈 타입 선언 추가
declare module './routes/commentRoutes' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/likeRoutes' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/authRoutes' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/imageRoutes' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/productRoutes' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/userRoutes' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}
