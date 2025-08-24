const { Category, Product } = require('../models');
const { validationResult } = require('express-validator');

// 获取分类列表
const getCategories = async (req, res) => {
  try {
    const { includeProducts = false, status = 'active' } = req.query;

    const include = [];
    if (includeProducts === 'true') {
      include.push({
        model: Product,
        as: 'products',
        where: { status: 'active' },
        required: false,
        attributes: ['id', 'name', 'price', 'rating', 'viewCount']
      });
    }

    const categories = await Category.findAll({
      where: { status },
      include,
      order: [['sortOrder', 'DESC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类列表失败'
    });
  }
};

// 获取分类详情
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, status: 'active' },
      include: [
        {
          model: Product,
          as: 'products',
          where: { status: 'active' },
          required: false,
          limit: 10,
          order: [['sortOrder', 'DESC'], ['viewCount', 'DESC']]
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类详情失败'
    });
  }
};

// 创建分类（管理员）
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { name, description, icon, parentId, level, sortOrder } = req.body;

    const category = await Category.create({
      name,
      description,
      icon,
      parentId,
      level,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: '分类创建成功',
      data: { category }
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      success: false,
      message: '创建分类失败'
    });
  }
};

// 更新分类（管理员）
const updateCategory = async (req, res) => {
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
    const { name, description, icon, parentId, level, sortOrder, status } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    await category.update({
      name,
      description,
      icon,
      parentId,
      level,
      sortOrder,
      status
    });

    res.json({
      success: true,
      message: '分类更新成功',
      data: { category }
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      success: false,
      message: '更新分类失败'
    });
  }
};

// 删除分类（管理员）
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查是否有关联的产品
    const productCount = await Product.count({
      where: { categoryId: id }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: '该分类下还有产品，无法删除'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: '分类删除成功'
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({
      success: false,
      message: '删除分类失败'
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};