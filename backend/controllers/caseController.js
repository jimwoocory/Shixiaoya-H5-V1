const { Case, Product } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取案例列表
const getCases = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      projectType,
      keyword,
      isHot,
      isFeatured,
      status = 'published',
      sortBy = 'sortOrder',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    // 项目类型筛选
    if (projectType) {
      where.projectType = projectType;
    }

    // 关键词搜索
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { clientName: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 热门案例筛选
    if (isHot !== undefined) {
      where.isHot = isHot === 'true';
    }

    // 精选案例筛选
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    const { count, rows } = await Case.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price'],
          through: { attributes: [] }
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // 更新浏览次数（异步执行）
    rows.forEach(caseItem => {
      caseItem.increment('viewCount', { by: 1 });
    });

    res.json({
      success: true,
      data: {
        cases: rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取案例列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取案例列表失败'
    });
  }
};

// 获取案例详情
const getCase = async (req, res) => {
  try {
    const { id } = req.params;

    const caseItem = await Case.findOne({
      where: { id, status: 'published' },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price', 'images', 'description'],
          through: { attributes: [] }
        }
      ]
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: '案例不存在'
      });
    }

    // 更新浏览次数
    await caseItem.increment('viewCount', { by: 1 });

    res.json({
      success: true,
      data: { case: caseItem }
    });
  } catch (error) {
    console.error('获取案例详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取案例详情失败'
    });
  }
};

// 创建案例（管理员）
const createCase = async (req, res) => {
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
      title,
      description,
      clientName,
      projectType,
      projectArea,
      projectLocation,
      completedAt,
      images,
      beforeImages,
      afterImages,
      features,
      challenges,
      solutions,
      results,
      testimonial,
      productIds,
      isHot,
      isFeatured,
      sortOrder,
      seoTitle,
      seoKeywords,
      seoDescription
    } = req.body;

    const caseItem = await Case.create({
      title,
      description,
      clientName,
      projectType,
      projectArea,
      projectLocation,
      completedAt,
      images,
      beforeImages,
      afterImages,
      features,
      challenges,
      solutions,
      results,
      testimonial,
      isHot,
      isFeatured,
      sortOrder,
      seoTitle,
      seoKeywords,
      seoDescription
    });

    // 关联产品
    if (productIds && productIds.length > 0) {
      const products = await Product.findAll({
        where: { id: productIds }
      });
      await caseItem.setProducts(products);
    }

    res.status(201).json({
      success: true,
      message: '案例创建成功',
      data: { case: caseItem }
    });
  } catch (error) {
    console.error('创建案例失败:', error);
    res.status(500).json({
      success: false,
      message: '创建案例失败'
    });
  }
};

// 更新案例（管理员）
const updateCase = async (req, res) => {
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

    const caseItem = await Case.findByPk(id);
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: '案例不存在'
      });
    }

    await caseItem.update(updateData);

    // 更新产品关联
    if (updateData.productIds !== undefined) {
      if (updateData.productIds.length > 0) {
        const products = await Product.findAll({
          where: { id: updateData.productIds }
        });
        await caseItem.setProducts(products);
      } else {
        await caseItem.setProducts([]);
      }
    }

    res.json({
      success: true,
      message: '案例更新成功',
      data: { case: caseItem }
    });
  } catch (error) {
    console.error('更新案例失败:', error);
    res.status(500).json({
      success: false,
      message: '更新案例失败'
    });
  }
};

// 删除案例（管理员）
const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const caseItem = await Case.findByPk(id);
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: '案例不存在'
      });
    }

    await caseItem.destroy();

    res.json({
      success: true,
      message: '案例删除成功'
    });
  } catch (error) {
    console.error('删除案例失败:', error);
    res.status(500).json({
      success: false,
      message: '删除案例失败'
    });
  }
};

// 获取热门案例
const getHotCases = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const cases = await Case.findAll({
      where: {
        status: 'published',
        isHot: true
      },
      limit: parseInt(limit),
      order: [['sortOrder', 'DESC'], ['viewCount', 'DESC']],
      attributes: ['id', 'title', 'description', 'images', 'projectType', 'completedAt', 'viewCount']
    });

    res.json({
      success: true,
      data: { cases }
    });
  } catch (error) {
    console.error('获取热门案例失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门案例失败'
    });
  }
};

// 获取精选案例
const getFeaturedCases = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const cases = await Case.findAll({
      where: {
        status: 'published',
        isFeatured: true
      },
      limit: parseInt(limit),
      order: [['sortOrder', 'DESC'], ['completedAt', 'DESC']],
      attributes: ['id', 'title', 'description', 'images', 'projectType', 'completedAt', 'viewCount']
    });

    res.json({
      success: true,
      data: { cases }
    });
  } catch (error) {
    console.error('获取精选案例失败:', error);
    res.status(500).json({
      success: false,
      message: '获取精选案例失败'
    });
  }
};

module.exports = {
  getCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
  getHotCases,
  getFeaturedCases
};