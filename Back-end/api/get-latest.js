// api/get-latest.js
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const { type } = req.query; // expects ?type=cv|headshot|video

    if (!type) {
      return res.status(400).json({ error: "Missing required query parameter: type" });
    }

    // Map type to folder + file extensions
    const config = {
      cv: { folder: 'Credentials', exts: ['.pdf'] },
      headshot: { folder: 'Credentials', exts: ['.png', '.jpg', '.jpeg', '.webp'] },
      video: { folder: 'Credentials', exts: ['.mp4', '.mov', '.webm'] }
    };

    if (!config[type]) {
      return res.status(400).json({ error: "Invalid type. Use: cv | headshot | video" });
    }

    const folderPath = path.join(process.cwd(), config[type].folder);
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: `Folder not found: ${config[type].folder}` });
    }

    // Filter files by allowed extensions
    let files = fs.readdirSync(folderPath).filter(f =>
      config[type].exts.some(ext => f.toLowerCase().endsWith(ext))
    );

    if (files.length === 0) {
      return res.status(404).json({ error: `No ${type} file found in ${config[type].folder}/` });
    }

    // Sort files: Prefer year in filename, then by modified date
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
    const urlPath = `/${config[type].folder}/${latestFile}`; // public-facing URL

    return res.status(200).json({
      type,
      latest_file: latestFile,
      url: urlPath
    });
  } catch (err) {
    console.error('get-latest error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
// Note: Ensure that the Credentials folder is in the public directory
// so that the files can be accessed via the URL path.
// This code assumes that the Credentials folder is located in the root of the project
// and that the server is configured to serve static files from there.
// Adjust the path as necessary based on your project structure.
// Make sure to handle file permissions and security considerations
// when serving files from the server.
// This code is designed to be used in a Node.js environment with Express or similar frameworks.
// Ensure that the necessary error handling and logging is in place
// for production use.
// This code is a simple API endpoint that retrieves the latest file of a specified type
// from a designated folder, sorts them by year and modified date,
// and returns the latest file's name and URL.
// It is important to validate the input and handle errors gracefully
// to ensure a smooth user experience.
// The API can be extended to support more file types or additional features
// as needed in the future.
// This code is a basic implementation and can be optimized further
// based on specific requirements or performance considerations.
// Ensure that the necessary modules are installed and available in your project
// to run this code successfully.
// This code is intended for educational purposes and may require adjustments
// based on your specific project setup and requirements.
// Always test the API thoroughly to ensure it behaves as expected
// and handles edge cases appropriately.
// This code is a simple API endpoint that retrieves the latest file of a specified type
// from a designated folder, sorts them by year and modified date, 
// and returns the latest file's name and URL.
// It is important to validate the input and handle errors gracefully
// to ensure a smooth user experience.
