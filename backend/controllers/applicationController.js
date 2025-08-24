const { Application, Product } = require('../models');
const { validationResult } = require('express-validator');

// 获取应用场景列表
const getApplications = async (req, res) => {
  try {
    const { includeProducts = false, status = 'active' } = req.query;

    const include = [];
    if (includeProducts === 'true') {
      include.push({
        model: Product,
        as: 'products',
        where: { status: 'active' },
        required: false,
        attributes: ['id', 'name', 'price', 'rating', 'viewCount'],
        through: { attributes: [] }
      });
    }

    const applications = await Application.findAll({
      where: { status },
      include,
      order: [['sortOrder', 'DESC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    console.error('获取应用场景列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取应用场景列表失败'
    });
  }
};

// 获取应用场景详情
const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findOne({
      where: { id, status: 'active' },
      include: [
        {
          model: Product,
          as: 'products',
          where: { status: 'active' },
          required: false,
          limit: 10,
          order: [['sortOrder', 'DESC'], ['viewCount', 'DESC']],
          through: { attributes: [] }
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: '应用场景不存在'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  } catch (error) {
    console.error('获取应用场景详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取应用场景详情失败'
    });
  }
};

// 创建应用场景（管理员）
const createApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { name, description, icon, image, sortOrder } = req.body;

    const application = await Application.create({
      name,
      description,
      icon,
      image,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: '应用场景创建成功',
      data: { application }
    });
  } catch (error) {
    console.error('创建应用场景失败:', error);
    res.status(500).json({
      success: false,
      message: '创建应用场景失败'
    });
  }
};

// 更新应用场景（管理员）
const updateApplication = async (req, res) => {
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
    const { name, description, icon, image, sortOrder, status } = req.body;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: '应用场景不存在'
      });
    }

    await application.update({
      name,
      description,
      icon,
      image,
      sortOrder,
      status
    });

    res.json({
      success: true,
      message: '应用场景更新成功',
      data: { application }
    });
  } catch (error) {
    console.error('更新应用场景失败:', error);
    res.status(500).json({
      success: false,
      message: '更新应用场景失败'
    });
  }
};

// 删除应用场景（管理员）
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: '应用场景不存在'
      });
    }

    await application.destroy();

    res.json({
      success: true,
      message: '应用场景删除成功'
    });
  } catch (error) {
    console.error('删除应用场景失败:', error);
    res.status(500).json({
      success: false,
      message: '删除应用场景失败'
    });
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
};