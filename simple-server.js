const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 创建一个简单的HTML页面来展示应用
const createHtml = () => {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>施小雅板材 - 企业展示</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8f5f2;
      color: #333;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #8c6e4a;
    }
    
    .nav {
      display: flex;
      gap: 20px;
    }
    
    .nav-item {
      padding: 10px 20px;
      background: #4a6141;
      color: white;
      border-radius: 5px;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .nav-item:hover {
      background: #8c6e4a;
      transform: translateY(-2px);
    }
    
    .section {
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 28px;
      font-weight: bold;
      color: #4a6141;
      margin-bottom: 20px;
      text-align: center;
      position: relative;
      padding-bottom: 15px;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: #4a6141;
      border-radius: 2px;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .product-card {
      background: #f9f9f9;
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .product-image {
      width: 100%;
      height: 200px;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 18px;
    }
    
    .product-info {
      padding: 20px;
    }
    
    .product-name {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .product-desc {
      font-size: 16px;
      color: #666;
      line-height: 1.5;
    }
    
    .case-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .case-card {
      background: #f9f9f9;
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s;
    }
    
    .case-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .case-image {
      width: 100%;
      height: 200px;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 18px;
    }
    
    .case-info {
      padding: 20px;
    }
    
    .case-title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .case-desc {
      font-size: 16px;
      color: #666;
      line-height: 1.5;
    }
    
    .footer {
      background: #333;
      color: #fff;
      padding: 30px;
      text-align: center;
      border-radius: 10px;
    }
    
    .footer-text {
      margin-bottom: 10px;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
      }
      
      .nav {
        margin-top: 20px;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .product-grid, .case-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo">施小雅板材</div>
      <nav class="nav">
        <a class="nav-item" onclick="showSection('home')">首页</a>
        <a class="nav-item" onclick="showSection('products')">产品</a>
        <a class="nav-item" onclick="showSection('cases')">案例</a>
        <a class="nav-item" onclick="showSection('certification')">认证</a>
        <a class="nav-item" onclick="showSection('about')">关于</a>
        <a class="nav-item" onclick="showSection('contact')">联系</a>
      </nav>
    </header>
    
    <section id="home" class="section">
      <h2 class="section-title">欢迎来到施小雅板材</h2>
      <p style="text-align: center; margin-bottom: 20px;">专注于高品质环保板材的研发与生产</p>
      
      <div class="product-grid">
        <div class="product-card">
          <div class="product-image">实木颗粒板</div>
          <div class="product-info">
            <h3 class="product-name">实木颗粒板</h3>
            <p class="product-desc">采用优质木材颗粒压制而成，环保健康，稳定性好</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">多层实木板</div>
          <div class="product-info">
            <h3 class="product-name">多层实木板</h3>
            <p class="product-desc">多层结构设计，强度高，不易变形，适用于各种家具制作</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">生态免漆板</div>
          <div class="product-info">
            <h3 class="product-name">生态免漆板</h3>
            <p class="product-desc">无需喷漆，表面光滑平整，环保无污染，安装便捷</p>
          </div>
        </div>
      </div>
    </section>
    
    <section id="products" class="section" style="display: none;">
      <h2 class="section-title">产品展示</h2>
      <p style="text-align: center; margin-bottom: 20px;">我们提供多种类型的高品质板材产品</p>
      
      <div class="product-grid">
        <div class="product-card">
          <div class="product-image">实木颗粒板</div>
          <div class="product-info">
            <h3 class="product-name">实木颗粒板</h3>
            <p class="product-desc">采用优质木材颗粒压制而成，环保健康，稳定性好</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">多层实木板</div>
          <div class="product-info">
            <h3 class="product-name">多层实木板</h3>
            <p class="product-desc">多层结构设计，强度高，不易变形，适用于各种家具制作</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">生态免漆板</div>
          <div class="product-info">
            <h3 class="product-name">生态免漆板</h3>
            <p class="product-desc">无需喷漆，表面光滑平整，环保无污染，安装便捷</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">防潮板</div>
          <div class="product-info">
            <h3 class="product-name">防潮板</h3>
            <p class="product-desc">特殊工艺处理，防水防潮效果好，适用于厨卫等潮湿环境</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">阻燃板</div>
          <div class="product-info">
            <h3 class="product-name">阻燃板</h3>
            <p class="product-desc">添加阻燃材料，提高安全性，适用于公共场所和特殊环境</p>
          </div>
        </div>
        <div class="product-card">
          <div class="product-image">医用板材</div>
          <div class="product-info">
            <h3 class="product-name">医用板材</h3>
            <p class="product-desc">符合医疗环境要求，抗菌防霉，易于清洁消毒</p>
          </div>
        </div>
      </div>
    </section>
    
    <section id="cases" class="section" style="display: none;">
      <h2 class="section-title">工程案例</h2>
      <p style="text-align: center; margin-bottom: 20px;">我们的产品广泛应用于各类空间</p>
      
      <div class="case-grid">
        <div class="case-card">
          <div class="case-image">住宅空间</div>
          <div class="case-info">
            <h3 class="case-title">现代简约风格住宅</h3>
            <p class="case-desc">采用我们的实木颗粒板和多层实木板，打造温馨舒适的家居环境</p>
          </div>
        </div>
        <div class="case-card">
          <div class="case-image">商业空间</div>
          <div class="case-info">
            <h3 class="case-title">高端商场展示柜</h3>
            <p class="case-desc">使用我们的生态免漆板，展示效果好，安装便捷</p>
          </div>
        </div>
        <div class="case-card">
          <div class="case-image">办公空间</div>
          <div class="case-info">
            <h3 class="case-title">现代办公室装修</h3>
            <p class="case-desc">采用我们的多层实木板和阻燃板，打造安全舒适的办公环境</p>
          </div>
        </div>
      </div>
    </section>
    
    <section id="certification" class="section" style="display: none;">
      <h2 class="section-title">环保认证</h2>
      <p style="text-align: center; margin-bottom: 20px;">我们的产品通过多项国内外环保认证</p>
      
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h3 style="color: #4a6141; margin-bottom: 10px;">E0级环保认证</h3>
          <p>甲醛释放量≤0.1mg/L，达到国家最高环保标准</p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h3 style="color: #4a6141; margin-bottom: 10px;">CARB认证</h3>
          <p>符合加州空气资源委员会的甲醛释放标准，可出口北美市场</p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h3 style="color: #4a6141; margin-bottom: 10px;">FSC森林认证</h3>
          <p>原材料来源于可持续管理的森林，保护生态环境</p>
        </div>
      </div>
    </section>
    
    <section id="about" class="section" style="display: none;">
      <h2 class="section-title">关于我们</h2>
      <p style="text-align: center; margin-bottom: 20px;">施小雅板材 - 专注环保板材20年</p>
      
      <div style="line-height: 1.8; margin-bottom: 30px;">
        <p style="margin-bottom: 15px;">施小雅板材成立于2003年，是一家专注于环保板材研发、生产和销售的企业。公司位于浙江省杭州市，拥有现代化的生产基地和研发中心。</p>
        <p style="margin-bottom: 15px;">我们始终坚持"环保、创新、品质"的企业理念，致力于为客户提供健康、安全、高品质的板材产品。</p>
        <p>经过多年的发展，施小雅板材已成为行业内知名的板材供应商，产品广泛应用于家居、商业、办公、医疗等多个领域。</p>
      </div>
      
      <h3 style="color: #4a6141; margin-bottom: 15px;">发展历程</h3>
      <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">
        <div style="display: flex; gap: 15px;">
          <div style="min-width: 80px; font-weight: bold;">2003年</div>
          <div>公司成立，开始生产基础板材产品</div>
        </div>
        <div style="display: flex; gap: 15px;">
          <div style="min-width: 80px; font-weight: bold;">2008年</div>
          <div>引进先进生产设备，扩大生产规模</div>
        </div>
        <div style="display: flex; gap: 15px;">
          <div style="min-width: 80px; font-weight: bold;">2013年</div>
          <div>成立研发中心，开发环保板材新产品</div>
        </div>
        <div style="display: flex; gap: 15px;">
          <div style="min-width: 80px; font-weight: bold;">2018年</div>
          <div>获得多项国际环保认证，产品开始出口海外</div>
        </div>
        <div style="display: flex; gap: 15px;">
          <div style="min-width: 80px; font-weight: bold;">2023年</div>
          <div>推出新一代环保板材，引领行业发展</div>
        </div>
      </div>
    </section>
    
    <section id="contact" class="section" style="display: none;">
      <h2 class="section-title">联系我们</h2>
      <p style="text-align: center; margin-bottom: 20px;">期待与您的合作</p>
      
      <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-weight: bold; min-width: 100px;">电话：</div>
          <div>400-888-8888</div>
        </div>
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-weight: bold; min-width: 100px;">邮箱：</div>
          <div>contact@shixiaoya.com</div>
        </div>
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-weight: bold; min-width: 100px;">地址：</div>
          <div>浙江省杭州市余杭区施小雅板材产业园</div>
        </div>
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-weight: bold; min-width: 100px;">工作时间：</div>
          <div>周一至周五 9:00-18:00</div>
        </div>
      </div>
      
      <h3 style="color: #4a6141; margin-bottom: 15px;">在线留言</h3>
      <form style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px;">您的姓名：</label>
          <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" placeholder="请输入您的姓名">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px;">联系电话：</label>
          <input type="tel" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" placeholder="请输入您的联系电话">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px;">电子邮箱：</label>
          <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" placeholder="请输入您的电子邮箱（选填）">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px;">留言内容：</label>
          <textarea style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 150px;" placeholder="请输入您的留言内容"></textarea>
        </div>
        <button type="button" style="background: #4a6141; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">提交留言</button>
      </form>
    </section>
    
    <footer class="footer">
      <p class="footer-text">© 2023 施小雅板材 版权所有</p>
      <p class="footer-text">电话：400-888-8888</p>
    </footer>
  </div>
  
  <script>
    function showSection(sectionId) {
      // 隐藏所有section
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        section.style.display = 'none';
      });
      
      // 显示选中的section
      document.getElementById(sectionId).style.display = 'block';
    }
  </script>
</body>
</html>
  `;
  
  // 将HTML写入文件
  const htmlPath = path.join(__dirname, 'preview-demo.html');
  fs.writeFileSync(htmlPath, html);
  return htmlPath;
};

// 创建HTML文件
const htmlPath = createHtml();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.dirname(htmlPath)));

// 处理所有路由，返回主页面
app.get('*', (req, res) => {
  res.sendFile(htmlPath);
});

app.listen(port, () => {
  console.log(`施小雅板材应用演示运行在 http://localhost:${port}`);
});
