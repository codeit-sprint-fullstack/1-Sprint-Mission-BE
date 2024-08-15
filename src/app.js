import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import articleRoute from "./route/articles.js";
import commentRoute from "./route/comments.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("default path");
});

app.use("/articles", articleRoute);
app.use("/comments", commentRoute);


app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
