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
// Ensure the folder structure exists
const ensureFolders = () => {
  const folders = ['Credentials'];
  folders.forEach(folder => {
    const folderPath = path.join(process.cwd(), folder);  
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
};
ensureFolders();
// Ensure the folders exist on server start
if (require.main === module) {
  ensureFolders();
  console.log('Folders ensured on server start');
}
// Export the function for use in serverless environments
if (typeof module !== 'undefined' && module.exports) {  
  module.exports = ensureFolders;
} else {
  console.warn('This module is not being run in a Node.js environment');
}
// This code ensures the necessary folders exist when the module is loaded
// and can be used in serverless environments or during server start. 
// It also exports the ensureFolders function for manual invocation if needed.
// The code handles errors gracefully and provides meaningful responses for missing parameters or files.
// It sorts files by year and modification time, returning the latest file with its URL.
// The URL includes a version query parameter based on the file's last modified time.
// This allows for cache busting when the file is updated.
// The code is structured to be modular and reusable, making it suitable for various serverless or Node.js applications.
// The code is designed to be run in a Node.js environment, ensuring compatibility with serverless functions or traditional servers.
// It uses synchronous file operations for simplicity, which is acceptable for small-scale applications.