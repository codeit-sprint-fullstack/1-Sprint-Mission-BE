import express from "express";
import {
  createPostController,
  getPostController,
  getPostDetailController,
  modifyPostController,
  deletePostController,
  increaseFavoritePostController,
  decreaseFavoritePostController,
} from "../controllers/postController.js";
import { validatePostInput } from "../middlewares/validateInput.js";
import { validateAccessToken } from "../middlewares/auth.js";

const postRouter = express.Router();

postRouter.use(validateAccessToken);

postRouter.post("/", validatePostInput, createPostController);
postRouter.get("/", getPostController);
postRouter.get("/:postId", getPostDetailController);
postRouter.patch("/:postId", validatePostInput, modifyPostController);
postRouter.delete("/:postId", deletePostController);
postRouter.patch("/:postId/favorite", increaseFavoritePostController);
postRouter.delete("/:postId/favorite", decreaseFavoritePostController);

export default postRouter;
