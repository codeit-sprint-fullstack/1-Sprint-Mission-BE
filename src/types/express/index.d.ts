import { Multer } from 'multer';

declare global {
  namespace Express {
    interface MulterS3File extends Multer.File {
      bucket: string;
      key: string;
      acl: string;
      contentType: string;
      contentDisposition?: string;
      storageClass: string;
      serverSideEncryption?: string;
      metadata: any;
      location: string;
      etag: string;
    }

    interface Request {
      user?: { id: number }; // 사용자 정보를 담기 위한 속성
      file?: MulterS3File;   // S3 파일 형식 확장
    }
  }
}
