const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '应用场景名称'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '应用场景描述'
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '场景图标'
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '场景图片'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序权重'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      comment: '状态'
    }
  }, {
    tableName: 'applications',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['sortOrder'] }
    ]
  });

  return Application;
};