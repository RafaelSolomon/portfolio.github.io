const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method === "OPTIONS") return res.status(204).end();

  const type = req.query?.type;
  if(!type) return res.status(400).json({ error: "Type is required" });
  if(!['headshot','cv','video'].includes(type)) return res.status(400).json({ error: "Invalid type" });

  const folderPath = path.join(process.cwd(),'Credentials',type);
  if(!fs.existsSync(folderPath)) return res.status(404).json({ error: `Folder not found: ${type}` });

  const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
  if(!files.length) return res.status(404).json({ error: `No files found for ${type}` });

  const latest = files.map(f=>({
    file: f,
    time: fs.statSync(path.join(folderPath,f)).mtimeMs
  })).sort((a,b)=>b.time-a.time)[0];

  const url = `/Credentials/${type}/${latest.file}?v=${Math.floor(latest.time)}`;

  res.setHeader("Cache-Control","s-maxage=60, stale-while-revalidate=300");
  res.status(200).json({ url, latest_file: latest.file, updated_at: new Date(latest.time).toISOString() });
};
