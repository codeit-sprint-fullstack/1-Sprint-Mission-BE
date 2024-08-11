import express from 'express';
import mongoose from 'mongoose';
import Data from './DataSchema.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// React 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '../build')));

// 모든 경로에 대해 index.html 반환 (React 라우팅 지원)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

const DATABASE_URL = process.env.DATABASE_URL;

/**에러 핸들러 */
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

//상품 목록조회
app.get(
  '/datas',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const option = req.query.option; // recent, oldest 옵션
    const search = req.query.search || '';
    const sortOption = () => {
      if (option === 'recent') {
        return { createdAt: -1 };
      } else if (option === 'oldest') {
        return { createdAt: 1 };
      }
      return {};
    };

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const data = await Data.find(searchFilter)
      .skip(offset)
      .limit(pageSize)
      .sort(sortOption())
      .select('id name price createAt');

    res.status(200).send(data);
  })
);

//전체 데이터
app.get(
  '/datas/all',
  asyncHandler(async (req, res) => {
    const data = await Data.find({});
    res.status(200).send(data);
  })
);

//상품 상세 조회
app.get(
  '/datas/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await Data.findById(id).select(
      'id name description price tags createdAt'
    );
    if (item) {
      res.status(200).send(data);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

//상품 등록
app.post(
  '/datas',
  asyncHandler(async (req, res) => {
    const newData = await Data.create(req.body);
    res.status(201).send(newData);
  })
);

//상품 수정
app.patch(
  '/datas/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const items = await Data.findById(id);
    if (items) {
      Object.keys(req.body).forEach((key) => {
        items[key] = req.body[key];
      });
      await items.save();
      res.send(items);
    } else {
      res.status(404).send({ message: 'Cannot find given id. ' });
    }
  })
);

//상품 삭제
app.delete(
  '/datas/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const items = await Data.findByIdAndDelete(id);
    if (items) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id. ' });
    }
  })
);

app.listen(PORT, () => console.log(`PORT :` + PORT));

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((e) => {
    console.log('err: ' + e);
  });
