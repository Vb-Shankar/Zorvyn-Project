const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured.');
  }

  await mongoose.connect(mongoUri);
};

module.exports = connectDB;
