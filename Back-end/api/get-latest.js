// get-latest.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { type } = req.query;
    if (!type) return res.status(400).json({ error: "Type is required" });

    const folderPath = path.join(process.cwd(), "Credentials", type);
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const files = fs.readdirSync(folderPath).filter(f => !f.startsWith("."));
    if (files.length === 0) {
      return res.status(404).json({ error: "No files found" });
    }

    // Sort by modified time
    const latestFile = files
      .map(file => ({
        file,
        time: fs.statSync(path.join(folderPath, file)).mtime
      }))
      .sort((a, b) => b.time - a.time)[0].file;

    const fileUrl = `/Credentials/${type}/${latestFile}`;
    return res.status(200).json({ url: fileUrl, latest_file: latestFile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
