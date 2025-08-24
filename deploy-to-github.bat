@echo off
echo 正在推送代码到GitHub...
cd /d "c:\Users\Jimwoo\Documents\shixiaoya\GitHub-code"

echo 请先在GitHub创建仓库 shixiaoya-bancai，然后输入你的GitHub用户名：
set /p username="GitHub用户名: "

git remote add origin https://github.com/%username%/shixiaoya-bancai.git
git branch -M main
git push -u origin main

echo 代码推送完成！
echo 现在可以在Vercel部署了。
pause