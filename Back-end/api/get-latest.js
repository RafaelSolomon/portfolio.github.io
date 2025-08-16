// api/get-latest.js
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const { type } = req.query;

    if (!type) return res.status(400).json({ error: "Missing query parameter: type" });

    const config = {
      cv: { folder: 'Credentials', exts: ['.pdf'] },
      headshot: { folder: 'Credentials', exts: ['.png', '.jpg', '.jpeg', '.webp'] },
      video: { folder: 'Credentials', exts: ['.mp4', '.mov', '.webm'] }
    };

    if (!config[type]) return res.status(400).json({ error: "Invalid type. Use: cv | headshot | video" });

    const folderPath = path.join(process.cwd(), config[type].folder);
    if (!fs.existsSync(folderPath)) return res.status(404).json({ error: `Folder not found: ${config[type].folder}` });

    let files = fs.readdirSync(folderPath).filter(f =>
      config[type].exts.some(ext => f.toLowerCase().endsWith(ext))
    );

    if (files.length === 0) return res.status(404).json({ error: `No ${type} file found` });

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
    const filePath = path.join(folderPath, latestFile);
    const version = fs.statSync(filePath).mtime.getTime(); // Use timestamp as version
    const urlPath = `/${config[type].folder}/${latestFile}?v=${version}`; // Append version query

    return res.status(200).json({ type, latest_file: latestFile, url: urlPath });
  } catch (err) {
    console.error('get-latest error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
