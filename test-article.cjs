const path = require('path');
const url = require('url');
const fs = require('fs');
const http = require('http');

const cwd = 'C:\\cloud\\project\\quartz-python';
const publicDir = 'public';
const current = path.resolve(cwd, publicDir);

const requestUrl = '/0.-%E8%87%AA%E5%8B%95%E5%8C%96/1.-%E5%9C%A8-visual-studio-code-ide-%E8%87%AA%E5%8B%95%E9%96%8B%E5%95%9F%E5%B0%88%E6%A1%88%E7%92%B0%E5%A2%83%E8%A8%AD%E7%BD%AE';

// Local path check test (same as handlers.js logic)
let fp = requestUrl.split("?")[0] ?? "/";
let fpDecoded;
try {
  fpDecoded = decodeURIComponent(fp);
} catch {
  fpDecoded = fp;
}

console.log('fpDecoded:', fpDecoded);

let base = fpDecoded;
if (path.extname(base) === "") {
  base += ".html";
}
console.log('base:', base);

const fullPath = path.posix.join(current.replace(/\\/g, '/'), base);
console.log('fullPath:', fullPath);
console.log('exists:', fs.existsSync(fullPath));

// HTTP Test
const req = http.get(`http://localhost:8080${requestUrl}`, (res) => {
  console.log(`HTTP GET ${requestUrl} => ${res.statusCode} ${res.headers.location || ''}`);
  process.exit(0);
});
req.on('error', (err) => {
  console.log('HTTP Error:', err.message);
  process.exit(1);
});
