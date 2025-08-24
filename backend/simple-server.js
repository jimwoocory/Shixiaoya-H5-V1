const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// 模拟数据
const mockData = {
  // 产品分类
  categories: [
    { id: 1, name: '全部产品', description: '所有产品分类', sortOrder: 100 },
    { id: 2, name: '实木颗粒板', description: '采用优质木材颗粒制成的环保板材', sortOrder: 90 },
    { id: 3, name: '多层实木板', description: '多层交错排列的实木板材', sortOrder: 80 },
    { id: 4, name: '生态板', description: '环保免漆生态板材', sortOrder: 70 },
    { id: 5, name: '饰面板', description: '表面装饰处理的板材', sortOrder: 60 },
    { id: 6, name: '定制板材', description: '根据需求定制的专业板材', sortOrder: 50 }
  ],

  // 应用场景
  applications: [
    { id: 1, name: '全部场景', description: '适用于所有应用场景', sortOrder: 100 },
    { id: 2, name: '家装住宅', description: '家庭装修和住宅项目', sortOrder: 90 },
    { id: 3, name: '商业空间', description: '商场、店铺等商业场所', sortOrder: 80 },
    { id: 4, name: '办公场所', description: '办公楼、写字楼等办公环境', sortOrder: 70 },
    { id: 5, name: '酒店餐饮', description: '酒店、餐厅等服务场所', sortOrder: 60 }
  ],

  // 产品数据
  products: [
    {
      id: 1,
      name: '超E0级实木颗粒板',
      description: '采用优质木材颗粒，经高温高压制成，具有优异的物理性能和环保特性。',
      categoryId: 2,
      specifications: {
        thickness: '18mm',
        size: '2440×1220mm',
        density: '650kg/m³',
        moisture: '≤8%',
        fireRating: 'B1级',
        formaldehyde: 'E0级'
      },
      applicationTypes: [2, 3, 4, 5],
      tags: ['E0环保级', '防潮防霉', '耐打耐磨'],
      price: 168.00,
      priceUnit: '张',
      rating: 4.9,
      isHot: true,
      isNew: false,
      images: ['/images/product1-1.jpg', '/images/product1-2.jpg'],
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 2,
      name: '多层实木板',
      description: '精选优质木材，多层交错排列，具有良好的稳定性和承重能力。',
      categoryId: 3,
      specifications: {
        thickness: '15mm',
        size: '2440×1220mm',
        layers: '11层',
        moisture: '≤10%',
        fireRating: 'B1级',
        surface: '天然木纹'
      },
      applicationTypes: [2, 4, 5],
      tags: ['天然木材', '层次分明', '稳定性好'],
      price: 228.00,
      priceUnit: '张',
      rating: 4.8,
      isHot: false,
      isNew: true,
      images: ['/images/product2-1.jpg', '/images/product2-2.jpg'],
      createdAt: '2024-02-10T08:00:00Z'
    },
    {
      id: 3,
      name: '免漆生态板',
      description: '表面经过特殊处理，无需油漆，花色丰富，安全方便。',
      categoryId: 4,
      specifications: {
        thickness: '17mm',
        size: '2440×1220mm',
        surface: '三聚氰胺',
        colors: '50+',
        fireRating: 'B1级',
        formaldehyde: 'E0级'
      },
      applicationTypes: [2, 3, 4],
      tags: ['免漆处理', '花色丰富', '即装即用'],
      price: 198.00,
      priceUnit: '张',
      rating: 4.7,
      isHot: true,
      isNew: false,
      images: ['/images/product3-1.jpg', '/images/product3-2.jpg'],
      createdAt: '2024-01-20T08:00:00Z'
    }
  ],

  // 案例数据
  cases: [
    {
      id: 1,
      title: '现代简约家装案例',
      description: '采用施小雅生态板打造的现代简约风格家装项目',
      category: '家装住宅',
      location: '北京朝阳区',
      area: '120㎡',
      completedAt: '2024-01-15',
      images: ['/images/case1-1.jpg', '/images/case1-2.jpg'],
      products: [1, 3],
      isHot: true,
      isFeatured: true
    },
    {
      id: 2,
      title: '商业办公空间改造',
      description: '使用多层实木板打造的现代办公环境',
      category: '办公场所',
      location: '上海浦东新区',
      area: '800㎡',
      completedAt: '2024-02-20',
      images: ['/images/case2-1.jpg', '/images/case2-2.jpg'],
      products: [2, 3],
      isHot: false,
      isFeatured: true
    }
  ],

  // 认证数据
  certifications: [
    {
      id: 1,
      name: 'ISO 9001质量管理体系认证',
      description: '国际标准化组织质量管理体系认证',
      issuer: '中国质量认证中心',
      certificateNumber: 'CQC-QMS-001',
      category: 'quality',
      level: 'ISO 9001:2015',
      issuedAt: '2023-01-15',
      expiresAt: '2026-01-15',
      image: '/images/cert1.jpg'
    },
    {
      id: 2,
      name: 'ISO 14001环境管理体系认证',
      description: '环境管理体系国际标准认证',
      issuer: '中国环境标志认证委员会',
      certificateNumber: 'CEC-EMS-002',
      category: 'environmental',
      level: 'ISO 14001:2015',
      issuedAt: '2023-03-20',
      expiresAt: '2026-03-20',
      image: '/images/cert2.jpg'
    }
  ],

  // 询价数据
  inquiries: [
    {
      id: 1,
      customerName: '张先生',
      phone: '138****8888',
      email: 'zhang@example.com',
      productIds: [1, 3],
      quantity: '100张',
      requirements: '需要E0级环保板材，用于家装项目',
      status: 'pending',
      createdAt: '2024-08-20T10:30:00Z'
    }
  ]
};

