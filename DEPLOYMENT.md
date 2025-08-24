# 施小雅板材项目部署指南

## 项目概述

施小雅板材是一个基于Taro框架的多端应用，包含：
- **前端**: Taro + React (支持微信小程序、H5、支付宝小程序)
- **后端**: Node.js + Express + MySQL + Redis

## 完整项目结构

```
shixiaoya-project/
├── src/                    # 前端Taro应用
│   ├── pages/             # 页面组件
│   ├── store/             # 状态管理
│   └── app.config.js      # 应用配置
├── backend/               # 后端API服务
│   ├── controllers/       # 控制器
│   ├── models/           # 数据模型
│   ├── routes/           # 路由
│   ├── middleware/       # 中间件
│   └── scripts/          # 脚本
├── config/               # Taro配置
└── package.json          # 前端依赖
```

## 后端功能模块

### ✅ 已完成的核心功能

1. **用户认证系统**
   - JWT令牌认证
   - 用户注册/登录
   - 微信小程序登录
   - 权限控制(用户/VIP/管理员)

2. **产品管理系统**
   - 产品CRUD操作
   - 产品分类管理
   - 应用场景关联
   - 热门产品/新品标记
   - 产品搜索和筛选

3. **询价管理系统**
   - 询价提交和处理
   - 询价状态跟踪
   - 询价统计分析
   - 客户跟进管理

4. **案例展示系统**
   - 项目案例管理
   - 案例分类(住宅/商业/办公/酒店)
   - 热门案例/精选案例
   - 案例图片管理

5. **认证管理系统**
   - 资质认证信息
   - 认证分类管理
   - 认证有效期管理

6. **文件上传系统**
   - 单文件/多文件上传
   - 文件类型验证
   - 文件管理和删除

## 快速部署

### 方式一：Docker Compose (推荐)

```bash
# 1. 进入后端目录
cd backend

# 2. 启动所有服务
docker-compose up -d

# 3. 查看服务状态
docker-compose ps

# 4. 初始化数据库数据
docker-compose exec api npm run init
```

### 方式二：手动部署

#### 1. 数据库准备

```sql
-- 创建数据库
CREATE DATABASE shixiaoya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'shixiaoya'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON shixiaoya_db.* TO 'shixiaoya'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. 后端部署

```bash
# 安装依赖
cd backend
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息

# 初始化数据库
node scripts/initData.js

# 启动服务
npm run dev  # 开发模式
npm start    # 生产模式
```

#### 3. 前端部署

```bash
# 安装依赖
npm install

# 构建H5版本
npm run build:h5

# 构建微信小程序
npm run build:weapp

# 构建支付宝小程序
npm run build:alipay
```

## 环境配置

### 后端环境变量 (.env)

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shixiaoya_db
DB_USER=shixiaoya
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Redis配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379

# 微信小程序配置
WECHAT_APPID=your_wechat_appid
WECHAT_SECRET=your_wechat_secret
```

## API接口文档

### 基础信息
- **Base URL**: `http://localhost:3000/api`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

### 主要接口

#### 认证接口
```
POST /auth/register     # 用户注册
POST /auth/login        # 用户登录
POST /auth/wechat       # 微信登录
GET  /auth/profile      # 获取用户信息
PUT  /auth/profile      # 更新用户信息
```

#### 产品接口
```
GET    /products        # 获取产品列表
GET    /products/:id    # 获取产品详情
GET    /products/hot    # 获取热门产品
GET    /products/new    # 获取新品
POST   /products        # 创建产品 (管理员)
PUT    /products/:id    # 更新产品 (管理员)
DELETE /products/:id    # 删除产品 (管理员)
```

#### 询价接口
```
POST /inquiries         # 提交询价
GET  /inquiries/my      # 获取我的询价
GET  /inquiries         # 获取询价列表 (管理员)
PUT  /inquiries/:id     # 更新询价状态 (管理员)
```

## 生产环境部署

### 1. 服务器要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+
- **Node.js**: 16.x+
- **MySQL**: 8.0+
- **Redis**: 6.x+ (可选)
- **内存**: 2GB+
- **存储**: 20GB+

### 2. 域名和SSL配置

```nginx
# Nginx配置示例
server {
    listen 80;
    server_name api.shixiaoya.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.shixiaoya.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /uploads/ {
        alias /path/to/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. PM2进程管理

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name shixiaoya-api

# 设置开机自启
pm2 startup
pm2 save

# 监控
pm2 monit
```

## 数据库设计

### 核心表结构

1. **users** - 用户表
   - 支持微信登录和普通注册
   - 用户类型：普通用户/VIP/管理员

2. **products** - 产品表
   - 产品基本信息、规格参数
   - 支持多图片、标签、SEO信息

3. **categories** - 分类表
   - 支持多级分类
   - 分类图标和描述

4. **applications** - 应用场景表
   - 家装、商业、办公、酒店等场景

5. **inquiries** - 询价表
   - 询价信息、状态跟踪
   - 客户跟进记录

6. **cases** - 案例表
   - 项目案例展示
   - 施工前后对比图

7. **certifications** - 认证表
   - 资质认证信息
   - 认证有效期管理

## 安全考虑

1. **数据安全**
   - 密码bcrypt加密
   - JWT令牌认证
   - SQL注入防护

2. **接口安全**
   - 请求频率限制
   - CORS跨域配置
   - 输入数据验证

3. **文件安全**
   - 文件类型验证
   - 文件大小限制
   - 上传路径控制

## 监控和日志

1. **应用监控**
   - PM2进程监控
   - 内存和CPU使用率
   - 接口响应时间

2. **日志管理**
   - 访问日志记录
   - 错误日志收集
   - 日志轮转配置

## 备份策略

1. **数据库备份**
   ```bash
   # 每日自动备份
   mysqldump -u root -p shixiaoya_db > backup_$(date +%Y%m%d).sql
   ```

2. **文件备份**
   ```bash
   # 上传文件备份
   tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
   ```

## 性能优化

1. **数据库优化**
   - 添加适当索引
   - 查询语句优化
   - 连接池配置

2. **缓存策略**
   - Redis缓存热点数据
   - 静态文件CDN加速
   - 接口响应缓存

3. **代码优化**
   - 异步处理优化
   - 内存泄漏检查
   - 代码压缩和混淆

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务状态
   - 验证连接配置
   - 检查防火墙设置

2. **JWT令牌失效**
   - 检查JWT_SECRET配置
   - 验证令牌过期时间
   - 检查时间同步

3. **文件上传失败**
   - 检查上传目录权限
   - 验证文件大小限制
   - 检查磁盘空间

## 联系方式

- **项目地址**: https://github.com/jimwoocory/Shixiaoya-H5
- **技术支持**: 施小雅板材技术团队
- **部署支持**: 请提交Issue或联系开发团队

---

**注意**: 生产环境部署前请务必修改默认密码和密钥，确保系统安全。