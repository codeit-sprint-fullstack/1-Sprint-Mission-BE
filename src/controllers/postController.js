import {
  createPost,
  getPosts,
  getPostDetail,
  updatePost,
  deletePost,
  increaseFavoritePost,
  decreaseFavoritePost,
} from "../services/postService";

export async function createPostController(req, res, next) {
  try {
    const result = await createPost({ userId: req.id, data: req.data });

    return res.status(201).send(result);
  } catch (err) {
    next(err);
  }
}

export async function getPostController(req, res, next) {
  try {
    const result = await getPosts(req.query);

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function getPostDetailController(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await getPostDetail(postId);

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function modifyPostController(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await updatePost({ postId, data: req.data });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function deletePostController(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await deletePost(postId);

    return res.status(204).send(result);
  } catch (err) {
    next(err);
  }
}

export async function increaseFavoritePostController(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await increaseFavoritePost({ userId: req.id, postId });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function decreaseFavoritePostController(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await decreaseFavoritePost({ userId: req.id, postId });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}
