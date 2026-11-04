const { fetchSchedules } = require("./api");
const { formatSchedules } = require("./schedule");
const { buildIcs } = require("./ics");
const { readSavedIcs, saveIcs } = require("./storage");

async function main() {
    const raw = await fetchSchedules();

    const schedules = formatSchedules(raw);
    const nextIcs = buildIcs(schedules);

    if (readSavedIcs() === nextIcs) {
        console.log("No changes.");
        return;
    }

    saveIcs(nextIcs);
    console.log("Schedule changed, calendar updated.");
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
