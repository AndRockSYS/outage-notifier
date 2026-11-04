const fs = require("fs");
const path = require("path");
const { ICS_FILE } = require("./config");

function readSavedIcs() {
    try {
        return fs.readFileSync(ICS_FILE, "utf8");
    } catch {
        return null;
    }
}

function saveIcs(content) {
    fs.mkdirSync(path.dirname(ICS_FILE), { recursive: true });
    fs.writeFileSync(ICS_FILE, content);
}

module.exports = { readSavedIcs, saveIcs };
