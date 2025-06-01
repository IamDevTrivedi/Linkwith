// src/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger.utils');

router.get('/', (req, res) => {
    logger.info('Health check requested');
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;