require('dotenv').config();
const { sequelize, Category, Application, Product, Certification, User } = require('../models');
const bcrypt = require('bcryptjs');

// 初始化数据
const initData = async () => {
  try {
    console.log('🔄 开始初始化数据库数据...');

    // 创建管理员用户
    const adminPassword = await bcrypt.hash('admin123456', 12);
    await User.findOrCreate({
      where: { email: 'admin@shixiaoya.com' },
      defaults: {
        nickname: '系统管理员',
        email: 'admin@shixiaoya.com',
        password: adminPassword,
        userType: 'admin',
        status: 'active'
      }
    });

    // 创建产品分类
    const categories = [
      { id: 1, name: '全部产品', description: '所有产品分类', sortOrder: 100 },
      { id: 2, name: '实木颗粒板', description: '采用优质木材颗粒制成的环保板材', sortOrder: 90 },
      { id: 3, name: '多层实木板', description: '多层交错排列的实木板材', sortOrder: 80 },
      { id: 4, name: '生态板', description: '环保免漆生态板材', sortOrder: 70 },
      { id: 5, name: '饰面板', description: '表面装饰处理的板材', sortOrder: 60 },
      { id: 6, name: '定制板材', description: '根据需求定制的专业板材', sortOrder: 50 }
    ];

    for (const category of categories) {
      await Category.findOrCreate({
        where: { id: category.id },
        defaults: category
      });
    }

    // 创建应用场景
    const applications = [
      { id: 1, name: '全部场景', description: '适用于所有应用场景', sortOrder: 100 },
      { id: 2, name: '家装住宅', description: '家庭装修和住宅项目', sortOrder: 90 },
      { id: 3, name: '商业空间', description: '商场、店铺等商业场所', sortOrder: 80 },
      { id: 4, name: '办公场所', description: '办公楼、写字楼等办公环境', sortOrder: 70 },
      { id: 5, name: '酒店餐饮', description: '酒店、餐厅等服务场所', sortOrder: 60 }
    ];

    for (const application of applications) {
      await Application.findOrCreate({
        where: { id: application.id },
        defaults: application
      });
    }

    // 创建示例产品
    const products = [
      {
        name: '超E0级实木颗粒板',
        description: '采用优质木材颗粒，经高温高压制成，具有优异的物理性能和环保特性。',
        categoryId: 2,
        specifications: {
          thickness: '18mm',
          size: '2440×1220mm',
          density: '650kg/m³',
          moisture: '≤8%'
        },
        tags: ['E0环保级', '防潮防霉', '耐打耐磨'],
        price: 168.00,
        priceUnit: '张',
        rating: 4.9,
        isHot: true,
        isNew: false,
        sortOrder: 100
      },
      {
        name: '多层实木板',
        description: '精选优质木材，多层交错排列，具有良好的稳定性和承重能力。',
        categoryId: 3,
        specifications: {
          thickness: '15mm',
          size: '2440×1220mm',
          layers: '11层',
          moisture: '≤10%'
        },
        tags: ['天然木材', '层次分明', '稳定性好'],
        price: 228.00,
        priceUnit: '张',
        rating: 4.8,
        isHot: false,
        isNew: true,
        sortOrder: 90
      },
      {
        name: '免漆生态板',
        description: '表面经过特殊处理，无需油漆，花色丰富，安全方便。',
        categoryId: 4,
        specifications: {
          thickness: '17mm',
          size: '2440×1220mm',
          surface: '三聚氰胺',
          colors: '50+'
        },
        tags: ['免漆处理', '花色丰富', '即装即用'],
        price: 198.00,
        priceUnit: '张',
        rating: 4.7,
        isHot: true,
        isNew: false,
        sortOrder: 80
      }
    ];

    for (const product of products) {
      const [createdProduct] = await Product.findOrCreate({
        where: { name: product.name },
        defaults: product
      });

      // 关联应用场景
      const productApplications = await Application.findAll({
        where: { id: [2, 3, 4, 5] } // 除了"全部场景"
      });
      await createdProduct.setApplications(productApplications);
    }

    // 创建认证信息
    const certifications = [
      {
        name: 'ISO 9001质量管理体系认证',
        description: '国际标准化组织质量管理体系认证',
        issuer: '中国质量认证中心',
        certificateNumber: 'CQC-QMS-001',
        category: 'quality',
        level: 'ISO 9001:2015',
        issuedAt: new Date('2023-01-15'),
        expiresAt: new Date('2026-01-15'),
        sortOrder: 100
      },
      {
        name: 'ISO 14001环境管理体系认证',
        description: '环境管理体系国际标准认证',
        issuer: '中国环境标志认证委员会',
        certificateNumber: 'CEC-EMS-002',
        category: 'environmental',
        level: 'ISO 14001:2015',
        issuedAt: new Date('2023-03-20'),
        expiresAt: new Date('2026-03-20'),
        sortOrder: 90
      },
      {
        name: '中国环境标志产品认证',
        description: '十环认证，绿色环保产品标志',
        issuer: '环境保护部环境认证中心',
        certificateNumber: 'CEC-ENV-003',
        category: 'environmental',
        level: '十环认证',
        issuedAt: new Date('2023-05-10'),
        expiresAt: new Date('2026-05-10'),
        sortOrder: 80
      }
    ];

    for (const certification of certifications) {
      await Certification.findOrCreate({
        where: { certificateNumber: certification.certificateNumber },
        defaults: certification
      });
    }

    console.log('✅ 数据库数据初始化完成');
    console.log('📋 初始化内容:');
    console.log('   - 管理员账户: admin@shixiaoya.com / admin123456');
    console.log('   - 产品分类: 6个');
    console.log('   - 应用场景: 5个');
    console.log('   - 示例产品: 3个');
    console.log('   - 认证信息: 3个');

  } catch (error) {
    console.error('❌ 数据初始化失败:', error);
    throw error;
  }
};

// 如果直接运行此脚本
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ 数据库连接成功');
      
      await sequelize.sync({ force: false });
      console.log('✅ 数据库模型同步完成');
      
      await initData();
      
      await sequelize.close();
      console.log('🔚 数据库连接已关闭');
      process.exit(0);
    } catch (error) {
      console.error('❌ 初始化失败:', error);
      process.exit(1);
    }
  })();
}

module.exports = { initData };