const { Sequelize } = require('sequelize');

// 数据库连接配置
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00'
  }
);

// 导入模型
const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const Category = require('./Category')(sequelize);
const Application = require('./Application')(sequelize);
const Inquiry = require('./Inquiry')(sequelize);
const Case = require('./Case')(sequelize);
const Certification = require('./Certification')(sequelize);

// 定义关联关系
// 产品与分类的关系
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

// 产品与应用场景的多对多关系
Product.belongsToMany(Application, { 
  through: 'ProductApplications', 
  foreignKey: 'productId',
  otherKey: 'applicationId',
  as: 'applications'
});
Application.belongsToMany(Product, { 
  through: 'ProductApplications', 
  foreignKey: 'applicationId',
  otherKey: 'productId',
  as: 'products'
});

// 询价与用户的关系
Inquiry.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Inquiry, { foreignKey: 'userId', as: 'inquiries' });

// 案例与产品的多对多关系
Case.belongsToMany(Product, { 
  through: 'CaseProducts', 
  foreignKey: 'caseId',
  otherKey: 'productId',
  as: 'products'
});
Product.belongsToMany(Case, { 
  through: 'CaseProducts', 
  foreignKey: 'productId',
  otherKey: 'caseId',
  as: 'cases'
});

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Application,
  Inquiry,
  Case,
  Certification
};