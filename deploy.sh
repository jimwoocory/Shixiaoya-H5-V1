#!/bin/bash

# 施小雅板材系统部署脚本

echo "🚀 开始部署施小雅板材系统..."

# 1. 检查Git状态
echo "📋 检查Git状态..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  发现未提交的更改，正在提交..."
    git add .
    git commit -m "部署前自动提交 - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 2. 推送到GitHub
echo "📤 推送代码到GitHub..."
git push origin main

# 3. 构建项目
echo "🔨 构建生产版本..."
npm run build

# 4. 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📊 构建统计："
    du -sh dist/
    ls -la dist/
else
    echo "❌ 构建失败！"
    exit 1
fi

# 5. 部署提示
echo ""
echo "🎉 准备完成！现在可以："
echo "1. 访问 https://vercel.com 部署项目"
echo "2. 或者运行本地预览: npm run preview"
echo ""
echo "📝 部署步骤："
echo "1. 在Vercel导入GitHub仓库"
echo "2. 配置构建命令: npm run build"
echo "3. 配置输出目录: dist"
echo "4. 添加环境变量"
echo "5. 绑定自定义域名"
echo ""
echo "🌐 你的网站将在以下地址可用："
echo "- Vercel域名: https://your-project.vercel.app"
echo "- 自定义域名: https://your-domain.com"