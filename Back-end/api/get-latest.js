import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { type } = req.query;

    // Map type to folder name
    const folderMap = {
      headshot: "headshots",
      cv: "cv",
      video: "videos"
    };

    if (!folderMap[type]) {
      return res.status(400).json({ error: "Invalid type" });
    }

    // Build folder path
    const folderPath = path.join(process.cwd(), "Credentials", folderMap[type]);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: `No folder found for ${type}` });
    }

    // Read files and sort by modified date (latest first)
    const files = fs
      .readdirSync(folderPath)
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(folderPath, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      return res.status(404).json({ error: `No files found for ${type}` });
    }

    // Build a public URL to serve the file
    const latestFile = files[0].name;
    const fileUrl = `${req.headers.origin}/Credentials/${folderMap[type]}/${latestFile}`;

    return res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
