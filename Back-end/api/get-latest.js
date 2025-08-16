const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const credentialsDir = path.join(__dirname, "../../Credentials");
    const files = fs.readdirSync(credentialsDir);

    const headshotFile = files.find(f =>
      /\.(png|jpg|jpeg)$/i.test(f) && f.toLowerCase().includes("headshot")
    );

    const cvFile = files.find(f =>
      /\.pdf$/i.test(f) && f.toLowerCase().includes("cv")
    );

    const headshotPath = headshotFile ? `/Credentials/${headshotFile}` : null;
    const cvPath = cvFile ? `/Credentials/${cvFile}` : null;

    res.status(200).json({
      headshot: headshotPath,
      cv: cvPath
    });
  } catch (err) {
    console.error("Error in get-latest API:", err);
    res.status(500).json({ error: "Failed to fetch latest credentials" });
  }
};
