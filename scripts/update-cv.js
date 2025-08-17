const fs = require("fs");
const path = require("path");

const CREDENTIALS_DIR = path.join(__dirname, "..", "Credentials");
const jsonFilePath = path.join(CREDENTIALS_DIR, "cv.json");

let jsonData = {};
if (fs.existsSync(jsonFilePath)) {
  try {
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
  } catch (err) {
    console.warn("cv.json is not valid JSON, resetting data.");
    jsonData = {};
  }
}

const now = new Date();
jsonData.version = (jsonData.version || 0) + 1;
jsonData.lastUpdated = now.toISOString();

// Ensure Credentials folder exists
if (!fs.existsSync(CREDENTIALS_DIR)) {
  fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
}

fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
console.log(`cv.json updated: version ${jsonData.version}, lastUpdated ${jsonData.lastUpdated}`);
