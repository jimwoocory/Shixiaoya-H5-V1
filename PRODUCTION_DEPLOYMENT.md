# 施小雅板材系统 - 生产环境部署指南

## 🌐 域名部署方案

### 方案选择

#### 方案一：Vercel部署（推荐）
- ✅ 免费SSL证书
- ✅ 全球CDN加速
- ✅ 自动部署
- ✅ 支持自定义域名

#### 方案二：Netlify部署
- ✅ 免费托管
- ✅ 持续集成
- ✅ 表单处理

#### 方案三：腾讯云/阿里云
- ✅ 国内访问速度快
- ✅ 完整的云服务生态

## 🚀 Vercel部署步骤（推荐）

### 1. 准备项目
```bash
# 确保项目已提交到Git
git add .
git commit -m "准备生产部署"
git push origin main
```

### 2. 配置构建脚本
更新 `package.json`：
```json
{
  "scripts": {
    "build": "taro build --type h5",
    "build:weapp": "taro build --type weapp",
    "dev": "npm run dev:h5",
    "dev:h5": "taro build --type h5 --watch",
    "start": "npm run dev"
  }
}
```

### 3. 创建Vercel配置
创建 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "https://lwfmwngjjfecrjdbyghh.supabase.co",
    "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Zm13bmdqamZlY3JqZGJ5Z2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Njc2OTYsImV4cCI6MjA3MTU0MzY5Nn0.dxgOP1c3sPh8rE0P1aaehN7ZsxyurszHZ-8GMmlgvD4"
  }
}
```

### 4. 部署到Vercel
1. 访问 https://vercel.com
2. 使用GitHub账号登录
3. 导入你的GitHub仓库
4. 配置项目设置：
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 点击Deploy

### 5. 绑定自定义域名
1. 在Vercel项目设置中找到"Domains"
2. 添加你的域名（例如：www.shixiaoya.com）
3. 按照提示配置DNS记录：
   ```
   类型: CNAME
   名称: www
   值: cname.vercel-dns.com
   ```

## 🔧 域名DNS配置

### 如果使用腾讯云域名
1. 登录腾讯云控制台
2. 进入域名管理
3. 添加解析记录：
   ```
   记录类型: CNAME
   主机记录: www
   记录值: your-project.vercel.app
   TTL: 600
   ```

### 如果使用阿里云域名
1. 登录阿里云控制台
2. 进入云解析DNS
3. 添加解析记录：
   ```
   记录类型: CNAME
   主机记录: www
   记录值: your-project.vercel.app
   TTL: 10分钟
   ```

## 📱 微信小程序部署

### 1. 配置小程序域名
在微信公众平台配置服务器域名：
```
request合法域名: https://lwfmwngjjfecrjdbyghh.supabase.co
```

### 2. 构建小程序
```bash
npm run build:weapp
```

### 3. 上传到微信开发者工具
1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. 预览和调试
4. 上传代码到微信后台

## 🌟 性能优化配置

### 1. 启用Gzip压缩
在 `vercel.json` 中添加：
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. 图片优化
使用Vercel的图片优化：
```jsx
import Image from 'next/image'

// 替换原有的Image组件
<Image 
  src="/images/product.jpg"
  alt="产品图片"
  width={300}
  height={200}
  priority
/>
```

### 3. 代码分割
在 `config/index.js` 中配置：
```js
const config = {
  // ... 其他配置
  mini: {
    webpackChain(chain) {
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      })
    }
  }
}
```

## 🔒 安全配置

### 1. 环境变量
创建 `.env.production`：
```env
VITE_SUPABASE_URL=https://lwfmwngjjfecrjdbyghh.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-domain.com/api
```

### 2. HTTPS强制跳转
在 `vercel.json` 中添加：
```json
{
  "redirects": [
    {
      "source": "http://your-domain.com/(.*)",
      "destination": "https://your-domain.com/$1",
      "permanent": true
    }
  ]
}
```

## 📊 监控和分析

### 1. 添加Google Analytics
在 `src/app.jsx` 中：
```jsx
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    // Google Analytics
    if (typeof window !== 'undefined') {
      window.gtag('config', 'GA_MEASUREMENT_ID')
    }
  }, [])
  
  return <div>...</div>
}
```

### 2. 错误监控
集成Sentry：
```bash
npm install @sentry/react
```

```jsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV
})
```

## 🚀 部署检查清单

- [ ] 代码已提交到GitHub
- [ ] 构建脚本配置正确
- [ ] Vercel项目创建成功
- [ ] 自定义域名绑定完成
- [ ] DNS解析配置正确
- [ ] SSL证书自动配置
- [ ] Supabase环境变量设置
- [ ] 性能优化配置完成
- [ ] 安全设置检查
- [ ] 监控工具集成
- [ ] 移动端适配测试
- [ ] 跨浏览器兼容性测试

## 🎯 上线后优化

### 1. SEO优化
- 添加sitemap.xml
- 配置robots.txt
- 优化页面标题和描述
- 添加结构化数据

### 2. 用户体验优化
- 添加加载动画
- 优化首屏加载时间
- 实现离线缓存
- 添加错误页面

### 3. 数据分析
- 用户行为分析
- 转化率优化
- A/B测试
- 性能监控

## 📞 技术支持

如果在部署过程中遇到问题：
1. 检查构建日志
2. 验证DNS配置
3. 确认环境变量
4. 测试API连接

部署成功后，你的网站将在以下地址访问：
- 主域名：https://your-domain.com
- Vercel域名：https://your-project.vercel.app