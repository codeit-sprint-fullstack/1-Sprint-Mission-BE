import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/products.js";
import Comment from "./models/productsComment.js";
import cors from "cors";
dotenv.config();

console.log(process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Database connected");
});

const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log(e.name);
      console.log(e.message);
    }
  };
}

app.get(
  "/product",
  asyncHandler(async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const keyword = req.query.keyword || "";

      const startIndex = (page - 1) * limit;

      const searchQuery = keyword
        ? {
            name: { $regex: keyword, $options: "i" } || {
              description: { $regex: keyword, $options: "i" },
            },
          }
        : {};

      const products = await Product.find(searchQuery)
        .skip(startIndex)
        .limit(limit);

      const totalCount = await Product.countDocuments(searchQuery);

      res.send({ product: products, totalCount, page, limit });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  })
);

app.get(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("comment");
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

app.post(
  "/product",
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  })
);

app.patch(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });
      await product.save();
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

app.delete(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (product) {
      await Comment.deleteMany({ productId: id });

      res.send({
        message: "Product and associated comments deleted successfully",
      });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

app.post("/product/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const product = await Product.findById(id);
  if (product) {
    const comment = await Comment.create({
      content,
      productId: id,
    });
    product.comment.push(comment._id);
    await product.save();
    res.status(201).json(comment);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

app.get("/product/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { cursor, limit = 10 } = req.query;
  const comments = await Comment.find({
    productId: id,
  })
    .skip(parseInt(cursor) || 0)
    .limit(parseInt(limit) || 10);
  res.send(comments);
});

app.patch("/product/:id/comment/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  const { content } = req.body;
  const product = await Product.findById(id);
  if (product) {
    const comment = await Comment.findById(commentId);
    if (comment) {
      comment.content = content;
      await comment.save();
      res.send(comment);
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

app.delete("/product/:id/comment/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  const product = await Product.findById(id);

  if (product) {
    const comment = await Comment.findById(commentId);
    if (comment) {
      product.comment = product.comment.filter(
        (cId) => cId.toString() !== commentId
      );
      await product.save();

      await Comment.deleteOne({ _id: commentId });

      res.send({ message: "Comment deleted successfully" });
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
