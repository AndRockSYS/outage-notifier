const { TIMEZONE } = require("./config");

function toLocalDate(iso) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(
        new Date(iso),
    );
}

function addOneDay(dateStr) {
    const date = new Date(`${dateStr}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
}

function toIcsDateTime(dateStr, time) {
    return `${dateStr.replace(/-/g, "")}T${time.replace(/:/g, "")}`;
}

function buildEvent(date, sequence) {
    const endDate = sequence.end <= sequence.start ? addOneDay(date) : date;

    return [
        "BEGIN:VEVENT",
        `UID:${date}-${sequence.start.replace(/:/g, "")}@outage-sync`,
        `DTSTAMP:${date.replace(/-/g, "")}T000000Z`,
        `DTSTART;TZID=${TIMEZONE}:${toIcsDateTime(date, sequence.start)}`,
        `DTEND;TZID=${TIMEZONE}:${toIcsDateTime(endDate, sequence.end)}`,
        "SUMMARY:Power outage",
        "END:VEVENT",
    ];
}

function buildIcs(schedules) {
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//outage-sync//EN",
        "CALSCALE:GREGORIAN",
        "X-WR-CALNAME:Power outages",
        `X-WR-TIMEZONE:${TIMEZONE}`,
    ];

    for (const { day, sequences } of schedules) {
        const date = toLocalDate(day);
        for (const sequence of sequences) {
            lines.push(...buildEvent(date, sequence));
        }
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n") + "\r\n";
}

module.exports = { buildIcs };
