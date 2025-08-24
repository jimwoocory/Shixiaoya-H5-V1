# MySQL 8.0 安装指南

## 1. 下载MySQL安装包

访问MySQL官方下载页面：https://dev.mysql.com/downloads/installer/

选择 **mysql-installer-web-community-8.0.xx.x.msi** (推荐)

## 2. 安装步骤

### 第一步：运行安装程序
- 双击下载的 `.msi` 文件
- 选择 "Custom" 自定义安装

### 第二步：选择安装组件
勾选以下组件：
- ✅ MySQL Server 8.0.xx
- ✅ MySQL Workbench 8.0.xx (可选，图形化管理工具)
- ✅ MySQL Shell 8.0.xx (可选，命令行工具)

### 第三步：配置MySQL服务器
1. **服务器配置类型**: 选择 "Development Computer"
2. **端口**: 保持默认 3306
3. **认证方法**: 选择 "Use Strong Password Encryption"

### 第四步：设置root密码
- 设置root用户密码: **root** (或你喜欢的密码)
- 记住这个密码，后面配置时需要用到

### 第五步：配置Windows服务
- ✅ Configure MySQL Server as a Windows Service
- 服务名称: MySQL80 (默认)
- ✅ Start the MySQL Server at System Startup

### 第六步：完成安装
- 点击 "Execute" 执行安装
- 等待安装完成

## 3. 验证安装

安装完成后，打开命令提示符验证：

```cmd
mysql --version
```

应该显示类似：
```
mysql  Ver 8.0.xx for Win64 on x86_64
```

## 4. 连接测试

```cmd
mysql -u root -p
```

输入你设置的root密码，成功连接后会看到：
```
mysql>
```

## 5. 创建项目数据库

在MySQL命令行中执行：
```sql
CREATE DATABASE shixiaoya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

## 6. 更新后端配置

安装完成后，我会帮你更新 `backend/.env` 文件中的数据库配置。

## 常见问题

### Q: 安装过程中提示缺少Visual C++
**A**: 下载并安装 Microsoft Visual C++ Redistributable

### Q: 服务启动失败
**A**: 检查端口3306是否被占用，或以管理员身份重新安装

### Q: 忘记root密码
**A**: 可以通过MySQL安装程序重新配置密码

---

**安装完成后请告诉我，我会帮你启动完整的数据库版本后端服务！**