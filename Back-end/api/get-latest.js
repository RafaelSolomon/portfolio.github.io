// Back-end/api/get-latest.js
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    // Basic CORS (local dev + same origin)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).end();

    const { type } = req.query || {};
    if (!type) return res.status(400).json({ error: "Type is required" });

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

    // cache-busting query param
    const fileUrl = `/Credentials/${type}/${latest.file}?v=${Math.floor(latest.time)}`;

    // modest cache for the API response, assets are static-cached on CDN
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json({
      url: fileUrl,
      latest_file: latest.file,
      updated_at: new Date(latest.time).toISOString()
    });
  } catch (err) {
    console.error("get-latest error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
