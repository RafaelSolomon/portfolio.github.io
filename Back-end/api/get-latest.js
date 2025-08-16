const fs = require('fs');
const path = require('path');

const ensureFolders = () => {
  const folders = ['Credentials'];
  folders.forEach(folder => {
    const folderPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  });
};
ensureFolders();

module.exports = (req, res) => {
  try {
    const { type } = req.query;
    if (!type) return res.status(400).json({ error: "Missing type" });

    const config = {
      cv: { folder: 'Credentials', exts: ['.pdf'] },
      headshot: { folder: 'Credentials', exts: ['.png', '.jpg', '.jpeg', '.webp'] },
      video: { folder: 'Credentials', exts: ['.mp4', '.mov', '.webm'] }
    };

    if (!config[type]) return res.status(400).json({ error: "Invalid type" });

    const folderPath = path.join(process.cwd(), config[type].folder);
    if (!fs.existsSync(folderPath)) return res.status(404).json({ error: `Folder not found` });

    let files = fs.readdirSync(folderPath).filter(f =>
      config[type].exts.some(ext => f.toLowerCase().endsWith(ext))
    );

    if (!files.length) return res.status(404).json({ error: `No ${type} files found` });

    files.sort((a, b) => {
      const ta = fs.statSync(path.join(folderPath, a)).mtime.getTime();
      const tb = fs.statSync(path.join(folderPath, b)).mtime.getTime();
      return tb - ta;
    });

    const latestFile = files[0];
    const version = fs.statSync(path.join(folderPath, latestFile)).mtime.getTime();
    const url = `/${config[type].folder}/${latestFile}?v=${version}`;

    return res.status(200).json({ type, latest_file: latestFile, url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
