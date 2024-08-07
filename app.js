import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import express from "express";
import Product from "./models/Product.js";

mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));
const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id. " });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.listen(3000, () => console.log("Server Started"));
