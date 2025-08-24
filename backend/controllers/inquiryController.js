const { Inquiry, User, Product } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 提交询价
const createInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const {
      contactName,
      contactPhone,
      contactEmail,
      companyName,
      productIds,
      requirements,
      quantity,
      budget,
      urgency,
      source
    } = req.body;

    const inquiry = await Inquiry.create({
      userId: req.user?.id,
      contactName,
      contactPhone,
      contactEmail,
      companyName,
      productIds,
      requirements,
      quantity,
      budget,
      urgency,
      source
    });

    // 更新相关产品的询价次数
    if (productIds && productIds.length > 0) {
      await Product.increment('inquiryCount', {
        by: 1,
        where: { id: productIds }
      });
    }

    res.status(201).json({
      success: true,
      message: '询价提交成功，我们会尽快与您联系',
      data: { inquiry }
    });
  } catch (error) {
    console.error('提交询价失败:', error);
    res.status(500).json({
      success: false,
      message: '提交询价失败，请稍后重试'
    });
  }
};

// 获取询价列表（管理员）
const getInquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      urgency,
      assignedTo,
      startDate,
      endDate,
      keyword
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // 状态筛选
    if (status) {
      where.status = status;
    }

    // 紧急程度筛选
    if (urgency) {
      where.urgency = urgency;
    }

    // 分配人筛选
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    // 日期范围筛选
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // 关键词搜索
    if (keyword) {
      where[Op.or] = [
        { contactName: { [Op.like]: `%${keyword}%` } },
        { contactPhone: { [Op.like]: `%${keyword}%` } },
        { companyName: { [Op.like]: `%${keyword}%` } },
        { requirements: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Inquiry.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        inquiries: rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取询价列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取询价列表失败'
    });
  }
};

// 获取询价详情
const getInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar', 'phone', 'email'],
          required: false
        }
      ]
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: '询价记录不存在'
      });
    }

    // 如果有产品ID，获取产品信息
    let products = [];
    if (inquiry.productIds && inquiry.productIds.length > 0) {
      products = await Product.findAll({
        where: { id: inquiry.productIds },
        attributes: ['id', 'name', 'price', 'images']
      });
    }

    res.json({
      success: true,
      data: {
        inquiry,
        products
      }
    });
  } catch (error) {
    console.error('获取询价详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取询价详情失败'
    });
  }
};

// 更新询价状态（管理员）
const updateInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      status,
      assignedTo,
      quotedPrice,
      notes,
      followUpAt
    } = req.body;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: '询价记录不存在'
      });
    }

    const updateData = {
      status,
      assignedTo,
      quotedPrice,
      notes,
      followUpAt
    };

    // 如果状态变为已报价，记录报价时间
    if (status === 'quoted' && inquiry.status !== 'quoted') {
      updateData.quotedAt = new Date();
    }

    await inquiry.update(updateData);

    res.json({
      success: true,
      message: '询价信息更新成功',
      data: { inquiry }
    });
  } catch (error) {
    console.error('更新询价失败:', error);
    res.status(500).json({
      success: false,
      message: '更新询价失败'
    });
  }
};

// 获取我的询价（用户）
const getMyInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Inquiry.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        inquiries: rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取我的询价失败:', error);
    res.status(500).json({
      success: false,
      message: '获取我的询价失败'
    });
  }
};

// 获取询价统计（管理员）
const getInquiryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // 总询价数
    const totalInquiries = await Inquiry.count({ where });

    // 按状态统计
    const statusStats = await Inquiry.findAll({
      where,
      attributes: [
        'status',
        [Inquiry.sequelize.fn('COUNT', Inquiry.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // 按紧急程度统计
    const urgencyStats = await Inquiry.findAll({
      where,
      attributes: [
        'urgency',
        [Inquiry.sequelize.fn('COUNT', Inquiry.sequelize.col('id')), 'count']
      ],
      group: ['urgency'],
      raw: true
    });

    // 按来源统计
    const sourceStats = await Inquiry.findAll({
      where,
      attributes: [
        'source',
        [Inquiry.sequelize.fn('COUNT', Inquiry.sequelize.col('id')), 'count']
      ],
      group: ['source'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalInquiries,
        statusStats,
        urgencyStats,
        sourceStats
      }
    });
  } catch (error) {
    console.error('获取询价统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取询价统计失败'
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  getMyInquiries,
  getInquiryStats
};