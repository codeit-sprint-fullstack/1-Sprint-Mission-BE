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
    favoriteCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v; // 응답에서 __v 필드 제거
        return ret;
      },
    },
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
