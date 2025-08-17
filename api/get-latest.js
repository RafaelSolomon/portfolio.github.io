// api/get-latest.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { type } = req.query;

    if (!type || !["headshot", "cv", "video"].includes(type)) {
      res.status(400).json({ error: "Invalid type. Must be headshot, cv, or video." });
      return;
    }

    const credentialsDir = path.join(process.cwd(), "Credentials");

    const typeMap = {
      headshot: ["headshot", "fallback-headshot.png", "fallback-headshot.webp"],
      cv: ["cv", "fallback-cv.pdf"],
      video: ["video", "fallback-video.mp4"]
    };

    const [subfolder, ...fallbacks] = typeMap[type];
    const targetDir = path.join(credentialsDir, subfolder || "");

    let files = [];
    try {
      files = fs.readdirSync(targetDir)
        .filter(f => !f.startsWith("."))
        .sort(
          (a, b) =>
            fs.statSync(path.join(targetDir, b)).mtimeMs -
            fs.statSync(path.join(targetDir, a)).mtimeMs
        );
    } catch {
      files = [];
    }

    const latestFile = files.length > 0 ? `${subfolder}/${files[0]}` : fallbacks[0];

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ url: `/Credentials/${latestFile}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
