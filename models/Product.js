import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (name) {
          return name.length >= 1 && name.length <= 10;
        },
        message: 'Name은 1자 이상, 10자 이내로 입력해야 합니다.',
      },
    },
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (description) {
          return description.length >= 10 && description.length <= 100;
        },
        message: 'Description은 10자 이상, 100자 이내로 입력해야 합니다.',
      },
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (price) {
          return price > 0 && typeof price === 'number';
        },
        message: 'Price는 0보다 큰 숫자를 입력해야 합니다.',
      },
    },
    tags: {
      type: Array,
      required: true,
      validate: {
        validator: function (tags) {
          return tags.every((tag) => tag.length <= 5);
        },
        message: 'Tag는 5글 이내로 입력해야 합니다.',
      },
    },
    images: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
