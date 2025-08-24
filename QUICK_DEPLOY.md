# 🚀 施小雅板材系统 - 快速部署指南

## 立即部署（5分钟完成）

### 步骤1：准备代码
```bash
# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 步骤2：Vercel部署
1. 访问 **https://vercel.com**
2. 点击 **"New Project"**
3. 选择你的GitHub仓库
4. 配置设置：
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**

### 步骤3：绑定域名
1. 部署完成后，进入项目设置
2. 点击 **"Domains"**
3. 添加你的域名
4. 配置DNS解析：

#### 如果你的域名在腾讯云：
```
记录类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
TTL: 600秒
```

#### 如果你的域名在阿里云：
```
记录类型: CNAME
主机记录: www  
记录值: cname.vercel-dns.com
TTL: 10分钟
```

#### 如果你的域名在其他服务商：
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

## 🎯 部署完成后你将拥有：

✅ **现代化网站** - 基于Taro + Supabase  
✅ **全球CDN** - 访问速度快  
✅ **自动SSL** - HTTPS安全加密  
✅ **云端数据库** - Supabase实时数据  
✅ **移动适配** - 完美支持手机访问  
✅ **SEO优化** - 搜索引擎友好  

## 📱 微信小程序部署

如果需要发布微信小程序：

```bash
# 构建小程序版本
npm run build:weapp

# 在微信开发者工具中：
# 1. 导入项目，选择 dist 目录
# 2. 配置AppID
# 3. 预览和调试
# 4. 上传代码
```

## 🔧 常见问题

### Q: 域名解析不生效？
A: DNS解析通常需要10分钟-24小时生效，请耐心等待

### Q: 网站显示404？
A: 检查构建是否成功，确认dist目录存在

### Q: Supabase连接失败？
A: 检查环境变量配置是否正确

## 📞 需要帮助？

如果遇到问题，请提供：
1. 你的域名
2. 错误截图
3. 浏览器控制台错误信息

---

**恭喜！你的施小雅板材网站即将上线！** 🎉