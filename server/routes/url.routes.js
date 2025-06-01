// src/routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

router.get('/check-availability/:shortURL', urlController.checkAvailability);
router.post('/generate', urlController.generateURL);
router.post('/redirect', urlController.redirect);
router.post("/get-dashboard-data", urlController.dashboardAnalytics);
router.post("/get-url-data", urlController.urlAnalytics);


module.exports = router;