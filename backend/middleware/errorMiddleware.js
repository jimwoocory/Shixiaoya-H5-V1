// 404错误处理
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// 全局错误处理
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Sequelize错误处理
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(error => error.message).join(', ');
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = '数据已存在，请检查输入信息';
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = '关联数据不存在';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的访问令牌';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '访问令牌已过期';
  }

  // 开发环境显示详细错误信息
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  console.error(`❌ 错误: ${message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: err.stack
  });

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler
};