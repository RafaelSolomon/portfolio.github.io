const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const type = req.query.type;
    const folder = path.join(__dirname, "../Credentials", type);
    let file = fs.readdirSync(folder).sort().pop(); // latest file
    if(!file) file = `fallback-${type}.${type==="cv"?"pdf":type==="headshot"?"png":"mp4"}`;
    const fileUrl = `/Credentials/${type}/${file}`;
    res.status(200).send(fileUrl);
  } catch(err) {
    console.error(err);
    res.status(500).send(`/Credentials/fallback-${req.query.type}.${req.query.type==="cv"?"pdf":req.query.type==="headshot"?"png":"mp4"}`);
  }
};
