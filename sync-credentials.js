const fs = require("fs");
const path = require("path");

const CREDENTIALS_DIR = path.join(__dirname, "Credentials");
const jsonFilePath = path.join(CREDENTIALS_DIR, "cv.json");

// Ensure Credentials folder exists
if (!fs.existsSync(CREDENTIALS_DIR)) {
  fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
}

let jsonData = {};

// Load existing JSON safely
if (fs.existsSync(jsonFilePath)) {
  try {
    const rawData = fs.readFileSync(jsonFilePath, "utf8");
    jsonData = JSON.parse(rawData);
  } catch (err) {
    console.warn("⚠ cv.json is invalid. Keeping a backup and resetting.");
    fs.renameSync(jsonFilePath, jsonFilePath + ".bak-" + Date.now());
    jsonData = {};
  }
}

// Sync version + timestamp
jsonData.version = (typeof jsonData.version === "number" ? jsonData.version : 0) + 1;
jsonData.lastUpdated = new Date().toISOString();

// Write updated JSON
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");

console.log(`✅ cv.json updated: version ${jsonData.version}, lastUpdated ${jsonData.lastUpdated}`);
