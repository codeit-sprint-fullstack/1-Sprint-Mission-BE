import mongoose, { Schema } from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
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

const Product = mongoose.model('Product', ProductSchema);

export default Product;
