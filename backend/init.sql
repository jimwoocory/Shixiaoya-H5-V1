-- 创建数据库
CREATE DATABASE IF NOT EXISTS shixiaoya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE shixiaoya_db;

-- 设置时区
SET time_zone = '+08:00';

-- 创建用户并授权
CREATE USER IF NOT EXISTS 'shixiaoya'@'%' IDENTIFIED BY 'shixiaoya123';
GRANT ALL PRIVILEGES ON shixiaoya_db.* TO 'shixiaoya'@'%';
FLUSH PRIVILEGES;