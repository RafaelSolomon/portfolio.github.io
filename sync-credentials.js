// -------------------------------
// Increment version/timestamp in cv.json
// -------------------------------
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

// Update version/timestamp
const now = new Date();
jsonData.version = (jsonData.version || 0) + 1;
jsonData.lastUpdated = now.toISOString();

// Write back to cv.json
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
console.log(`cv.json updated: version ${jsonData.version}, lastUpdated ${jsonData.lastUpdated}`);
