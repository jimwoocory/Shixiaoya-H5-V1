const express = require('express');
const router = express.Router();

// 导入路由模块
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const applicationRoutes = require('./applicationRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const caseRoutes = require('./caseRoutes');
const certificationRoutes = require('./certificationRoutes');
const uploadRoutes = require('./uploadRoutes');
const docsRoutes = require('./docsRoutes');

// API版本信息
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '施小雅板材API服务',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      applications: '/api/applications',
      inquiries: '/api/inquiries',
      cases: '/api/cases',
      certifications: '/api/certifications',
      upload: '/api/upload',
      docs: '/api/docs'
    }
  });
});

// 注册路由
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/applications', applicationRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/cases', caseRoutes);
router.use('/certifications', certificationRoutes);
router.use('/upload', uploadRoutes);
router.use('/docs', docsRoutes);

module.exports = router;