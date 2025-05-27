const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoUri = process.env.MONGO_URI
const mongoDb = process.env.MONGO_DB 

const connectDB = async () => {
  try {
    const connectionString = `${mongoUri}/${mongoDb}`;
    console.log('Attempting to connect to MongoDB at:', connectionString);
    
    await mongoose.connect(connectionString, {
    });
    console.log("Connected to MongoDB successfully");
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectDB;