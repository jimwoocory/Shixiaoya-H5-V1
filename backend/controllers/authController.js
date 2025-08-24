const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

// 生成JWT令牌
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// 用户注册
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { nickname, phone, email, password, companyName, position } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        $or: [
          { phone: phone || null },
          { email: email || null }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '手机号或邮箱已被注册'
      });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await User.create({
      nickname,
      phone,
      email,
      password: hashedPassword,
      companyName,
      position,
      lastLoginAt: new Date()
    });

    // 生成令牌
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          nickname: user.nickname,
          phone: user.phone,
          email: user.email,
          userType: user.userType,
          companyName: user.companyName,
          position: user.position
        },
        token
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { account, password } = req.body;

    // 查找用户（支持手机号或邮箱登录）
    const user = await User.findOne({
      where: {
        $or: [
          { phone: account },
          { email: account }
        ],
        status: 'active'
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '密码错误'
      });
    }

    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() });

    // 生成令牌
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          nickname: user.nickname,
          phone: user.phone,
          email: user.email,
          userType: user.userType,
          avatar: user.avatar,
          companyName: user.companyName,
          position: user.position
        },
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
};

// 微信登录
const wechatLogin = async (req, res) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: '缺少微信授权码'
      });
    }

    // 这里应该调用微信API获取openid和session_key
    // 为了演示，我们模拟这个过程
    const mockOpenid = `mock_openid_${Date.now()}`;

    // 查找或创建用户
    let user = await User.findOne({
      where: { openid: mockOpenid }
    });

    if (!user) {
      user = await User.create({
        openid: mockOpenid,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl,
        lastLoginAt: new Date()
      });
    } else {
      await user.update({
        nickname: userInfo?.nickName || user.nickname,
        avatar: userInfo?.avatarUrl || user.avatar,
        lastLoginAt: new Date()
      });
    }

    // 生成令牌
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: '微信登录成功',
      data: {
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          userType: user.userType,
          openid: user.openid
        },
        token
      }
    });
  } catch (error) {
    console.error('微信登录失败:', error);
    res.status(500).json({
      success: false,
      message: '微信登录失败，请稍后重试'
    });
  }
};

// 获取当前用户信息
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
};

// 更新用户信息
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { nickname, phone, email, companyName, position, address } = req.body;

    await req.user.update({
      nickname,
      phone,
      email,
      companyName,
      position,
      address
    });

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: {
        user: {
          id: req.user.id,
          nickname: req.user.nickname,
          phone: req.user.phone,
          email: req.user.email,
          companyName: req.user.companyName,
          position: req.user.position,
          address: req.user.address
        }
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败'
    });
  }
};

// 修改密码
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      });
    }

    const { oldPassword, newPassword } = req.body;

    // 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(oldPassword, req.user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '原密码错误'
      });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // 更新密码
    await req.user.update({ password: hashedNewPassword });

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败'
    });
  }
};

module.exports = {
  register,
  login,
  wechatLogin,
  getProfile,
  updateProfile,
  changePassword
};