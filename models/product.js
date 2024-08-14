import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 1 && v.length <= 10;
        },
        message: (props) =>
          `상품명의 길이는 1자 이상 10자 이내여야 합니다. 현재 길이: ${props.value.length}`,
      },
    },
    description: {
      type: String,
      validate: {
        validator: function (v) {
          return v.length >= 10 && v.length <= 100;
        },
        message: (props) =>
          `상품 소개의 길이는 1자 이상 10자 이내여야 합니다. 현재 길이: ${props.value.length}`,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    tag: {
      type: Array,
      validate: {
        validator: function (arr) {
          return arr.every((item) => item.length <= 5);
        },
        message: "각 태그의 이름은 5자 이내여야 합니다.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
