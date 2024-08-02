import mongoose from "mongoose";

const ProductSampleSchema = new mongoose.Schema(
  {
    _id: Number,
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
      type: Number,
    },
    favoriteCount: {
      type: Number,
    },
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
      type: Number,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", ProductSchema);

const UserSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      require: true,
      min: 1,
      max: 10,
    },
    name: {
      type: String,
      require: true,
      min: 1,
      max: 20,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);

const UserFavoritesSchema = new mongoose.Schema(
  {
    _id: Number,
    favorites: [{ tpye: Number }],
  },
  {
    collection: "favoritesbyuser",
  }
);

export const UserFavorites = mongoose.model(
  "UserFavorites",
  UserFavoritesSchema
);

const ProductFavoritesSchema = new mongoose.Schema(
  {
    _id: Number,
    users: [{ type: Number }],
  },
  {
    collection: "favoritesbyproduct",
  }
);

export const ProductFavorites = mongoose.model(
  "ProductFavorites",
  ProductFavoritesSchema
);
