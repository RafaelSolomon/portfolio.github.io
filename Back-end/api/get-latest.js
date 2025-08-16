const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  try {
    // Root path to Credentials folder relative to this file
    const credentialsPath = path.join(process.cwd(), "Credentials");

    // Headshot
    const headshotFile = fs.existsSync(path.join(credentialsPath, "portfolio-headshot.png"))
      ? "/Credentials/portfolio-headshot.png"
      : null;

    // CV
    const cvFile = fs.existsSync(path.join(credentialsPath, "cv.pdf"))
      ? "/Credentials/cv.pdf"
      : null;

    // JSON (optional)
    const jsonFilePath = path.join(credentialsPath, "cv.json");
    let cvJson = null;
    if (fs.existsSync(jsonFilePath)) {
      const jsonData = fs.readFileSync(jsonFilePath, "utf8");
      try {
        cvJson = JSON.parse(jsonData);
      } catch (err) {
        console.warn("cv.json is not valid JSON:", err);
      }
    }

    // Response object
    const data = {
      headshot: headshotFile,
      cv: cvFile,
      json: cvJson
    };

    res.status(200).json(data);

  } catch (error) {
    console.error("Error in get-latest.js:", error);
    res.status(500).json({ error: "Server error fetching latest files" });
  }
}
