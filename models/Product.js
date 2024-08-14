import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 10,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    minlength: 1,
    min: 0,
  },
  tags: [
    {
      type: String,
      maxlength: 5,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
