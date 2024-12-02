"use strict";
const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'photo-diary',
        key: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
});
app.post('/', upload.single('photo'), async (req, res) => {
    const { date, content } = req.body;
    const { location } = req.file;
    const diary = await prisma.diary.create({
        data: {
            date: new Date(date),
            content,
            photoUrl: location,
        },
    });
    res.json(req.file);
});
