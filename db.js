const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const dbURI = `mongodb://${process.env.DB_USER}:${encodeURIComponent(
      process.env.DB_PASS
    )}@${process.env.DB_HOST}:${process.env.DB_PORT}/${
      process.env.DB_NAME
    }?authSource=admin`;
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectToDB;
