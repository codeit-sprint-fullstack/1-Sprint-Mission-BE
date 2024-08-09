import mongoose, { Schema } from 'mongoose';

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
      minLength: 10,
      maxLength: 100,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: {
      type: [String],
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   transform: (doc, ret) => {
    //     delete ret.__v; // 응답에서 __v 필드 제거
    //     return ret;
    //   },
    // },
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
