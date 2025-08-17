// scripts/update-cv.js
const fs = require("fs");
const path = require("path");

const CREDENTIALS_DIR = path.join(__dirname, "..", "Credentials");
const jsonFilePath = path.join(CREDENTIALS_DIR, "cv.json");

// Ensure Credentials exists
if (!fs.existsSync(CREDENTIALS_DIR)) {
  fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
}

let jsonData = {};
if (fs.existsSync(jsonFilePath)) {
  try {
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
  } catch (err) {
    console.warn("⚠ cv.json invalid, backing up.");
    fs.renameSync(jsonFilePath, jsonFilePath + ".bak-" + Date.now());
    jsonData = {};
  }
}

// Sync version + timestamp
jsonData.version = (typeof jsonData.version === "number" ? jsonData.version : 0) + 1;
jsonData.lastUpdated = new Date().toISOString();

fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");

console.log(`✅ cv.json updated → version ${jsonData.version}, lastUpdated ${jsonData.lastUpdated}`);
