// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import fs from 'fs';
// import dotenv from 'dotenv';

// dotenv.config();

// const filePath = 'macbook.jpeg';
// const fileStream = fs.createReadStream(filePath);

// const bucketName = process.env.S3_BUCKET_NAME;
// const region = process.env.AWS_REGION;
// const accessKeyId = process.env.ACCESS_KEY;
// const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// const s3 = new S3Client({
//   region,
//   credentials: {
//     accessKeyId,
//     secretAccessKey,
//   },
// });

// const params = {
//   Bucket: bucketName,
//   Key: 'image/macbook.jpeg',
//   Body: fileStream,
//   ContentType: 'image/jpeg',
// };

// const command = new PutObjectCommand(params);

// s3.send(command)
//   .then((data) => {
//     console.log('Object uploaded successfully', data);
//   })
//   .catch((err) => {
//     console.error('Error uploading object to S3', err.message || err);
//   });
