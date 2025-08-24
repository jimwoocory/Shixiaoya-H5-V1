const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certification = sequelize.define('Certification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '认证名称'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '认证描述'
    },
    issuer: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '颁发机构'
    },
    certificateNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '证书编号'
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '颁发日期'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '过期日期'
    },
    certificateImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '证书图片'
    },
    category: {
      type: DataTypes.ENUM('quality', 'environmental', 'safety', 'management', 'other'),
      allowNull: false,
      comment: '认证类别'
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '认证等级'
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '认证范围'
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否有效'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序权重'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'expired'),
      defaultValue: 'active',
      comment: '状态'
    }
  }, {
    tableName: 'certifications',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['isValid'] },
      { fields: ['sortOrder'] },
      { fields: ['expiresAt'] }
    ]
  });

  return Certification;
};