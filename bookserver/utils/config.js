/* eslint-disable */

import dotenv from 'dotenv';
dotenv.config();

let MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV && NODE_ENV.trim() === 'TEST') {
  console.log('TESTING!');
  MONGODB_URI = process.env.DBTEST_URI;
}

export default {
  MONGODB_URI,
  JWT_SECRET,
  NODE_ENV
};