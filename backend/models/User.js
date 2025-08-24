const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    openid: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
      comment: '微信openid'
    },
    unionid: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
      comment: '微信unionid'
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '用户昵称'
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '头像URL'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: '手机号'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: '邮箱'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '密码哈希'
    },
    userType: {
      type: DataTypes.ENUM('user', 'vip', 'admin'),
      defaultValue: 'user',
      comment: '用户类型'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active',
      comment: '用户状态'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
    },
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '公司名称'
    },
    position: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '职位'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '地址'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['openid'] },
      { fields: ['phone'] },
      { fields: ['email'] },
      { fields: ['userType'] }
    ]
  });

  return User;
};