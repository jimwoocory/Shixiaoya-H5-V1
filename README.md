# 施小雅板材 H5 应用

基于Taro框架开发的施小雅板材企业展示多端应用，支持H5、微信小程序等多平台。

## 在线预览

- GitHub Pages： https://jimwoocory.github.io/Shixiaoya-H5/

如首次访问 404，请等待 1-3 分钟或强制刷新（Ctrl+F5）。如未开启 Pages，请在仓库 Settings → Pages → 选择 "Deploy from a branch"，Branch 选 main，Folder 选 /(root)，保存。

## 项目介绍

施小雅板材H5应用是一个企业展示型多端应用，主要展示施小雅板材公司的产品、案例、认证、公司信息等内容。应用采用Taro框架开发，可同时适配H5网页和微信小程序等多个平台。

## 功能特性

- **产品展示**：支持产品分类筛选和医院分类筛选，分页展示产品信息
- **案例展示**：支持案例分类筛选，分页展示案例信息
- **认证信息**：展示企业环保认证和相关资质
- **企业介绍**：展示公司简介、发展历程等信息
- **联系方式**：提供联系表单，支持表单验证功能

## 技术栈

- Taro 3.6.15
- React
- SCSS
- JavaScript

## 项目结构

```
taro-project/
├── config/             # Taro配置文件
├── src/                # 源代码
│   ├── assets/         # 静态资源
│   ├── pages/          # 页面组件
│   │   ├── index/      # 首页
│   │   ├── products/   # 产品页
│   │   ├── cases/      # 案例页
│   │   ├── certification/ # 认证页
│   │   ├── about/      # 关于页
│   │   └── contact/    # 联系页
│   ├── app.js          # 应用入口
│   ├── app.scss        # 全局样式
│   └── app.config.js   # 应用配置
├── preview.html        # 预览页面（本地热读：10087）
├── index.html          # GitHub Pages 首页
├── 404.html            # GitHub Pages 回退
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 预览（本地）

1. 简易演示（3000）：
   ```
   node demo.js
   ```
2. 完整预览（热读 10087）：
   ```
   node preview-server-hot.js
   ```

## 开发与构建

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev:h5      # H5版本
npm run dev:weapp   # 微信小程序版本
```

### 构建生产版本
```bash
npm run build:h5    # H5版本
npm run build:weapp # 微信小程序版本
```

## 注意事项

- 项目使用 Taro 3.6.15 版本
- 微信小程序版本需要在微信开发者工具中预览
- 项目中的图片和图标资源需要自行添加到 assets 目录中