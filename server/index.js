// src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger.utils');
const connectDB = require('./config/database.config');
const urlRoutes = require('./routes/url.routes');
const healthRoutes = require('./routes/health.routes');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
console.log("CORS ORIGIN : ", process.env.CORS_ORIGIN);
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser({ Credential: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);

// Start Server
app.listen(PORT, () => {
    logger.info(`✅ Server running on port ${PORT}`);
});