import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Coneccted');
  } catch (err) {
    console.error('Conection Error', err);
    process.exit(1);
  }
};