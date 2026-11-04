const fs = require("fs");
const { QUEUE_ID, SLOTS_FILE } = require("./config");

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
}

function getQueueSlotIds(series) {
    return [
        ...new Set(
            series
                .filter((entry) => entry.outage_queue_id === QUEUE_ID)
                .map((entry) => Number(entry.time_series_id)),
        ),
    ].sort((a, b) => a - b);
}

function buildSequences(series) {
    const ids = getQueueSlotIds(series);
    const sequences = [];

    let firstId = null;
    let lastId = null;

    const closeSequence = () => {
        if (firstId === null) return;

        sequences.push({
            start: formatTime((firstId - 1) * 30),
            end: formatTime(lastId * 30),
        });
    };

    for (const id of ids) {
        if (!Number.isInteger(id)) {
            throw new Error(`Invalid slot id: ${id}`);
        }

        if (firstId === null) {
            firstId = id;
        } else if (id !== lastId + 1) {
            closeSequence();
            firstId = id;
        }

        lastId = id;
    }

    closeSequence();
    return sequences;
}

function saveSchedules(schedules) {
    const formatted = schedules.map((schedule) => ({
        day: schedule.from,
        sequences: buildSequences(schedule.series),
    }));

    fs.writeFileSync(SLOTS_FILE, JSON.stringify(formatted, null, 4), "utf8");

    return formatted;
}

module.exports = { saveSchedules };
