const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '分类名称'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '分类描述'
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '分类图标'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '父分类ID'
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: '分类层级'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序权重'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      comment: '分类状态'
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['parentId'] },
      { fields: ['status'] },
      { fields: ['sortOrder'] }
    ]
  });

  return Category;
};