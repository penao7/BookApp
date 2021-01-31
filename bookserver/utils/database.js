import mongoose from 'mongoose';
import config from './config.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = config.MONGODB_URI;

export const connect = async () => {
  await mongoose.connect(MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('connected to MongoDB');
    })
    .catch((error) => {
      console.log('error connection to MongoDB:', error.message);
    });
};

