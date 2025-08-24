const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inquiry = sequelize.define('Inquiry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '用户ID'
    },
    contactName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '联系人姓名'
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '联系电话'
    },
    contactEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '联系邮箱'
    },
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '公司名称'
    },
    productIds: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '询价产品ID数组'
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '具体需求'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '预计数量'
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: '预算范围'
    },
    urgency: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
      comment: '紧急程度'
    },
    source: {
      type: DataTypes.ENUM('web', 'wechat', 'phone', 'other'),
      defaultValue: 'web',
      comment: '询价来源'
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'quoted', 'completed', 'cancelled'),
      defaultValue: 'pending',
      comment: '处理状态'
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '分配给的销售人员ID'
    },
    quotedPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: '报价金额'
    },
    quotedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '报价时间'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注信息'
    },
    followUpAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '下次跟进时间'
    }
  }, {
    tableName: 'inquiries',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['urgency'] },
      { fields: ['assignedTo'] },
      { fields: ['createdAt'] }
    ]
  });

  return Inquiry;
};