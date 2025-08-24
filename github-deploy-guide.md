# 🚀 施小雅板材 - GitHub + Vercel 部署方案

## 📋 部署步骤（推荐方案）

### 方案1：GitHub Desktop（最简单）

#### 1. 下载GitHub Desktop
🔗 **下载地址**：https://desktop.github.com/

#### 2. 安装并登录GitHub账号
- 安装GitHub Desktop
- 使用你的GitHub账号登录

#### 3. 创建仓库
1. 点击 "Create a New Repository on your hard drive"
2. 仓库名：`shixiaoya-bancai`
3. 本地路径：选择当前项目目录
4. 勾选 "Initialize this repository with a README"
5. 点击 "Create Repository"

#### 4. 发布到GitHub
1. 点击 "Publish repository"
2. 确保勾选 "Keep this code private" 或取消勾选设为公开
3. 点击 "Publish Repository"

### 方案2：网页上传（备用方案）

#### 1. 创建GitHub仓库
🔗 **访问**：https://github.com/new
- Repository name: `shixiaoya-bancai`
- 设为 Public
- 不要初始化 README

#### 2. 上传文件
1. 在新建的仓库页面，点击 "uploading an existing file"
2. 拖拽整个项目文件夹到页面
3. 等待上传完成
4. 填写提交信息：`施小雅板材网站初始版本`
5. 点击 "Commit changes"

## 🌐 Vercel部署

### 1. 访问Vercel
🔗 **地址**：https://vercel.com

### 2. 导入项目
1. 点击 "New Project"
2. 选择 "Import Git Repository"
3. 选择你的GitHub仓库：`jimwoocory/shixiaoya-bancai`

### 3. 部署设置
- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: 留空
- **Output Directory**: `./`
- **Install Command**: 留空

### 4. 部署
点击 "Deploy" 开始部署

## 🔧 域名配置

### 1. 在Vercel添加域名
1. 进入项目设置
2. 点击 "Domains"
3. 添加域名：
   - `shixiaoya.asia`
   - `施小雅.中国`

### 2. DNS配置
在域名注册商处添加记录：
```
类型: CNAME
名称: @
值: cname.vercel-dns.com
```

## ✅ 完成后效果
- 🌐 网站地址：https://shixiaoya.asia
- 🌐 备用地址：https://施小雅.中国
- 📱 支持手机和电脑访问
- ⚡ 全球CDN加速

## 📞 需要帮助？
如果遇到问题，请告诉我具体的错误信息！