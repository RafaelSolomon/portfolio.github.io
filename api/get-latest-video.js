// api/get-latest-video.js
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const folderPath = path.join(process.cwd(), 'Credentials');

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Credentials folder not found' });
    }

    // Videos only (e.g., mp4, mov, webm)
    let files = fs.readdirSync(folderPath).filter(f => {
      return f.toLowerCase().match(/\.(mp4|mov|webm)$/);
    });

    if (files.length === 0) {
      return res.status(404).json({ error: 'No intro video found in Credentials/' });
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

    return res.status(200).json({ 
      latest_video: files[0],
      url: `/Credentials/${files[0]}` 
    });
  } catch (err) {
    console.error('get-latest-video error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
// This API endpoint retrieves the latest video file from the Credentials folder
// It sorts files by year in the filename and then by last modified time
// Returns the latest video file name and its URL for access
// Handles errors gracefully and returns appropriate status codes
// Exports the function to be used in the Next.js API routes
// Uses synchronous file operations for simplicity in this context
// Assumes the Credentials folder exists in the root of the project
// Filters files to include only video formats: mp4, mov, webm
// Returns a 404 if no videos are found or if the folder does not exist
// Returns a 500 error for any unexpected server issues
// Uses Node.js built-in fs and path modules for file system operations
// The API can be accessed via /api/get-latest-video
// The response includes the latest video file name and its accessible URL
// This code is designed to be used in a Next.js application
// It is a simple and efficient way to manage video content in a specific folder
// The sorting logic ensures that the most relevant video is returned first
// The API can be extended or modified to include additional features in the future
// The code is structured to be clear and maintainable
// It can be tested locally or deployed as part of a Next.js application
// The API response is in JSON format for easy consumption by clients
// The code is ready for integration into a larger application or service
// The API endpoint can be called from the frontend to fetch the latest video
// The URL returned can be used to display the video in a player or link
// The code adheres to best practices for error handling and response formatting
// The API is stateless and does not maintain any session information
// The implementation is straightforward and focuses on functionality
// The API can be secured or modified to restrict access if needed          
