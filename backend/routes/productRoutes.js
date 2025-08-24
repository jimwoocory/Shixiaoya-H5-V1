const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getHotProducts,
  getNewProducts
} = require('../controllers/productController');

const { optionalAuth, requireAdmin } = require('../middleware/authMiddleware');

// 获取产品列表
router.get('/', optionalAuth, getProducts);

// 获取热门产品
router.get('/hot', getHotProducts);

// 获取新品
router.get('/new', getNewProducts);

// 获取产品详情
router.get('/:id', optionalAuth, getProduct);

// 创建产品（管理员）
router.post('/', requireAdmin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('产品名称长度必须在1-100个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('产品描述不能超过2000个字符'),
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('请选择有效的产品分类'),
  body('price')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('请输入有效的价格'),
  body('priceUnit')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('价格单位不能超过20个字符'),
  body('applicationIds')
    .optional()
    .isArray()
    .withMessage('应用场景必须是数组格式'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], createProduct);

// 更新产品（管理员）
router.put('/:id', requireAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('产品名称长度必须在1-100个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('产品描述不能超过2000个字符'),
  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('请选择有效的产品分类'),
  body('price')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('请输入有效的价格'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'discontinued'])
    .withMessage('产品状态无效'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], updateProduct);

// 删除产品（管理员）
router.delete('/:id', requireAdmin, deleteProduct);

module.exports = router;