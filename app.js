import * as dotenv from "dptenv";
import express from "express";
import cors from "cors"; //  서로 다른 IP에 위치한 클라이언트와 서버가 데이터를 주고 받을 수 있게 만듦
import PrismaClient from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.listen(3000, () => console.log("Server is running"));
