const http = require('http');
const fs = require('fs');
const path = require('path');

// 读取预览HTML文件
const previewHtml = fs.readFileSync(path.join(__dirname, 'preview.html'), 'utf8');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  // 返回预览页面
  res.end(previewHtml);
});

// 监听端口
const port = 10086;
server.listen(port, () => {
  console.log(`施小雅板材应用预览页面运行在 http://localhost:${port}`);
});