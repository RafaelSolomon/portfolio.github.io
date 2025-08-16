// api/get-latest-cv.js
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const folderName = 'Credentials';
    const folderPath = path.join(process.cwd(), folderName);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Credentials folder not found' });
    }

    // PDFs only
    let files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.pdf'));
    if (files.length === 0) {
      return res.status(404).json({ error: 'No CV PDF found in Credentials/' });
    }

    // Prefer by YEAR in filename, then by modified time
    files.sort((a, b) => {
      const yearRx = /\b(19|20)\d{2}\b/;
      const ya = parseInt((a.match(yearRx) || [])[0]) || 0;
      const yb = parseInt((b.match(yearRx) || [])[0]) || 0;
      if (ya !== yb) return yb - ya; // newer year first

      const ta = fs.statSync(path.join(folderPath, a)).mtime.getTime();
      const tb = fs.statSync(path.join(folderPath, b)).mtime.getTime();
      return tb - ta; // newer mtime first
    });

    const latest = files[0];

    // Construct a URL relative to site root (so Vercel serves it statically)
    const url = `/${folderName}/${encodeURIComponent(latest)}`;

    return res.status(200).json({ latest_cv: latest, url });
  } catch (err) {
    console.error('get-latest-cv error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
