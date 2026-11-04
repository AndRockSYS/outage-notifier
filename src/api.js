const { API_URL, REQUEST_TIMEOUT_MS, USER_AGENT } = require("./config");

async function fetchSchedules() {
    if (!API_URL) throw new Error("API_URL is not set");

    const response = await fetch(API_URL, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    var data = await response.json();
    validateSchedules(data);

    return data;
}

function validateSchedules(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Response is not a non-empty array");
    }

    for (const schedule of data) {
        const isValid =
            typeof schedule.from === "string" && Array.isArray(schedule.series);
        if (!isValid) throw new Error("Unexpected schedule shape");
    }
}

module.exports = { fetchSchedules };
