// api/get-latest.js
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  try {
    const { type } = req.query; // cv | video | headshot
    const folderPath = path.join(process.cwd(), "Credentials");

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: "Credentials folder not found" });
    }

    // File type rules
    const fileFilters = {
      cv: /\.(pdf)$/i,
      video: /\.(mp4|mov|avi|mkv|webm)$/i,
      headshot: /\.(png|jpg|jpeg)$/i
    };

    if (!fileFilters[type]) {
      return res.status(400).json({ error: "Invalid type. Use cv, video, or headshot." });
    }

    // Filter files by type
    let files = fs.readdirSync(folderPath).filter(f => fileFilters[type].test(f));
    if (files.length === 0) {
      return res.status(404).json({ error: `No ${type} file found in Credentials/` });
    }

    // Prefer year in filename, else fallback to modified time
    files.sort((a, b) => {
      const yearRx = /\b(19|20)\d{2}\b/;
      const ya = parseInt((a.match(yearRx) || [])[0]) || 0;
      const yb = parseInt((b.match(yearRx) || [])[0]) || 0;
      if (ya !== yb) return yb - ya;

      const ta = fs.statSync(path.join(folderPath, a)).mtime.getTime();
      const tb = fs.statSync(path.join(folderPath, b)).mtime.getTime();
      return tb - ta;
    });

    const latestFile = files[0];

    return res.status(200).json({
      type,
      latest_file: latestFile,
      url: `/Credentials/${latestFile}`
    });
  } catch (err) {
    console.error("get-latest error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
