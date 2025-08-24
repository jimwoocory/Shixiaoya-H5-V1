const { Certification } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取认证列表
const getCertifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      isValid,
      status = 'active',
      sortBy = 'sortOrder',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    // 认证类别筛选
    if (category) {
      where.category = category;
    }

    // 有效性筛选
    if (isValid !== undefined) {
      where.isValid = isValid === 'true';
    }

    // 检查过期认证
    const now = new Date();
    if (isValid === 'true') {
      where[Op.or] = [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: now } }
      ];
    }

    const { count, rows } = await Certification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      data: {
        certifications: rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取认证列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取认证列表失败'
    });
  }
};

// 获取认证详情
const getCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findOne({
      where: { id, status: 'active' }
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: '认证不存在'
      });
    }

    res.json({
      success: true,
      data: { certification }
    });
  } catch (error) {
    console.error('获取认证详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取认证详情失败'
    });
  }
};

// 创建认证（管理员）
const createCertification = async (req, res) => {
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
      name,
      description,
      issuer,
      certificateNumber,
      issuedAt,
      expiresAt,
      certificateImage,
      category,
      level,
      scope,
      sortOrder
    } = req.body;

    const certification = await Certification.create({
      name,
      description,
      issuer,
      certificateNumber,
      issuedAt,
      expiresAt,
      certificateImage,
      category,
      level,
      scope,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: '认证创建成功',
      data: { certification }
    });
  } catch (error) {
    console.error('创建认证失败:', error);
    res.status(500).json({
      success: false,
      message: '创建认证失败'
    });
  }
};

// 更新认证（管理员）
const updateCertification = async (req, res) => {
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
    const updateData = req.body;

    const certification = await Certification.findByPk(id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: '认证不存在'
      });
    }

    // 检查认证是否过期
    if (updateData.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(updateData.expiresAt);
      updateData.isValid = expiresAt > now;
      
      if (expiresAt <= now) {
        updateData.status = 'expired';
      }
    }

    await certification.update(updateData);

    res.json({
      success: true,
      message: '认证更新成功',
      data: { certification }
    });
  } catch (error) {
    console.error('更新认证失败:', error);
    res.status(500).json({
      success: false,
      message: '更新认证失败'
    });
  }
};

// 删除认证（管理员）
const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findByPk(id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: '认证不存在'
      });
    }

    await certification.destroy();

    res.json({
      success: true,
      message: '认证删除成功'
    });
  } catch (error) {
    console.error('删除认证失败:', error);
    res.status(500).json({
      success: false,
      message: '删除认证失败'
    });
  }
};

// 获取按类别分组的认证
const getCertificationsByCategory = async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      where: {
        status: 'active',
        isValid: true,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: new Date() } }
        ]
      },
      order: [['category', 'ASC'], ['sortOrder', 'DESC']]
    });

    // 按类别分组
    const groupedCertifications = certifications.reduce((acc, cert) => {
      if (!acc[cert.category]) {
        acc[cert.category] = [];
      }
      acc[cert.category].push(cert);
      return acc;
    }, {});

    res.json({
      success: true,
      data: { certifications: groupedCertifications }
    });
  } catch (error) {
    console.error('获取分类认证失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类认证失败'
    });
  }
};

module.exports = {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  getCertificationsByCategory
};