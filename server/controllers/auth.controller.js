const User = require("../models/user.model.js");
const logger = require("../utils/logger.utils.js");
const { validateEmail, validatePassword } = require("../utils/validators.utils.js");
const transporter = require("../config/nodemailer.config.js");
const { generateWelcomeEmail, generateOtpEmail, generateResetOtpEmail } = require("../utils/templates.utils.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();


const generateTokenAndSetCookie = (res, userId) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return token;
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Failed to generate authentication token");
    }
};


const authController = {

    register: async (req, res) => {

        logger.info("Initiating user registration", { body: req.body });

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            logger.warn("Validation failed: Missing required fields");
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!validateEmail(email)) {
            logger.warn("Validation failed: Invalid email format", { email });
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (!validatePassword(password)) {
            logger.warn("Validation failed: Password not in required format");
            return res.status(400).json({ success: false, message: "Password not in Format" });
        }

        try {
            logger.info("Checking if user already exists", { email });
            const user = await User.findOne({ email });

            if (user) {
                logger.warn("Registration failed: User already exists", { email });
                return res.status(400).json({ success: false, message: "User already exists" });
            }

            logger.info("Hashing password for new user");
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });

            logger.info("Saving new user to database", { email });
            await newUser.save();

            logger.info("User registered successfully", { userId: newUser._id, email });

            const token = generateTokenAndSetCookie(res, newUser._id);

            logger.info("Generating and sending welcome email", { email });
            const welcomeMessageOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Welcome to Our Platform!",
                html: generateWelcomeEmail({
                    name: name,
                    year: new Date().getFullYear()
                })
            };

            try {
                await transporter.sendMail(welcomeMessageOptions);
                logger.info("Welcome email sent successfully", { email });
            } catch (emailError) {
                logger.error("Failed to send welcome email", { email, error: emailError.message });
            }

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    name: newUser.name,
                    email: newUser.email,
                },
                token
            });

        } catch (error) {
            logger.error("Unexpected error during user registration", { error: error.message });
            return res.status(500).json({ success: false, message: "Error registering user" });
        }
    },


    login: async (req, res) => {

        logger.info("Initiating user login", { body: req.body });

        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn("Validation failed: Missing required fields");
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        try {
            logger.info("Checking if user exists", { email });
            const user = await User.findOne({ email });

            if (!user) {
                logger.warn("Login failed: User not found", { email });
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }

            logger.info("Validating user password", { email });
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                logger.warn("Login failed: Invalid password", { email });
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }

            const token = generateTokenAndSetCookie(res, user._id);

            logger.info("User logged in successfully", { email });

            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                user: {
                    name: user.name,
                    email: user.email,
                },
                token
            });

        } catch (error) {
            logger.error("Unexpected error during user login", { error: error.message });
            return res.status(500).json({ success: false, message: "Error logging in" });
        }
    },


    logout: async (req, res) => {

        logger.info("Initiating user logout");

        try {

            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            });

            logger.info("User logged out successfully");
            res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });

        } catch (error) {
            logger.error("Unexpected error during user logout", { error: error.message });
            return res.status(500).json({ success: false, message: "Error logging out" });
        }
    },


    sendResetOTP: async (req, res) => {

        logger.info("Initiating password reset", { body: req.body });
        const { email } = req.body;

        if (!email) {
            logger.warn("Validation failed: Missing email field");
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!validateEmail(email)) {
            logger.warn("Validation failed: Invalid email format", { email });
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        try {

            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                logger.warn("User not found in this Email ID", { email });
                return res.status(400).json({ success: false, message: "User not found" });
            }


            const otp = String(Math.floor(100000 + Math.random() * 900000));

            existingUser.resetOtp = otp;
            existingUser.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;

            await existingUser.save();

            const messageOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Password Reset OTP",
                html: generateResetOtpEmail({
                    otp: otp,
                    validity: 10,
                    year: new Date().getFullYear()
                })
            }

            try {
                await transporter.sendMail(messageOptions);
                logger.info("Reset OTP sent successfully", { email, otp });
            } catch (emailError) {
                logger.error("Failed to send reset OTP", { email, error: emailError.message });
            }

            return res.status(200).json({
                success: true,
                message: "Reset OTP sent successfully"
            });

        } catch (error) {
            logger.error("Unexpected error during OTP generation", { error: error.message });
            return res.status(500).json({ success: false, message: "Error sending OTP" });
        }
    },


    resetPassword: async (req, res) => {

        logger.info("Initiating password reset", { body: req.body });
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            logger.warn("Validation failed: Missing required fields");
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }


        if (!validateEmail(email)) {
            logger.warn("Validation failed: Invalid email format", { email });
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (!validatePassword(password)) {
            logger.warn("Validation failed: Password not in required format");
            return res.status(400).json({ success: false, message: "Password not in Format" });
        }


        try {
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                logger.warn("User not found in this Email ID", { email });
                return res.status(400).json({ success: false, message: "User not found" });
            }

            if (existingUser.resetOtp !== otp) {
                logger.warn("Invalid OTP entered", { email });
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }

            if (existingUser.resetOtpExpiresAt < Date.now()) {
                logger.warn("OTP expired", { email });
                return res.status(400).json({ success: false, message: "OTP expired" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);


            existingUser.password = hashedPassword;
            existingUser.resetOtp = "";
            existingUser.resetOtpExpiresAt = 0;


            await existingUser.save();

            logger.info("Password reset successful", { email });

            return res.status(200).json({
                success: true,
                message: "Password reset successful"
            });

        } catch (error) {
            logger.error("Unexpected error during password reset", { error: error.message });
            return res.status(500).json({ success: false, message: "Error resetting password" });
        }
    },


    sendVerificationOTP: async (req, res) => {

        logger.info("Initiating account verification", { body: req.body });

        try {
            const userId = req.body.id;

            const user = await User.findById(userId);

            if (!user) {
                logger.warn("User not found", { userId });
                return res.status(400).json({ success: false, message: "User not found" });
            }

            if (user.isAccountVerified) {
                logger.warn("Account already verified", { userId });
                return res.status(400).json({ success: false, message: "Account already verified" });
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000));

            user.verifyOtp = otp;
            user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000;

            await user.save();

            const messageOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
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

            } catch (emailError) {
                logger.error("Failed to send verification OTP", { userId, error: emailError.message });
                return res.status(500).json({
                    success: false,
                    message: "Error sending verification OTP"
                });
            }
        } catch (error) {
            logger.error("Unexpected error during OTP generation", { error: error.message });
            return res.status(500).json({ success: false, message: "Error sending OTP" });
        }

    },


    verifyAccount: async (req, res) => {

        logger.info("Initiating account verification", { body: req.body });

        const { id, otp } = req.body;

        if (!id || !otp) {
            logger.warn("Validation failed: Missing required fields");
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        try {

            const user = await User.findById(id);

            if (!user) {
                logger.warn("User not found", { id });
                return res.status(400).json({ success: false, message: "User not found" });
            }

            if (user.isAccountVerified) {
                logger.warn("Account already verified", { id });
                return res.status(400).json({ success: false, message: "Account already verified" });
            }

            if (user.verifyOtp !== otp) {
                logger.warn("Invalid OTP entered", { id });
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }

            if (user.verifyOtpExpiresAt < Date.now()) {
                logger.warn("OTP expired", { id });
                return res.status(400).json({ success: false, message: "OTP expired" });
            }

            user.isAccountVerified = true;
            user.verifyOtp = "";
            user.verifyOtpExpiresAt = 0;

            await user.save();

            logger.info("Account verified successfully", { id });

            return res.status(200).json({
                success: true,
                message: "Account verified successfully"
            });

        } catch (error) {
            logger.error("Unexpected error during account verification", { error: error.message });
            
            
        }
    },


    isAuthenticated: async (req, res) => {
        logger.info("Checking if user is authenticated", { userId: req.body.id });

        try {
            res.status(200).json({
                success: true,
                message: "User authenticated",
                user: {
                    id: req.body.id,
                    name: req.body.name,
                    email: req.body.email
                }
            });
            logger.info("User authenticated successfully", { userId: req.body.id });
        } catch (error) {
            logger.error("Authentication error", { error: error.message });
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
    }
}

module.exports = authController;