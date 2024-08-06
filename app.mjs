import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import './db/conn.mjs';

const app = express();
app.use(cors());
app.use(express());

app.use(express.json());

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
