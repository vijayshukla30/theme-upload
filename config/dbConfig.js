import mongoose from 'mongoose';

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || '';
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME || '';
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || '';

const connectDB = async () => {
  try {
    // Connecting to the database
    let mongoUri = '';
    if (MONGO_DB_USERNAME) {
      mongoUri = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
    } else {
      mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
    }
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      dbName: MONGO_DB_NAME,
    });
    console.log('mongodb database connected successfully');
  } catch (error) {
    console.log('error :>> ', error);
  }
};

export default connectDB;
