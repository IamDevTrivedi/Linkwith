// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Define routes using controller methods
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post("/send-reset-otp", authController.sendResetOTP);
router.post("/reset-password", authController.resetPassword);

router.post("/send-verification-otp", authMiddleware, authController.sendVerificationOTP);
router.post("/verify-account", authMiddleware, authController.verifyAccount);

router.get("/is-authenticated", authMiddleware, authController.isAuthenticated);


module.exports = router;