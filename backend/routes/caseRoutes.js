const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
  getHotCases,
  getFeaturedCases
} = require('../controllers/caseController');

const { requireAdmin } = require('../middleware/authMiddleware');

// 获取案例列表
router.get('/', getCases);

// 获取热门案例
router.get('/hot', getHotCases);

// 获取精选案例
router.get('/featured', getFeaturedCases);

// 获取案例详情
router.get('/:id', getCase);

// 创建案例（管理员）
router.post('/', requireAdmin, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('案例标题长度必须在1-200个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('案例描述不能超过2000个字符'),
  body('projectType')
    .isIn(['residential', 'commercial', 'office', 'hotel', 'other'])
    .withMessage('项目类型无效'),
  body('projectArea')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('请输入有效的项目面积'),
  body('completedAt')
    .optional()
    .isISO8601()
    .withMessage('请输入有效的完成时间'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], createCase);

// 更新案例（管理员）
router.put('/:id', requireAdmin, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('案例标题长度必须在1-200个字符之间'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('案例描述不能超过2000个字符'),
  body('projectType')
    .optional()
    .isIn(['residential', 'commercial', 'office', 'hotel', 'other'])
    .withMessage('项目类型无效'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('案例状态无效'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序权重必须是非负整数')
], updateCase);

// 删除案例（管理员）
router.delete('/:id', requireAdmin, deleteCase);

module.exports = router;