const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const logger = require("../utils/logger.utils");

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY,
  },
});

const transporter = {
  sendMail: async ({ from, to, subject, html }) => {
    try {
      const emailData = {
        sender: {
          email: from,
        },
        to: [{
          email: to,
        }],
        subject: subject,
        htmlContent: html,
      };

      await brevoClient.post("/smtp/email", emailData);
    } catch (error) {
      logger.error("Failed to send email");
      logger.error(error);
    }
  },

  verify: async (callback) => {
    try {
      await brevoClient.get("/account");
      if (callback) callback(null, true);
    } catch (error) {
      if (callback) callback(error, false);
    }
  },
};

transporter.verify((error, success) => {
  if (!error) {
    logger.info("Nodemailer is ready to send emails");
  } else {
    logger.error("Nodemailer configuration error:", error);
  }
});

module.exports = transporter;
