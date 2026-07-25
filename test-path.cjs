const path = require('path');
const url = require('url');
const fs = require('fs');

const cwd = 'C:\\cloud\\project\\quartz-python';
const publicDir = 'public';
const current = path.resolve(cwd, publicDir);

// Simulate what serve-handler does
const requestUrl = '/0.-%E8%87%AA%E5%8B%95%E5%8C%96/';
let relativePath = decodeURIComponent(url.parse(requestUrl).pathname);
let absolutePath = path.join(current, relativePath);

console.log('relativePath:', relativePath);
console.log('absolutePath:', absolutePath);

// Test lstat
try {
  const stats = fs.lstatSync(absolutePath);
  console.log('lstat success:', stats.isDirectory());
} catch(err) {
  console.log('lstat error:', err.code, err.message);
}

// Now test with posix path
const absolutePathPosix = path.posix.join(current.replace(/\\/g, '/'), relativePath);
console.log('absolutePathPosix:', absolutePathPosix);
try {
  const stats = fs.lstatSync(absolutePathPosix);
  console.log('lstat posix success:', stats.isDirectory());
} catch(err) {
  console.log('lstat posix error:', err.code, err.message);
}
