const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const credentialsDir = path.join(process.cwd(), "Credentials"); // root folder
    const files = fs.readdirSync(credentialsDir);

    const headshotFile = files.find(f =>
      /\.(png|jpg|jpeg)$/i.test(f) && f.toLowerCase().includes("headshot")
    );

    const cvFile = files.find(f =>
      /\.pdf$/i.test(f) && f.toLowerCase().includes("cv")
    );

    const videoFile = files.find(f =>
      /\.(mp4|webm|ogg)$/i.test(f) && f.toLowerCase().includes("intro")
    );

    const headshotPath = headshotFile ? `/Credentials/${headshotFile}` : null;
    const cvPath = cvFile ? `/Credentials/${cvFile}` : null;
    const videoPath = videoFile ? `/Credentials/${videoFile}` : null;

    res.status(200).json({
      headshot: headshotPath,
      cv: cvPath,
      video: videoPath
    });
  } catch (err) {
    console.error("Error in get-latest API:", err);
    res.status(500).json({ error: "Failed to fetch latest credentials" });
  }
};
