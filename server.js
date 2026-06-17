const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4321;
const ROOT = "C:\\Users\\Deniz\\Documents\\赚钱-每天睡后收入\\site";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".webp": "image/webp",
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || "application/octet-stream";
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log("Server running at http://localhost:4321/");
});


