// src/controllers/urlController.js
const URL = require('../models/URL.model');
const logger = require('../utils/logger.utils');
const { generateShortURL } = require('../utils/urlGenerator.utils');
const { updateAnalytics } = require('../bussiness/analysisFunction');
const mongoose = require('mongoose');

const urlController = {
    checkAvailability: async (req, res) => {
        const { shortURL } = req.params;

        if (!shortURL) {
            return res.status(400).json({ error: 'Short URL is required' });
        }

        try {
            logger.info(`Checking availability for shortURL: ${shortURL}`);
            const existingURL = await URL.findOne({ shortURL });

            res.status(200).json({
                status: existingURL ? 'unavailable' : 'available'
            });
        } catch (error) {
            logger.error('Availability check error:', error);
            res.status(500).json({ error: 'Server error during availability check' });
        }
    },

    generateURL: async (req, res) => {
        const { longURL, shortURL } = req.body;

        if (!longURL) {
            return res.status(400).json({ error: 'Long URL is required' });
        }

        try {
            logger.info('Generating new short URL');
            const generatedShortURL = shortURL || generateShortURL();

            const existingURL = await URL.findOne({ shortURL: generatedShortURL });
            if (existingURL) {
                return res.status(400).json({ error: 'Short URL is already in use' });
            }

            const newURL = new URL({
                title: req.body.urlTitle || `Untitled: ${generatedShortURL}`,
                longURL,
                shortURL: generatedShortURL,
                userId: req.body.userId
            });

            await newURL.save();
            logger.info(`Created new short URL: ${generatedShortURL}`);

            res.status(201).json({
                longURL,
                shortURL: generatedShortURL
            });
        } catch (error) {
            logger.error('URL generation error:', error);
            res.status(500).json({ error: 'Failed to generate short URL' });
        }
    },

    redirect: async (req, res) => {
        const { shortURL } = req.body;

        if (!shortURL) {
            return res.status(400).json({
                redirection: false,
                longURL: null,
                error: 'Short URL is required'
            });
        }

        try {
            logger.info(`Processing redirect for shortURL: ${shortURL}`);
            const urlEntry = await URL.findOne({ shortURL });

            if (urlEntry) {

                await updateAnalytics(req, res);

                return res.status(200).json({
                    redirection: true,
                    longURL: urlEntry.longURL,
                });
            }

            return res.status(404).json({
                redirection: false,
                longURL: null,
                error: 'Short URL not found'
            });

        } catch (error) {
            logger.error('Redirection error:', error);
            res.status(500).json({
                redirection: false,
                longURL: null,
                error: 'Server error during redirection'
            });
        }
    },

    dashboardAnalytics: async (req, res) => {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        try {
            logger.info(`Fetching dashboard analytics for user: ${userId}`);

            // const allURLs = await URL.find({ userId }).sort({ `clicks.total` : -1 });
            const allURLs = await URL.find({ userId }).sort({ 'clicks.total': -1 });


            const totalShortUrls = allURLs.length;
            const totalRedirects = allURLs.reduce((acc, url) => acc + url.clicks.total, 0);

            const topUrls = allURLs.slice(0, 3).map(url => ({
                shortURL: url.shortURL,
                clicks: url.clicks.total
            }));


            const tableData = allURLs.map(url => ({
                shortURL: url.shortURL,
                longURL: url.longURL,
                title: url.title,
                createdAt: url.createdAt
            }));

            tableData.sort((a, b) => b.createdAt - a.createdAt);


            res.status(200).json({
                success: true,
                overviewData: {
                    totalShortUrls,
                    totalRedirects,
                    topUrls
                },
                tableData: tableData
            });


        } catch (error) {
            logger.error('Dashboard analytics error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch dashboard analytics' });
        }
    },

    urlAnalytics: async (req, res) => {

        const { shortURL, userId } = req.body;

        if (!shortURL) {
            return res.status(400).json({ success: false, error: 'Short URL is required' });
        }

        try {

            logger.info(`Fetching URL analytics for shortURL: ${shortURL}`);

            const urlEntry = await URL.findOne({ shortURL });

            if (!urlEntry) {
                return res.status(404).json({ success: false, error: 'Short URL not found' });
            }
            else if (urlEntry.userId.equals(userId) === false) {
                return res.status(403).json({ success: false, error: 'You are not authorized to view this URL' });
            }

            return res.status(200).json({
                success: true,
                data: urlEntry,
                message: 'URL analytics fetched successfully'
            });

        } catch (error) {
            logger.error('URL analytics error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch URL analytics' });
        }
    }


};

module.exports = urlController;