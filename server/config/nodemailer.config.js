const nodemailer = require('nodemailer');
const logger = require('../utils/logger.utils.js');

const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        logger.error('Nodemailer configuration error:', error);
    } else {
        logger.info('✅ Nodemailer is ready to send emails');
    }
});

module.exports = transporter;