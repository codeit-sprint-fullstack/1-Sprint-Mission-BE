import mongoose from '../db/conn.mjs';
import Product from '../models/Product.mjs';
import data from './mock.mjs';

//초기화
async function seedDB() {
  try {
    await Product.deleteMany({});
    console.log('Existing data deleted');
    await Product.insertMany(data);
    console.log('Data inserted successfully.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting data', error);
  }
}

seedDB();
