// src/utils/urlGenerator.js
const generateShortURL = () => {
    return Math.random().toString(36).substring(2, 8);
};

module.exports = {
    generateShortURL
};