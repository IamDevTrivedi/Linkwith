const logger = require("../utils/logger.utils");
const URL = require('../models/URL.model');

// Utility function to get the current hour (0-23)
function getHour() {
    const now = new Date();
    return now.getHours();
}

// Determine the browser name from the user-agent string
function getBrowserName(req) {
    const userAgent = req.headers['user-agent'];

    if (userAgent.includes('Firefox/')) return 'firefox';
    if (userAgent.includes('Edge/') || userAgent.includes('Edg/')) return 'edge';
    if (userAgent.includes('Chrome/')) return 'chrome';
    if (userAgent.includes('Safari/')) return 'safari';
    return 'other';
}

// Check if the user is on a mobile device
function detectMobile(userAgent) {
    if (!userAgent) return false;
    const mobileKeywords = ['Mobile', 'Android', 'iPhone', 'webOS', 'BlackBerry', 'Windows Phone'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) && !detectTablet(userAgent);
}

// Check if the user is on a tablet
function detectTablet(userAgent) {
    if (!userAgent) return false;
    const tabletKeywords = ['iPad', 'Android(?!.*Mobile)', 'Tablet'];
    return tabletKeywords.some(keyword => new RegExp(keyword, 'i').test(userAgent));
}

// Determine the device type (desktop, mobile, tablet) from the user-agent string
function getDeviceType(req) {
    const userAgent = req.headers['user-agent'];
    if (detectTablet(userAgent)) return "tablet";
    if (detectMobile(userAgent)) return "mobile";
    return "desktop";
}

// Fetch the user's country based on their IP address
async function getCountry() {
    const ipResponse = await fetch("https://api.ipify.org/?format=json");
    const ipData = await ipResponse.json();
    const geoResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
    const geoData = await geoResponse.json();
    return geoData.country;
}

// Fetch the user's IP address
async function getIP() {
    const ipResponse = await fetch("https://api.ipify.org/?format=json");
    const ipData = await ipResponse.json();
    return ipData.ip;
}

// Get today's date in a readable format
function getToday() {
    return new Date().toLocaleDateString(undefined, {
        weekday: "long",
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

// Update analytics for a given short URL
async function updateAnalytics(req, res) {
    const { shortURL } = req.body;

    // Validate the shortURL input
    if (!shortURL) {
        return false;
    }

    try {
        logger.info(`Updating analytics for shortURL: ${shortURL}`);

        // Fetch the URL entry from the database
        const urlEntry = await URL.findOne({ shortURL });
        if (!urlEntry) return false;

        // Increment total clicks
        urlEntry.clicks.total += 1;

        // Check for unique clicks using the user's IP address
        const IP = await getIP();
        const IParray = urlEntry.visitedIP;
        let isUniqueVisitor = !IParray.includes(IP);

        if (isUniqueVisitor) {
            urlEntry.clicks.unique += 1;
            urlEntry.visitedIP.push(IP);
        }

        // Update hourly click analytics
        const hour = getHour();
        urlEntry.analytics.hourlyClicks[hour].clicks += 1;

        // Update browser analytics
        const browserName = getBrowserName(req);
        urlEntry.analytics.browsers[browserName] += 1;

        // Update device analytics
        const device = getDeviceType(req);
        urlEntry.analytics.devices[device] += 1;

        // Update geographical analytics
        const country = await getCountry();
        const geography = urlEntry.analytics.geography;
        let countryEntry = geography.find(entry => entry.country === country);

        if (countryEntry) {
            countryEntry.clicks += 1;
        } else {
            geography.push({ country: country, clicks: 1 });
        }

        // Update daily click analytics
        const today = getToday();
        const dailyClicks = urlEntry.analytics.dailyClicks;
        const lastEntry = dailyClicks[dailyClicks.length - 1];

        if (lastEntry && lastEntry.date === today) {
            lastEntry.totalClicks += 1;
            lastEntry.uniqueClicks += isUniqueVisitor ? 1 : 0;
        } else {
            dailyClicks.push({
                date: today,
                totalClicks: 1,
                uniqueClicks: 1
            });
        }

        // Save the updated URL entry
        await urlEntry.save();
        logger.info('Analytics updated');

        return true;
    } catch (error) {
        logger.error('Clicks update error:', error);
    }
}

module.exports = { updateAnalytics };