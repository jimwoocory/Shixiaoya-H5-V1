# 施小雅板材系统 - Supabase完全迁移方案

## 🎯 迁移概述

从 `Node.js + Express + MySQL` 完全迁移到 `Taro + Supabase`

### 迁移优势
- ✅ 无需维护服务器和数据库
- ✅ 自动扩容和高可用
- ✅ 内置实时功能
- ✅ 强大的认证系统
- ✅ 文件存储和CDN
- ✅ 自动生成API

## 📊 数据库迁移

### 1. Supabase数据表结构

```sql
-- 用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  openid VARCHAR(100) UNIQUE,
  unionid VARCHAR(100) UNIQUE,
  nickname VARCHAR(50) NOT NULL,
  avatar TEXT,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(100) UNIQUE,
  user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'vip', 'admin')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  last_login_at TIMESTAMPTZ,
  company_name VARCHAR(100),
  position VARCHAR(50),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分类表
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id INTEGER REFERENCES categories(id),
  level INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 应用场景表
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 产品表
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  images JSONB,
  specifications JSONB,
  tags JSONB,
  price DECIMAL(10,2),
  price_unit VARCHAR(20) DEFAULT '张',
  rating DECIMAL(3,2) DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  is_hot BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  seo_title VARCHAR(200),
  seo_keywords VARCHAR(500),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 产品应用场景关联表
CREATE TABLE product_applications (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, application_id)
);

-- 询价表
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100),
  company_name VARCHAR(100),
  product_ids JSONB,
  requirements TEXT,
  quantity INTEGER,
  budget DECIMAL(12,2),
  urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  source VARCHAR(20) DEFAULT 'web' CHECK (source IN ('web', 'wechat', 'phone', 'other')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'quoted', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES users(id),
  quoted_price DECIMAL(12,2),
  quoted_at TIMESTAMPTZ,
  notes TEXT,
  follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 案例表
CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  client_name VARCHAR(100),
  project_type VARCHAR(20) NOT NULL CHECK (project_type IN ('residential', 'commercial', 'office', 'hotel', 'other')),
  project_area DECIMAL(10,2),
  project_location VARCHAR(200),
  completed_at TIMESTAMPTZ,
  images JSONB,
  before_images JSONB,
  after_images JSONB,
  features JSONB,
  challenges TEXT,
  solutions TEXT,
  results TEXT,
  testimonial TEXT,
  view_count INTEGER DEFAULT 0,
  is_hot BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title VARCHAR(200),
  seo_keywords VARCHAR(500),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 认证表
CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  issuer VARCHAR(100) NOT NULL,
  certificate_number VARCHAR(100),
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  certificate_image TEXT,
  category VARCHAR(20) NOT NULL CHECK (category IN ('quality', 'environmental', 'safety', 'management', 'other')),
  level VARCHAR(50),
  scope TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. 行级安全策略 (RLS)

```sql
-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的数据
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 产品对所有人可见
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- 管理员可以管理产品
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- 用户可以查看自己的询价
CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT USING (user_id = auth.uid());

