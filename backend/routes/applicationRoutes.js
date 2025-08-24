const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');

const { requireAdmin } = require('../middleware/authMiddleware');

// 获取应用场景列表
router.get('/', getApplications);

// 获取应用场景详情
router.get('/:id', getApplication);

// 创建应用场景（管理员）
router.post('/', requireAdmin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('应用场景名称长度必须在1-50个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('应用场景描述不能超过500个字符'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], createApplication);

// 更新应用场景（管理员）
router.put('/:id', requireAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('应用场景名称长度必须在1-50个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('应用场景描述不能超过500个字符'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('应用场景状态无效'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], updateApplication);

// 删除应用场景（管理员）
router.delete('/:id', requireAdmin, deleteApplication);

module.exports = router;