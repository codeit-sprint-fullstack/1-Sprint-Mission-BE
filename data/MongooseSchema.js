import mongoose, { Schema } from "mongoose";

const ProductSampleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      require: true,
      min: 10,
      max: 100,
    },
    price: {
      type: Number,
      require: true,
    },
    tags: [
      {
        type: String,
        min: 1,
        max: 5,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    ownerId: {
      type: String,
    },
    favorite_user_id: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    collection: "samples",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const SampleData = mongoose.model("SampleData", ProductSampleSchema);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      require: true,
      min: 10,
      max: 100,
    },
    price: {
      type: Number,
      require: true,
    },
    tag: [
      {
        type: String,
        min: 1,
        max: 5,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    favorite_user_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    collection: "products",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const Product = mongoose.model("Product", ProductSchema);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 1,
      max: 20,
    },
    nickname: {
      type: String,
      require: true,
      min: 1,
      max: 10,
    },
    password: {
      type: String,
      require: true,
      min: 8,
      max: 24,
    },
    email: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    collection: "users",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const User = mongoose.model("User", UserSchema);