-- 用户可以创建询价
CREATE POLICY "Users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 管理员可以查看所有询价
CREATE POLICY "Admins can view all inquiries" ON inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
```

## 🔧 前端集成代码

### 1. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 2. Supabase配置

```javascript
// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwfmwngjjfecrjdbyghh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Zm13bmdqamZlY3JqZGJ5Z2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Njc2OTYsImV4cCI6MjA3MTU0MzY5Nn0.dxgOP1c3sPh8rE0P1aaehN7ZsxyurszHZ-8GMmlgvD4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库操作封装
export const db = {
  // 产品相关
  async getProducts(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        applications:product_applications(
          application:applications(*)
        )
      `)
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters.isHot) {
      query = query.eq('is_hot', true)
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        applications:product_applications(
          application:applications(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    
    // 增加浏览次数
    await supabase
      .from('products')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id)

    return data
  },

  // 分类相关
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  // 应用场景相关
  async getApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  // 询价相关
  async createInquiry(inquiryData) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        ...inquiryData,
        user_id: supabase.auth.user()?.id
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  async getInquiries() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateInquiryStatus(id, status) {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // 案例相关
  async getCases(filters = {}) {
    let query = supabase
      .from('cases')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })

    if (filters.projectType) {
      query = query.eq('project_type', filters.projectType)
    }

    if (filters.isFeatured) {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // 认证相关
  async getCertifications() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('status', 'active')
      .eq('is_valid', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  }
}

// 认证相关
export const auth = {
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 微信登录
  async signInWithWechat() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'wechat'
    })
    if (error) throw error
    return data
  }
}

// 文件上传
export const storage = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)

    if (error) throw error
    return data
  },

  async getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }
}

// 实时订阅
export const realtime = {
  subscribeToInquiries(callback) {
    return supabase
      .channel('inquiries')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'inquiries' },
        callback
      )
      .subscribe()
  },

  subscribeToProducts(callback) {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        callback
      )
      .subscribe()
  }
}
```

### 3. 更新产品页面

```javascript
// src/pages/products/index.jsx
import { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { db } from '../../utils/supabase'
import './index.scss'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    categoryId: '',
    applicationId: '',
    search: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData, applicationsData] = await Promise.all([
        db.getProducts(filters),
        db.getCategories(),
        db.getApplications()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      setApplications(applicationsData)
    } catch (error) {
      console.error('加载数据失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = async (categoryId) => {
    setFilters({ ...filters, categoryId })
    try {
      const productsData = await db.getProducts({ ...filters, categoryId })
      setProducts(productsData)
    } catch (error) {
      console.error('筛选失败:', error)
    }
  }

  const handleProductClick = (product) => {
    Taro.navigateTo({
      url: `/pages/product-detail/index?id=${product.id}`
    })
  }

  const handleInquiry = (product) => {
    Taro.navigateTo({
      url: `/pages/inquiry/index?productId=${product.id}`
    })
  }

  if (loading) {
    return (
      <View className="products-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  return (
    <View className="products-page">
      {/* 分类筛选 */}
      <View className="category-filter">
        <View className="filter-title">产品分类</View>
        <View className="filter-list">
          <View 
            className={`filter-item ${!filters.categoryId ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('')}
          >
            全部
          </View>
          {categories.map(category => (
            <View 
              key={category.id}
              className={`filter-item ${filters.categoryId === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category.id)}
            >
              {category.name}
            </View>
          ))}
        </View>
      </View>

      {/* 应用场景筛选 */}
      <View className="application-filter">
        <View className="filter-title">应用场景</View>
        <View className="application-list">
          {applications.map(app => (
            <View key={app.id} className="application-item">
              <View className="app-name">{app.name}</View>
              <View className="app-desc">{app.description}</View>
            </View>
          ))}
        </View>
      </View>

      {/* 产品列表 */}
      <View className="products-list">
        {products.map(product => (
          <View key={product.id} className="product-card">
            <View className="product-image" onClick={() => handleProductClick(product)}>
              {product.images && product.images[0] && (
                <Image 
                  src={product.images[0]} 
                  mode="aspectFill"
                  className="image"
                />
              )}
              {product.is_hot && <View className="hot-badge">热门</View>}
              {product.is_new && <View className="new-badge">新品</View>}
            </View>
            
            <View className="product-info">
              <View className="product-name" onClick={() => handleProductClick(product)}>
                {product.name}
              </View>
              <View className="product-desc">{product.description}</View>
              
              <View className="product-specs">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <View key={key} className="spec-item">
                    <Text className="spec-label">{key}:</Text>
                    <Text className="spec-value">{value}</Text>
                  </View>
                ))}
              </View>

              <View className="product-applications">
                <View className="app-title">适用场景:</View>
                <View className="app-tags">
                  {product.applications?.map(item => (
                    <View key={item.application.id} className="app-tag">
                      {item.application.name}
                    </View>
                  ))}
                </View>
              </View>

              <View className="product-footer">
                <View className="price-info">
                  {product.price && (
                    <View className="price">
                      ¥{product.price}/{product.price_unit}
                    </View>
                  )}
                  <View className="rating">
                    评分: {product.rating}/5.0
                  </View>
                </View>
                
                <View className="action-buttons">
                  <Button 
                    className="inquiry-btn"
                    onClick={() => handleInquiry(product)}
                  >
                    立即询价
                  </Button>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {products.length === 0 && (
        <View className="empty-state">
          <View className="empty-text">暂无产品数据</View>
        </View>
      )}
    </View>
  )
}
```

### 4. 询价页面

```javascript
// src/pages/inquiry/index.jsx
import { useState, useEffect } from 'react'
import { View, Form, Input, Textarea, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { db, auth } from '../../utils/supabase'

export default function Inquiry() {
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyName: '',
    requirements: '',
    quantity: '',
    budget: '',
    urgency: 'medium'
  })
  const [productId, setProductId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router.params
    if (id) {
      setProductId(id)
    }
  }, [])

  const handleSubmit = async () => {
    if (!formData.contactName || !formData.contactPhone || !formData.requirements) {
      Taro.showToast({
        title: '请填写必填信息',
        icon: 'error'
      })
      return
    }

    try {
      setLoading(true)
      
      const inquiryData = {
        ...formData,
        product_ids: productId ? [parseInt(productId)] : [],
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null
      }

      await db.createInquiry(inquiryData)
      
      Taro.showToast({
        title: '提交成功',
        icon: 'success'
      })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('提交失败:', error)
      Taro.showToast({
        title: '提交失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  return (
    <View className="inquiry-page">
      <Form>
        <View className="form-section">
          <View className="section-title">联系信息</View>
          
          <View className="form-item">
            <View className="label required">联系人姓名</View>
            <Input
              placeholder="请输入您的姓名"
              value={formData.contactName}
              onInput={(e) => handleInputChange('contactName', e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="label required">联系电话</View>
            <Input
              placeholder="请输入您的手机号"
              type="number"
              value={formData.contactPhone}
              onInput={(e) => handleInputChange('contactPhone', e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="label">联系邮箱</View>
            <Input
              placeholder="请输入您的邮箱"
              value={formData.contactEmail}
              onInput={(e) => handleInputChange('contactEmail', e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="label">公司名称</View>
            <Input
              placeholder="请输入公司名称"
              value={formData.companyName}
              onInput={(e) => handleInputChange('companyName', e.detail.value)}
            />
          </View>
        </View>

        <View className="form-section">
          <View className="section-title">需求信息</View>
          
          <View className="form-item">
            <View className="label required">具体需求</View>
            <Textarea
              placeholder="请详细描述您的需求"
              value={formData.requirements}
              onInput={(e) => handleInputChange('requirements', e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="label">预计数量</View>
            <Input
              placeholder="请输入预计数量"
              type="number"
              value={formData.quantity}
              onInput={(e) => handleInputChange('quantity', e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="label">预算范围</View>
            <Input
              placeholder="请输入预算金额"
              type="digit"
              value={formData.budget}
              onInput={(e) => handleInputChange('budget', e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="label">紧急程度</View>
            <Picker
              mode="selector"
              range={['低', '中等', '高', '紧急']}
              value={['low', 'medium', 'high', 'urgent'].indexOf(formData.urgency)}
              onChange={(e) => {
                const urgencyValues = ['low', 'medium', 'high', 'urgent']
                handleInputChange('urgency', urgencyValues[e.detail.value])
              }}
            >
              <View className="picker-value">
                {formData.urgency === 'low' && '低'}
                {formData.urgency === 'medium' && '中等'}
                {formData.urgency === 'high' && '高'}
                {formData.urgency === 'urgent' && '紧急'}
              </View>
            </Picker>
          </View>
        </View>

        <View className="submit-section">
          <Button
            className="submit-btn"
            loading={loading}
            onClick={handleSubmit}
          >
            提交询价
          </Button>
        </View>
      </Form>
    </View>
  )
}
```

## 🚀 部署步骤

### 1. 创建Supabase项目
1. 访问 https://supabase.com
2. 创建新项目
3. 获取项目URL和API密钥

### 2. 设置数据库
1. 在Supabase SQL编辑器中执行上述SQL脚本
2. 配置行级安全策略
3. 创建存储桶用于文件上传

### 3. 更新前端配置
1. 安装Supabase客户端
2. 更新配置文件
3. 替换所有API调用

### 4. 数据迁移
1. 导出MySQL数据
2. 转换为PostgreSQL格式
3. 导入到Supabase

## 📋 迁移检查清单

- [ ] Supabase项目创建完成
- [ ] 数据库表结构创建完成
- [ ] 行级安全策略配置完成
- [ ] 前端Supabase客户端集成完成
- [ ] 产品页面迁移完成
- [ ] 询价功能迁移完成
- [ ] 用户认证迁移完成
- [ ] 文件上传功能迁移完成
- [ ] 实时功能配置完成
- [ ] 数据迁移完成
- [ ] 测试所有功能正常
- [ ] 停用旧的Node.js服务器

## 🎯 迁移后的优势

1. **无服务器架构** - 无需维护服务器
2. **自动扩容** - 根据流量自动调整
3. **实时功能** - 询价实时通知
4. **强大认证** - 内置用户管理
5. **文件存储** - CDN加速的文件服务
6. **成本优化** - 按使用量付费