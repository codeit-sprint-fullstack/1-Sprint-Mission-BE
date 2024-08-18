import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      minLength: 1,
    },
    tag: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
