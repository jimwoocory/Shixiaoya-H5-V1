const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '产品名称'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '产品描述'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '产品分类ID'
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '产品图片数组'
    },
    specifications: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '产品规格参数'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '产品标签'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: '产品价格'
    },
    priceUnit: {
      type: DataTypes.STRING(20),
      defaultValue: '张',
      comment: '价格单位'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      comment: '产品评分'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '浏览次数'
    },
    inquiryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '询价次数'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
      defaultValue: 'active',
      comment: '产品状态'
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否热门产品'
    },
    isNew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否新品'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序权重'
    },
    seoTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'SEO标题'
    },
    seoKeywords: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'SEO关键词'
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SEO描述'
    }
  }, {
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['categoryId'] },
      { fields: ['status'] },
      { fields: ['isHot'] },
      { fields: ['isNew'] },
      { fields: ['sortOrder'] },
      { fields: ['rating'] }
    ]
  });

  return Product;
};