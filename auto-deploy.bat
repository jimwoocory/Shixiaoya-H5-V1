@echo off
echo ========================================
echo    施小雅板材 - 自动部署脚本
echo ========================================
echo.

echo 正在准备部署文件...
cd /d "c:\Users\Jimwoo\Documents\shixiaoya\GitHub-code"

echo 正在打开Netlify部署页面...
start https://app.netlify.com/drop

echo 正在打开项目文件夹...
start .

echo.
echo ========================================
echo 📋 接下来请手动完成以下步骤：
echo ========================================
echo 1. 在打开的Netlify页面中等待加载完成
echo 2. 从打开的文件夹中选择整个项目文件夹
echo 3. 拖拽到Netlify Drop页面
echo 4. 等待上传完成（约2-3分钟）
echo 5. 获得临时域名后，添加自定义域名：
echo    - shixiaoya.asia
echo    - 施小雅.中国
echo ========================================
echo.
echo 部署完成后，你的网站将在以下域名可访问：
echo https://shixiaoya.asia
echo https://施小雅.中国
echo.
pause