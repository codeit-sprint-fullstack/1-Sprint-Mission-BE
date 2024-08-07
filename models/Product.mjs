import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 30,
    },
    description: {
      type: String,
      minLength: 1,
      maxLength: 150,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    favoriteCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
