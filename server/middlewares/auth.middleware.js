const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.utils');

const authMiddleware = (req, res, next) => {

    logger.info('authMiddleware called');

    const { token } = req.cookies;

    if (!token) {
        logger.error('Unauthorized');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decorded = jwt.verify(token, process.env.JWT_SECRET);

        if (decorded.id) {
            logger.info('User authenticated');
            req.body.id = decorded.id;
        }

        else {
            logger.error('Unauthorized');
            return res.status(401).json({success: false, message: 'Unauthorized' });
        }

        next();

    } catch (error) {
        logger.error('Unauthorized');
        return res.status(401).json({ message: 'Unauthorized' });
    }

};

module.exports = authMiddleware;