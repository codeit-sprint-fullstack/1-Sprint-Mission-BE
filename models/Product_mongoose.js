import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
