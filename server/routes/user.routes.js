const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/get-user-data", authMiddleware, userController.getUserData);
router.post("/update-email-send", authMiddleware, userController.updateEmailSend);
router.post("/update-email-verify", authMiddleware, userController.updateEmailVerify);
router.post("/update-profile", authMiddleware, userController.updateProfile);

module.exports = router;