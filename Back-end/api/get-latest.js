const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const { type } = req.query || {};
    if (!type) return res.status(400).json({ error: "Type is required" });

    // Allow only these types
    const allowed = new Set(["headshot", "cv", "video"]);
    if (!allowed.has(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const folderPath = path.join(process.cwd(), "Credentials", type);
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: `Folder not found: ${type}` });
    }

    const files = fs.readdirSync(folderPath).filter(f => !f.startsWith("."));
    if (files.length === 0) {
      return res.status(404).json({ error: `No files found for ${type}` });
    }

    const latest = files
      .map(file => ({
        file,
        time: fs.statSync(path.join(folderPath, file)).mtimeMs
      }))
      .sort((a, b) => b.time - a.time)[0];

    const fileUrl = `/Credentials/${type}/${latest.file}?v=${Math.floor(latest.time)}`;
    return res.status(200).json({ url: fileUrl, latest_file: latest.file });
  } catch (err) {
    console.error("get-latest error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
