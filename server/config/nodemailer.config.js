const nodemailer = require("nodemailer");
const logger = require("../utils/logger.utils.js");
const sgTransport = require("nodemailer-sendgrid-transport");

const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

transporter.verify((error, success) => {
  if (error) {
    logger.error("Nodemailer configuration error:", error);
  } else {
    logger.info("✅ Nodemailer is ready to send emails");
  }
});

module.exports = transporter;
