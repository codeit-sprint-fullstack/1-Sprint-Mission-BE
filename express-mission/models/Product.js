import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 10,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: {
      type: String,
      required: true,
      maxLength: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
