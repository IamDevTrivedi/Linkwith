// src/config/database.js
const mongoose = require('mongoose');
const logger = require('../utils/logger.utils');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        logger.info('✅ Database connected successfully');
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;