# 施小雅板材后端API服务

基于 Node.js + Express + MySQL 构建的板材行业后端API服务系统。

## 功能特性

- 🔐 **用户认证**: JWT令牌认证，支持微信小程序登录
- 📦 **产品管理**: 产品CRUD、分类管理、应用场景关联
- 💬 **询价系统**: 询价提交、状态跟踪、统计分析
- 🏆 **案例展示**: 项目案例管理、图片展示
- 📜 **认证管理**: 资质认证信息管理
- 📁 **文件上传**: 图片和文档上传管理
- 🔒 **权限控制**: 基于角色的访问控制
- 📊 **数据统计**: 业务数据统计分析

## 技术栈

- **运行环境**: Node.js 16+
- **Web框架**: Express.js
- **数据库**: MySQL 8.0+
- **ORM**: Sequelize
- **认证**: JWT + bcryptjs
- **文件上传**: Multer
- **缓存**: Redis (可选)
- **安全**: Helmet + CORS + Rate Limiting

## 快速开始

### 1. 环境准备

```bash
# 安装 Node.js 16+ 和 MySQL 8.0+
# 创建数据库
CREATE DATABASE shixiaoya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 环境配置

复制 `.env` 文件并修改配置：

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shixiaoya_db
DB_USER=root
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# 其他配置...
```

### 4. 初始化数据库

```bash
# 初始化数据库结构和基础数据
node scripts/initData.js
```

### 5. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务启动后访问：
- API服务: http://localhost:3000
- 健康检查: http://localhost:3000/health
- API文档: http://localhost:3000/api

## API接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/wechat` - 微信登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 产品相关
- `GET /api/products` - 获取产品列表
- `GET /api/products/:id` - 获取产品详情
- `GET /api/products/hot` - 获取热门产品
- `GET /api/products/new` - 获取新品
- `POST /api/products` - 创建产品 (管理员)
- `PUT /api/products/:id` - 更新产品 (管理员)
- `DELETE /api/products/:id` - 删除产品 (管理员)

### 分类相关
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/:id` - 获取分类详情
- `POST /api/categories` - 创建分类 (管理员)
- `PUT /api/categories/:id` - 更新分类 (管理员)
- `DELETE /api/categories/:id` - 删除分类 (管理员)

### 应用场景
- `GET /api/applications` - 获取应用场景列表
- `GET /api/applications/:id` - 获取应用场景详情
- `POST /api/applications` - 创建应用场景 (管理员)
- `PUT /api/applications/:id` - 更新应用场景 (管理员)
- `DELETE /api/applications/:id` - 删除应用场景 (管理员)

### 询价相关
- `POST /api/inquiries` - 提交询价
- `GET /api/inquiries/my` - 获取我的询价 (用户)
- `GET /api/inquiries` - 获取询价列表 (管理员)
- `GET /api/inquiries/:id` - 获取询价详情 (管理员)
- `PUT /api/inquiries/:id` - 更新询价 (管理员)
- `GET /api/inquiries/stats` - 获取询价统计 (管理员)

### 案例相关
- `GET /api/cases` - 获取案例列表
- `GET /api/cases/:id` - 获取案例详情
- `GET /api/cases/hot` - 获取热门案例
- `GET /api/cases/featured` - 获取精选案例
- `POST /api/cases` - 创建案例 (管理员)
- `PUT /api/cases/:id` - 更新案例 (管理员)
- `DELETE /api/cases/:id` - 删除案例 (管理员)

### 认证相关
- `GET /api/certifications` - 获取认证列表
- `GET /api/certifications/:id` - 获取认证详情
- `GET /api/certifications/by-category` - 按类别获取认证
- `POST /api/certifications` - 创建认证 (管理员)
- `PUT /api/certifications/:id` - 更新认证 (管理员)
- `DELETE /api/certifications/:id` - 删除认证 (管理员)

### 文件上传
- `POST /api/upload/single` - 单文件上传
- `POST /api/upload/multiple` - 多文件上传
- `GET /api/upload/:type` - 获取文件列表 (管理员)
- `DELETE /api/upload/:type/:filename` - 删除文件 (管理员)

## 数据库设计

### 核心表结构

- **users** - 用户表
- **products** - 产品表
- **categories** - 分类表
- **applications** - 应用场景表
- **inquiries** - 询价表
- **cases** - 案例表
- **certifications** - 认证表
- **product_applications** - 产品应用场景关联表
- **case_products** - 案例产品关联表

## 部署说明

### Docker部署

```bash
# 构建镜像
docker build -t shixiaoya-backend .

# 运行容器
docker run -d -p 3000:3000 --name shixiaoya-api shixiaoya-backend
```

### PM2部署

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name shixiaoya-api

# 查看状态
pm2 status

# 查看日志
pm2 logs shixiaoya-api
```

## 开发指南

### 添加新功能

1. 在 `models/` 目录创建数据模型
2. 在 `controllers/` 目录创建控制器
3. 在 `routes/` 目录创建路由
4. 在 `routes/index.js` 中注册路由
5. 添加相应的验证和中间件

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 RESTful API 设计原则
- 统一的错误处理和响应格式
- 完善的输入验证和安全防护

## 许可证

MIT License

## 联系方式

- 项目地址: https://github.com/jimwoocory/Shixiaoya-H5
- 技术支持: 施小雅板材技术团队