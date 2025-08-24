const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { requireAdmin } = require('../middleware/authMiddleware');

// 获取分类列表
router.get('/', getCategories);

// 获取分类详情
router.get('/:id', getCategory);

// 创建分类（管理员）
router.post('/', requireAdmin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('分类名称长度必须在1-50个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('分类描述不能超过500个字符'),
  body('parentId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('父分类ID必须是正整数'),
  body('level')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('分类层级必须在1-5之间'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], createCategory);

// 更新分类（管理员）
router.put('/:id', requireAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('分类名称长度必须在1-50个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('分类描述不能超过500个字符'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('分类状态无效'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], updateCategory);

// 删除分类（管理员）
router.delete('/:id', requireAdmin, deleteCategory);

module.exports = router;