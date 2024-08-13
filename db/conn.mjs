import mongoose from 'mongoose';
import '../loadEnvironment.mjs';

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.error('Failed to connect DB:', error);
  });

export default mongoose;
