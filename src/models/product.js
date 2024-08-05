import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 30,
      minLength: 1,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
