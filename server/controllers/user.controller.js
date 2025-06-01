const User = require('../models/user.model');
const logger = require('../utils/logger.utils');
const transporter = require("../config/nodemailer.config.js");
const { generateOtpEmail } = require("../utils/templates.utils.js");
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword } = require("../utils/validators.utils.js");


const userController = {

    getUserData: async (req, res) => {

        logger.info("getUserData called");

        const { id } = req.body;
        const userId = id;

        try {

            const exisitingUser = await User.findById(userId);

            if (!exisitingUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.status(200).json({ success: true, userData: exisitingUser });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }


    },

    updateEmailSend: async (req, res) => {
        logger.info("updateEmailSend called");

        const { id, email } = req.body;
        const userId = id;

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        try {

            const exisitingUser = await User.findById(userId);

            if (!exisitingUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000));

            exisitingUser.updateData = { email: email };
            exisitingUser.updateData.emailVerified = false;
            exisitingUser.updateData.emailOTP = otp;
            exisitingUser.updateData.emailOTPExpires = Date.now() + 10 * 60 * 1000;

            await exisitingUser.save();

            const messageOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Account Verification OTP",
                html: generateOtpEmail({
                    otp: otp,
                    validity: 10,
                    year: new Date().getFullYear()
                })
            };

            try {

                await transporter.sendMail(messageOptions);
                logger.info("Verification OTP sent successfully", { userId, otp });

                return res.status(200).json({
                    success: true,
                    message: "Verification OTP sent successfully"
                });

            } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
            }


        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    },

    updateEmailVerify: async (req, res) => {

        logger.info("updateEmailVerify called");

        const { id, otp } = req.body;
        const userId = id;


        try {

            const exisitingUser = await User.findById(userId);

            if (!exisitingUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (exisitingUser.updateData.emailOTP !== otp) {
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }

            if (exisitingUser.updateData.emailOTPExpires < Date.now()) {
                return res.status(400).json({ success: false, message: "OTP expired" });
            }

            exisitingUser.updateData = {
                email: exisitingUser.updateData.email,
                emailVerified: true
            }

            await exisitingUser.save();

            return res.status(200).json({ success: true, message: "Email verified successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }


    },

    updateProfile: async (req, res) => {

        logger.info("updateProfile called");

        const { id, name, password, email } = req.body;
        const userId = id;

        if (!email && !name && !password) {
            return res.status(400).json({ success: false, message: "Nothing to update" });
        }

        try {

            const exisitingUser = await User.findById(userId);

            if (!exisitingUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (email) {
                if (!validateEmail(email)) {
                    return res.status(400).json({ success: false, message: "Invalid email" });
                }
                exisitingUser.email = email;
            }

            if (name) {
                exisitingUser.name = String(name);
            }

            if (password) {
                if (!validatePassword(password)) {
                    return res.status(400).json({ success: false, message: "Invalid password" });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                exisitingUser.password = hashedPassword;
            }

            exisitingUser.updateData = {};
            await exisitingUser.save();

            return res.status(200).json({ success: true, message: "Profile updated successfully" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

}

module.exports = userController;