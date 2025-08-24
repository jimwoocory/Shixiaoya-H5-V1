const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  getMyInquiries,
  getInquiryStats
} = require('../controllers/inquiryController');

const { authenticate, optionalAuth, requireAdmin } = require('../middleware/authMiddleware');

// 提交询价
router.post('/', optionalAuth, [
  body('contactName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('联系人姓名长度必须在2-50个字符之间'),
  body('contactPhone')
    .isMobilePhone('zh-CN')
    .withMessage('请输入有效的手机号'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('公司名称不能超过100个字符'),
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('需求描述不能超过2000个字符'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('数量必须是正整数'),
  body('budget')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('请输入有效的预算金额'),
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('紧急程度无效'),
  body('source')
    .optional()
    .isIn(['web', 'wechat', 'phone', 'other'])
    .withMessage('询价来源无效')
], createInquiry);

// 获取我的询价（用户）
router.get('/my', authenticate, getMyInquiries);

// 获取询价统计（管理员）
router.get('/stats', requireAdmin, getInquiryStats);

// 获取询价列表（管理员）
router.get('/', requireAdmin, getInquiries);

// 获取询价详情
router.get('/:id', requireAdmin, getInquiry);

// 更新询价（管理员）
router.put('/:id', requireAdmin, [
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'quoted', 'completed', 'cancelled'])
    .withMessage('询价状态无效'),
  body('assignedTo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('分配人ID必须是正整数'),
  body('quotedPrice')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('请输入有效的报价金额'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('备注不能超过2000个字符'),
  body('followUpAt')
    .optional()
    .isISO8601()
    .withMessage('请输入有效的跟进时间')
], updateInquiry);

module.exports = router;