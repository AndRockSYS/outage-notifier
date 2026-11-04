const path = require("path");

const ROOT = path.join(__dirname, "..");

module.exports = {
    API_URL: process.env.API_URL,
    QUEUE_ID: 22,
    TIMEZONE: "Europe/Kyiv",

    REQUEST_TIMEOUT_MS: 15_000,
    USER_AGENT: "personal-calendar-sync/1.0",

    SLOTS_FILE: path.join(ROOT, "slots.json"),
    ICS_FILE: path.join(ROOT, "data", "outages.ics"),
};
