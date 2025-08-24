const { Product, Category, Application } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取产品列表
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      applicationId,
      keyword,
      isHot,
      isNew,
      status = 'active',
      sortBy = 'sortOrder',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    // 分类筛选
    if (categoryId && categoryId !== '1') {
      where.categoryId = categoryId;
    }

    // 关键词搜索
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 热门产品筛选
    if (isHot !== undefined) {
      where.isHot = isHot === 'true';
    }

    // 新品筛选
    if (isNew !== undefined) {
      where.isNew = isNew === 'true';
    }

    // 应用场景筛选
    let include = [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: Application,
        as: 'applications',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    ];

    if (applicationId && applicationId !== '1') {
      include[1].where = { id: applicationId };
      include[1].required = true;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // 更新浏览次数（异步执行，不影响响应）
    if (req.user) {
      rows.forEach(product => {
        product.increment('viewCount', { by: 1 });
      });
    }

    res.json({
      success: true,
      data: {
        products: rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品列表失败'
    });
  }
};

// 获取产品详情
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, status: 'active' },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    // 更新浏览次数
    await product.increment('viewCount', { by: 1 });

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品详情失败'
    });
  }
};

// 创建产品（管理员）
const createProduct = async (req, res) => {
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
      categoryId,
      images,
      specifications,
      tags,
      price,
      priceUnit,
      applicationIds,
      isHot,
      isNew,
      sortOrder,
      seoTitle,
      seoKeywords,
      seoDescription
    } = req.body;

    const product = await Product.create({
      name,
      description,
      categoryId,
      images,
      specifications,
      tags,
      price,
      priceUnit,
      isHot,
      isNew,
      sortOrder,
      seoTitle,
      seoKeywords,
      seoDescription
    });

    // 关联应用场景
    if (applicationIds && applicationIds.length > 0) {
      const applications = await Application.findAll({
        where: { id: applicationIds }
      });
      await product.setApplications(applications);
    }

    res.status(201).json({
      success: true,
      message: '产品创建成功',
      data: { product }
    });
  } catch (error) {
    console.error('创建产品失败:', error);
    res.status(500).json({
      success: false,
      message: '创建产品失败'
    });
  }
};

// 更新产品（管理员）
const updateProduct = async (req, res) => {
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
      name,
      description,
      categoryId,
      images,
      specifications,
      tags,
      price,
      priceUnit,
      applicationIds,
      isHot,
      isNew,
      sortOrder,
      status,
      seoTitle,
      seoKeywords,
      seoDescription
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    await product.update({
      name,
      description,
      categoryId,
      images,
      specifications,
      tags,
      price,
      priceUnit,
      isHot,
      isNew,
      sortOrder,
      status,
      seoTitle,
      seoKeywords,
      seoDescription
    });

    // 更新应用场景关联
    if (applicationIds !== undefined) {
      if (applicationIds.length > 0) {
        const applications = await Application.findAll({
          where: { id: applicationIds }
        });
        await product.setApplications(applications);
      } else {
        await product.setApplications([]);
      }
    }

    res.json({
      success: true,
      message: '产品更新成功',
      data: { product }
    });
  } catch (error) {
    console.error('更新产品失败:', error);
    res.status(500).json({
      success: false,
      message: '更新产品失败'
    });
  }
};

// 删除产品（管理员）
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: '产品删除成功'
    });
  } catch (error) {
    console.error('删除产品失败:', error);
    res.status(500).json({
      success: false,
      message: '删除产品失败'
    });
  }
};

// 获取热门产品
const getHotProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.findAll({
      where: {
        status: 'active',
        isHot: true
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      order: [['sortOrder', 'DESC'], ['viewCount', 'DESC']]
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('获取热门产品失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门产品失败'
    });
  }
};

// 获取新品
const getNewProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.findAll({
      where: {
        status: 'active',
        isNew: true
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('获取新品失败:', error);
    res.status(500).json({
      success: false,
      message: '获取新品失败'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getHotProducts,
  getNewProducts
};