const logger = {
    info: (message, metadata) => console.log(`[INFO] ${message}`, metadata || ""),
    error: (message, metadata) => console.error(`[ERROR] ${message}`, metadata || ""),
    debug: (message, metadata) => console.debug(`[DEBUG] ${message}`, metadata || ""),
    warn: (message, metadata) => console.warn(`[WARN] ${message}`, metadata || "")
};

module.exports = logger;
