const { QUEUE_ID } = require("./config");

const SLOT_MINUTES = 30;
const MINUTES_PER_DAY = 24 * 60;

function formatTime(minutes) {
    const wrapped = minutes % MINUTES_PER_DAY;
    const hours = Math.floor(wrapped / 60);
    const mins = wrapped % 60;

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
            start: formatTime((firstId - 1) * SLOT_MINUTES),
            end: formatTime(lastId * SLOT_MINUTES),
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

function formatSchedules(schedules) {
    return schedules.map((schedule) => ({
        day: schedule.from,
        sequences: buildSequences(schedule.series),
    }));
}

module.exports = { formatSchedules };
