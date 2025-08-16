const fs = require("fs");
const path = require("path");

// Paths
const CREDENTIALS_DIR = path.join(process.cwd(), "Credentials");

// Desired filenames
const FILE_MAP = {
  "headshot": "portfolio-headshot.png",
  "cv": "cv.pdf",
  "json": "cv.json"
};

// Function to rename files if needed
function syncFile(type, desiredName) {
  const files = fs.readdirSync(CREDENTIALS_DIR);

  // Find first matching file by type keyword
  const match = files.find(f => f.toLowerCase().includes(type.toLowerCase()));
  if (!match) {
    console.warn(`No ${type} file found to sync.`);
    return;
  }

  const currentPath = path.join(CREDENTIALS_DIR, match);
  const desiredPath = path.join(CREDENTIALS_DIR, desiredName);

  if (currentPath !== desiredPath) {
    fs.renameSync(currentPath, desiredPath);
    console.log(`${type} file renamed from "${match}" to "${desiredName}"`);
  } else {
    console.log(`${type} file is already correct: "${desiredName}"`);
  }
}

// Run sync for all files
for (const [type, name] of Object.entries(FILE_MAP)) {
  syncFile(type, name);
}

console.log("Credentials sync complete.");
