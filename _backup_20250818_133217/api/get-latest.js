// api/get-latest.js
const fs = require("fs");
const path = require("path");

const CREDENTIALS_DIR = path.join(__dirname, "..", "Credentials");

module.exports = async (req, res) => {
  try {
    const type = req.query.type;

    let folder, exts;
    if (type === "cv") {
      folder = path.join(CREDENTIALS_DIR, "cv");
      exts = [".pdf"];
    } else if (type === "headshot") {
      folder = path.join(CREDENTIALS_DIR, "headshot");
      exts = [".png", ".jpg", ".jpeg", ".webp"];
    } else if (type === "video") {
      folder = path.join(CREDENTIALS_DIR, "video");
      exts = [".mp4", ".mov"];
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const files = fs.readdirSync(folder)
      .filter(f => exts.includes(path.extname(f).toLowerCase()));

    if (files.length === 0) {
      return res.status(404).json({ error: "No file found" });
    }

    // Get latest by modification time
    const latest = files
      .map(f => ({
        file: f,
        time: fs.statSync(path.join(folder, f)).mtimeMs
      }))
      .sort((a, b) => b.time - a.time)[0].file;

    res.json({ url: `/Credentials/${type}/${latest}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
