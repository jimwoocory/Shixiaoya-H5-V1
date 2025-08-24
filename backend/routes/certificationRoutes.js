const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  getCertificationsByCategory
} = require('../controllers/certificationController');

const { requireAdmin } = require('../middleware/authMiddleware');

// 获取认证列表
router.get('/', getCertifications);

// 获取按类别分组的认证
router.get('/by-category', getCertificationsByCategory);

// 获取认证详情
router.get('/:id', getCertification);

// 创建认证（管理员）
router.post('/', requireAdmin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('认证名称长度必须在1-100个字符之间'),
  body('issuer')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('颁发机构长度必须在1-100个字符之间'),
  body('category')
    .isIn(['quality', 'environmental', 'safety', 'management', 'other'])
    .withMessage('认证类别无效'),
  body('issuedAt')
    .optional()
    .isISO8601()
    .withMessage('请输入有效的颁发日期'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('请输入有效的过期日期'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], createCertification);

// 更新认证（管理员）
router.put('/:id', requireAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('认证名称长度必须在1-100个字符之间'),
  body('issuer')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('颁发机构长度必须在1-100个字符之间'),
  body('category')
    .optional()
    .isIn(['quality', 'environmental', 'safety', 'management', 'other'])
    .withMessage('认证类别无效'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'expired'])
    .withMessage('认证状态无效'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], updateCertification);

// 删除认证（管理员）
router.delete('/:id', requireAdmin, deleteCertification);

module.exports = router;