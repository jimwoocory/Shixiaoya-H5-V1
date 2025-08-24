# 图标文件说明

本目录用于存放应用的图标文件，主要用于底部导航栏。

## 需要创建的图标文件

请在此目录下添加以下图标文件：

1. `home.png` 和 `home-active.png` - 首页图标（默认和激活状态）
2. `product.png` 和 `product-active.png` - 产品图标（默认和激活状态）
3. `case.png` 和 `case-active.png` - 案例图标（默认和激活状态）
4. `about.png` 和 `about-active.png` - 关于图标（默认和激活状态）
5. `contact.png` 和 `contact-active.png` - 联系图标（默认和激活状态）

## 图标规格

- 建议尺寸：48x48 像素
- 格式：PNG（透明背景）
- 默认颜色：灰色 (#999)
- 激活颜色：木绿色 (#4a6141)

## 临时解决方案

在没有图标的情况下，可以暂时修改 `app.config.js` 文件，移除 `iconPath` 和 `selectedIconPath` 属性，这样底部导航栏将只显示文字。