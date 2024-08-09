import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품명은 필수값입니다"],
      minlength: [1, "상품명은 1자 이상이어야 합니다"],
      maxlength: [10, "상품명은 10자 이하여야 합니다"],
      trim: true, // 공백 제거
    },
    description: {
      type: String,
      required: [true, "상품소개는 필수값입니다"],
      minlength: [10, "상품소개는 10자 이상이어야 합니다"],
      maxlength: [100, "상품소개는 100자 이하여야 합니다"],
      trim: true, // 공백 제거
    },
    price: {
      type: Number,
      required: [true, "가격은 필수값입니다"],
      min: [0, "가격은 0원 이상 이어야합니다"],
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.every((tag) => tag.length <= 5 && tag.length >= 1);
        },
        message: "태그는 1자 이상, 5자 이하여야 합니다",
      },
      set: function (tags) {
        return Array.from(
          new Set(tags.map((tag) => tag.trim()).filter((tag) => tag))
        );
      },
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 설정
ProductSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
