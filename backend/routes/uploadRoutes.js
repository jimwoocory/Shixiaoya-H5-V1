const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// 确保上传目录存在
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 创建上传目录
['products', 'cases', 'certifications', 'avatars'].forEach(subDir => {
  ensureUploadDir(path.join(uploadDir, subDir));
});

// 文件存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type = 'general' } = req.body;
    const uploadPath = path.join(uploadDir, type);
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

// Multer配置
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// 单文件上传
router.post('/single', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    const fileUrl = `/uploads/${req.body.type || 'general'}/${req.file.filename}`;

    res.json({
      success: true,
      message: '文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: '文件上传失败'
    });
  }
});

// 多文件上传
router.post('/multiple', authenticate, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    const files = req.files.map(file => {
      const fileUrl = `/uploads/${req.body.type || 'general'}/${file.filename}`;
      return {
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      };
    });

    res.json({
      success: true,
      message: '文件上传成功',
      data: { files }
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: '文件上传失败'
    });
  }
});

// 删除文件（管理员）
router.delete('/:type/:filename', requireAdmin, (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(uploadDir, type, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: '文件删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }
  } catch (error) {
    console.error('文件删除失败:', error);
    res.status(500).json({
      success: false,
      message: '文件删除失败'
    });
  }
});

// 获取文件列表（管理员）
router.get('/:type', requireAdmin, (req, res) => {
  try {
    const { type } = req.params;
    const dirPath = path.join(uploadDir, type);

    if (!fs.existsSync(dirPath)) {
      return res.json({
        success: true,
        data: { files: [] }
      });
    }

    const files = fs.readdirSync(dirPath).map(filename => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      const fileUrl = `/uploads/${type}/${filename}`;

      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      };
    });

    res.json({
      success: true,
      data: { files }
    });
  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文件列表失败'
    });
  }
});

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超出限制'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '文件数量超出限制'
      });
    }
  }

  res.status(400).json({
    success: false,
    message: error.message || '文件上传失败'
  });
});

module.exports = router;