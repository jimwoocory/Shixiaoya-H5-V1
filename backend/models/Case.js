const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Case = sequelize.define('Case', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '案例标题'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '案例描述'
    },
    clientName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '客户名称'
    },
    projectType: {
      type: DataTypes.ENUM('residential', 'commercial', 'office', 'hotel', 'other'),
      allowNull: false,
      comment: '项目类型'
    },
    projectArea: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: '项目面积(平方米)'
    },
    projectLocation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '项目地点'
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '完成时间'
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '案例图片数组'
    },
    beforeImages: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '施工前图片'
    },
    afterImages: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '施工后图片'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '项目特色'
    },
    challenges: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '项目挑战'
    },
    solutions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '解决方案'
    },
    results: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '项目成果'
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '客户评价'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '浏览次数'
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否热门案例'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否精选案例'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序权重'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
      comment: '案例状态'
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
    tableName: 'cases',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['projectType'] },
      { fields: ['status'] },
      { fields: ['isHot'] },
      { fields: ['isFeatured'] },
      { fields: ['sortOrder'] },
      { fields: ['completedAt'] }
    ]
  });

  return Case;
};