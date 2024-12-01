const mongoose = require('mongoose');

const buildMongoURI = () => {
  const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

  if (!DB_USER || !DB_PASS || !DB_HOST || !DB_PORT || !DB_NAME) {
    console.error('Missing required MongoDB environment variables.');
    process.exit(1);
  }

  return `mongodb://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
};

const connectToDB = async () => {
  try {
    const dbURI = buildMongoURI();
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectToDB;
