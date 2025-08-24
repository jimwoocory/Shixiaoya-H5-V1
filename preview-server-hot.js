const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'preview.html');

const server = http.createServer((req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end('读取预览文件出错：' + err.message);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

const port = 10087;
server.listen(port, () => {
  console.log(`施小雅板材预览(热读)运行在 http://localhost:${port}`);
  console.log('提示：每次刷新都会读取最新的 preview.html');
});