const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  wechatLogin,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');

const { authenticate } = require('../middleware/authMiddleware');

// 用户注册
router.post('/register', [
  body('nickname')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('昵称长度必须在2-50个字符之间'),
  body('phone')
    .optional()
    .isMobilePhone('zh-CN')
    .withMessage('请输入有效的手机号'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('密码长度必须在6-20个字符之间')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('密码必须包含字母和数字'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('公司名称不能超过100个字符'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('职位不能超过50个字符')
], register);

// 用户登录
router.post('/login', [
  body('account')
    .notEmpty()
    .withMessage('请输入手机号或邮箱'),
  body('password')
    .notEmpty()
    .withMessage('请输入密码')
], login);

// 微信登录
router.post('/wechat', [
  body('code')
    .notEmpty()
    .withMessage('缺少微信授权码')
], wechatLogin);

// 获取用户信息
router.get('/profile', authenticate, getProfile);

// 更新用户信息
router.put('/profile', authenticate, [
  body('nickname')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('昵称长度必须在2-50个字符之间'),
  body('phone')
    .optional()
    .isMobilePhone('zh-CN')
    .withMessage('请输入有效的手机号'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('公司名称不能超过100个字符'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('职位不能超过50个字符'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('地址不能超过500个字符')
], updateProfile);

// 修改密码
router.put('/password', authenticate, [
  body('oldPassword')
    .notEmpty()
    .withMessage('请输入原密码'),
  body('newPassword')
    .isLength({ min: 6, max: 20 })
    .withMessage('新密码长度必须在6-20个字符之间')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('新密码必须包含字母和数字')
], changePassword);

module.exports = router;