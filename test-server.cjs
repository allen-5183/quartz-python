const http = require('http');

function testUrl(urlPath, callback) {
  const req = http.get(`http://localhost:8080${urlPath}`, (res) => {
    callback(null, res.statusCode, res.headers.location);
  });
  req.on('error', callback);
}

// Test the folder URLs
const tests = [
  '/0.-%E8%87%AA%E5%8B%95%E5%8C%96/',
  '/1.-python-%E7%92%B0%E5%A2%83%E8%A8%AD%E7%BD%AE/',
  '/4.-%E9%81%B8%E6%93%87%E7%B5%90%E6%A7%8B/',
  '/5.-%E9%87%8D%E8%A4%87%E7%B5%90%E6%A7%8B/',
  '/',
];

let pending = tests.length;
tests.forEach(url => {
  testUrl(url, (err, status, location) => {
    if (err) {
      console.log(`${url} => ERROR: ${err.message}`);
    } else {
      console.log(`${url} => ${status}${location ? ' -> ' + location : ''}`);
    }
    pending--;
    if (pending === 0) process.exit(0);
  });
});

setTimeout(() => {
  console.log('Timeout!');
  process.exit(1);
}, 10000);