// 用户数据
const users = [
  {
    id: 1,
    email: 'admin@shixiaoya.com',
    password: 'admin123456', // 实际应用中应该加密
    nickname: '系统管理员',
    userType: 'admin',
    status: 'active'
  }
];

// API路由

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '施小雅板材API服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 首页
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用施小雅板材API服务',
    endpoints: {
      health: '/health',
      products: '/api/products',
      categories: '/api/categories',
      applications: '/api/applications',
      cases: '/api/cases',
      certifications: '/api/certifications',
      auth: '/api/auth/login'
    }
  });
});

// 用户认证
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          userType: user.userType
        },
        token: 'mock_jwt_token_' + Date.now()
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '邮箱或密码错误'
    });
  }
});

// 获取产品列表
app.get('/api/products', (req, res) => {
  const { category, application, hot, new: isNew, page = 1, limit = 10 } = req.query;
  
  let filteredProducts = [...mockData.products];
  
  // 按分类筛选
  if (category && category !== '1') {
    filteredProducts = filteredProducts.filter(p => p.categoryId == category);
  }
  
  // 按应用场景筛选
  if (application && application !== '1') {
    filteredProducts = filteredProducts.filter(p => 
      p.applicationTypes.includes(parseInt(application))
    );
  }
  
  // 热门产品筛选
  if (hot === 'true') {
    filteredProducts = filteredProducts.filter(p => p.isHot);
  }
  
  // 新品筛选
  if (isNew === 'true') {
    filteredProducts = filteredProducts.filter(p => p.isNew);
  }
  
  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    }
  });
});

// 获取产品详情
app.get('/api/products/:id', (req, res) => {
  const product = mockData.products.find(p => p.id == req.params.id);
  
  if (product) {
    res.json({
      success: true,
      data: { product }
    });
  } else {
    res.status(404).json({
      success: false,
      message: '产品不存在'
    });
  }
});

// 获取热门产品
app.get('/api/products/hot', (req, res) => {
  const hotProducts = mockData.products.filter(p => p.isHot);
  res.json({
    success: true,
    data: { products: hotProducts }
  });
});

// 获取新品
app.get('/api/products/new', (req, res) => {
  const newProducts = mockData.products.filter(p => p.isNew);
  res.json({
    success: true,
    data: { products: newProducts }
  });
});

// 获取分类列表
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: { categories: mockData.categories }
  });
});

// 获取应用场景列表
app.get('/api/applications', (req, res) => {
  res.json({
    success: true,
    data: { applications: mockData.applications }
  });
});

// 获取案例列表
app.get('/api/cases', (req, res) => {
  const { category, hot, featured, page = 1, limit = 10 } = req.query;
  
  let filteredCases = [...mockData.cases];
  
  if (category) {
    filteredCases = filteredCases.filter(c => c.category === category);
  }
  
  if (hot === 'true') {
    filteredCases = filteredCases.filter(c => c.isHot);
  }
  
  if (featured === 'true') {
    filteredCases = filteredCases.filter(c => c.isFeatured);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedCases = filteredCases.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      cases: paginatedCases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredCases.length,
        totalPages: Math.ceil(filteredCases.length / limit)
      }
    }
  });
});

// 获取认证列表
app.get('/api/certifications', (req, res) => {
  const { category } = req.query;
  
  let filteredCerts = [...mockData.certifications];
  
  if (category) {
    filteredCerts = filteredCerts.filter(c => c.category === category);
  }
  
  res.json({
    success: true,
    data: { certifications: filteredCerts }
  });
});

// 提交询价
app.post('/api/inquiries', (req, res) => {
  const { customerName, phone, email, productIds, quantity, requirements } = req.body;
  
  const newInquiry = {
    id: mockData.inquiries.length + 1,
    customerName,
    phone,
    email,
    productIds,
    quantity,
    requirements,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockData.inquiries.push(newInquiry);
  
  res.json({
    success: true,
    message: '询价提交成功，我们会尽快联系您',
    data: { inquiry: newInquiry }
  });
});

// 获取询价列表（管理员）
app.get('/api/inquiries', (req, res) => {
  res.json({
    success: true,
    data: { inquiries: mockData.inquiries }
  });
});

// 统计接口
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      products: mockData.products.length,
      categories: mockData.categories.length,
      applications: mockData.applications.length,
      cases: mockData.cases.length,
      certifications: mockData.certifications.length,
      inquiries: mockData.inquiries.length,
      hotProducts: mockData.products.filter(p => p.isHot).length,
      newProducts: mockData.products.filter(p => p.isNew).length
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 施小雅板材API服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`📋 API接口:`);
  console.log(`   GET  /api/products - 获取产品列表`);
  console.log(`   GET  /api/categories - 获取分类列表`);
  console.log(`   GET  /api/applications - 获取应用场景`);
  console.log(`   GET  /api/cases - 获取案例列表`);
  console.log(`   GET  /api/certifications - 获取认证信息`);
  console.log(`   POST /api/auth/login - 用户登录`);
  console.log(`   POST /api/inquiries - 提交询价`);
  console.log(`   GET  /api/stats - 获取统计数据`);
  console.log(`\n🔐 测试账户: admin@shixiaoya.com / admin123456`);
});