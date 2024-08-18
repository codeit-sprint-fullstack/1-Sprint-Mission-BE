import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: { type: String },
    description: { type: String, required: true },
    price: { type: Number, require: true },
    tags: { type: String },
    isComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Data = mongoose.model('Data', DataSchema);

export default Data;
