// api/get-latest.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Query type: headshot, cv, or video
    const { type } = req.query;

    if (!type || !["headshot", "cv", "video"].includes(type)) {
      res.status(400).json({ error: "Invalid type. Must be headshot, cv, or video." });
      return;
    }

    // Absolute path to Credentials folder
    const credentialsDir = path.join(process.cwd(), "Credentials");

    // Map type to subfolder
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
                .sort((a, b) => fs.statSync(path.join(targetDir, b)).mtimeMs - fs.statSync(path.join(targetDir, a)).mtimeMs);
    } catch (err) {
      // Folder may not exist, fall back
      files = [];
    }

    // Choose latest file or fallback
    let latestFile;
    if (files.length > 0) {
      latestFile = files[0];
      latestFile = subfolder ? `${subfolder}/${latestFile}` : latestFile;
    } else {
      latestFile = fallbacks[0]; // first fallback
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ url: `/Credentials/${latestFile}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
