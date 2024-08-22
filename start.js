import dotenv from "dotenv";
import express from "express";
import indexApp from "./index.js";
import mainApp from "./main.js";
import cors from "cors";
dotenv.config();

const mainApp = express();
mainApp.use(cors());
mainApp.use(express.json());

mainApp.use("/", indexApp);
mainApp.use("/user", mainApp);

mainApp.listen(3000, () => {
  console.log("Server started on port 3000");
});
