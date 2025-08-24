# 施小雅板材 - 快速域名部署指南

## 🎯 推荐方案：直接部署完整HTML

### 1. 创建GitHub仓库
- 访问：https://github.com/new
- 仓库名：`shixiaoya-bancai`
- 设为Public
- 不要初始化README

### 2. 推送代码
```bash
# 在当前目录执行
git remote add origin https://github.com/你的用户名/shixiaoya-bancai.git
git branch -M main
git push -u origin main
```

### 3. Vercel部署
1. 访问：https://vercel.com
2. 点击"New Project"
3. 导入GitHub仓库：`shixiaoya-bancai`
4. 部署设置：
   - Framework: Other
   - Root Directory: `./`
   - Build Command: 留空
   - Output Directory: `./`

### 4. 配置域名
在Vercel项目设置 > Domains 添加：
- `shixiaoya.asia`
- `施小雅.中国`

### 5. DNS设置
在域名注册商处添加CNAME记录：
- `shixiaoya.asia` → `cname.vercel-dns.com`
- `施小雅.中国` → `cname.vercel-dns.com`

## 🔧 备用方案：Taro版本部署

如需使用Taro构建版本，修改Vercel设置：
- Build Command: `npm run build:h5`
- Output Directory: `dist`

## 📞 联系支持
如遇问题，请提供具体错误信息。