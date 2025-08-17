// live-server.config.js
module.exports = {
  port: 3000,
  host: "0.0.0.0",
  root: "./", // serve from repo root
  open: "index.html", // auto-open index
  file: "index.html",
  wait: 500,
  logLevel: 2,
  watch: [
    "index.html",
    "styles.css",
    "scripts.js",
    "Credentials/*"
  ],
};
