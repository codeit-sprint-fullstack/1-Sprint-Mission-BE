import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 10,
      required: true,
    },
    description: {
      type: String,
      minLength: 10,
      required: true,
    },
    price: {
      type: Number,
    },
    tags: {
      type: String,
      maxLength: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
