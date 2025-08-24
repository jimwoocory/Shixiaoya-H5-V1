import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Cases = () => {
  // 案例分类
  const [categories] = useState([
    { id: 1, name: '全部案例', active: true },
    { id: 2, name: '住宅空间', active: false },
    { id: 3, name: '商业空间', active: false },
    { id: 4, name: '办公空间', active: false },
    { id: 5, name: '酒店空间', active: false }
  ])

  // 案例列表
  const [cases] = useState([
    {
      id: 1,
      categoryId: 2,
      title: '现代简约别墅',
      image: 'https://via.placeholder.com/300x200?text=现代简约别墅',
      location: '上海浦东',
      area: '280㎡',
      date: '2023-10',
      designer: '张先生',
      description: '采用施小雅E0级生态板，打造现代简约风格别墅，注重环保与美观的完美结合。',
      tags: ['E0级生态板', '多层实木', '天然木皮饰面板'],
      testimonial: '施小雅板材打造的家非常好，环保无异味，质量也很好，非常满意。'
    },
    {
      id: 2,
      categoryId: 2,
      title: '北欧风格公寓',
      image: 'https://via.placeholder.com/300x200?text=北欧风格公寓',
      location: '北京朝阳',
      area: '120㎡',
      date: '2023-09',
      designer: '李女士',
      description: '北欧风格设计，大量使用施小雅实木颗粒板，营造温馨自然的居住环境。',
      tags: ['实木颗粒板', '免漆生态板'],
      testimonial: '施小雅的板材环保性很好，使用后家里没有异味，很满意。'
    },
    {
      id: 3,
      categoryId: 3,
      title: '精品咖啡厅',
      image: 'https://via.placeholder.com/300x200?text=精品咖啡厅',
      location: '深圳南山',
      area: '180㎡',
      date: '2023-08',
      designer: '王设计师',
      description: '商业空间设计，使用施小雅板材，满足全方位的时尚需求与环境和谐的空间氛围。',
      tags: ['饰面板材', '天然木皮饰面板', '多层实木板'],
      testimonial: '施小雅的板材质量很好，经过了多次改造依然如新，很耐用。'
    },
    {
      id: 4,
      categoryId: 4,
      title: '现代办公空间',
      image: 'https://via.placeholder.com/300x200?text=现代办公空间',
      location: '广州天河',
      area: '500㎡',
      date: '2023-07',
      designer: '刘设计师',
      description: '现代简约办公空间，使用施小雅环保板材，打造健康舒适的工作环境。',
      tags: ['E0级生态板', '防火板', '多层实木板'],
      testimonial: '员工们都很喜欢新的办公环境，施小雅的板材环保无异味，很适合办公场所。'
    },
    {
      id: 5,
      categoryId: 5,
      title: '精品酒店客房',
      image: 'https://via.placeholder.com/300x200?text=精品酒店客房',
      location: '杭州西湖',
      area: '40㎡/间',
      date: '2023-06',
      designer: '陈设计师',
      description: '精品酒店客房设计，使用施小雅高端板材，打造舒适奢华的住宿体验。',
      tags: ['高端饰面板', '防潮板', '阻燃板'],
      testimonial: '客人对我们酒店的装修风格赞不绝口，施小雅的板材质感很好，很有质感。'
    },
    {
      id: 6,
      categoryId: 2,
      title: '日式风格住宅',
      image: 'https://via.placeholder.com/300x200?text=日式风格住宅',
      location: '苏州园区',
      area: '150㎡',
      date: '2023-05',
      designer: '吴设计师',
      description: '日式简约风格，大量使用施小雅原木色板材，营造自然、禅意的居住空间。',
      tags: ['原木板', '实木颗粒板', '免漆板'],
      testimonial: '施小雅的板材质感非常好，很符合我们想要的日式风格，非常满意。'
    },
    {
      id: 7,
      categoryId: 3,
      title: '时尚服装店',
      image: 'https://via.placeholder.com/300x200?text=时尚服装店',
      location: '上海静安',
      area: '120㎡',
      date: '2023-04',
      designer: '林设计师',
      description: '时尚服装店设计，使用施小雅高端饰面板，打造独特的品牌形象和购物体验。',
      tags: ['高端饰面板', '定制板材', '防潮板'],
      testimonial: '施小雅的板材质感和颜色都很好，很符合我们品牌的调性，顾客反馈也很好。'
    }
  ])

  const [currentCategory, setCurrentCategory] = useState(1)
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(3) // 每页显示3个案例

  const handleCategoryClick = (categoryId) => {
    setCurrentCategory(categoryId)
    setCurrentPage(1) // 切换分类时重置页码
    // 更新分类激活状态
    const updatedCategories = categories.map(cat => ({
      ...cat,
      active: cat.id === categoryId
    }))
  }

  const handleCaseClick = (id) => {
    Taro.navigateTo({
      url: `/pages/cases/detail?id=${id}`
    })
  }

  // 根据当前分类筛选案例，如果是"全部案例"则显示所有案例
  const allFilteredCases = currentCategory === 1 ? cases : cases.filter(item => item.categoryId === currentCategory)
  
  // 计算总页数
  const totalPages = Math.ceil(allFilteredCases.length / pageSize)
  
  // 获取当前页的案例
  const filteredCases = allFilteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  
  // 页面切换
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // 滚动到页面顶部
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }

  return (
    <ScrollView className='cases-page' scrollY>
      {/* 顶部导航 */}
      <View className='header'>
        <View className='logo'>
          <Text className='logo-text'>施小雅板材</Text>
        </View>
        <View className='nav'>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>首页</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/products/index' })}>产品</View>
          <View className='nav-item active'>案例</View>
          <View className='nav-item' onClick={() => Taro.navigateTo({ url: '/pages/certification/index' })}>认证</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/about/index' })}>关于</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/contact/index' })}>联系</View>
        </View>
        <View className='contact-phone'>400-888-8888</View>
      </View>

      {/* 案例展示标题 */}
      <View className='page-banner'>
        <View className='banner-overlay'>
          <Text className='page-title'>案例展示</Text>
          <Text className='page-subtitle'>精选施小雅板材应用案例，涵盖住宅、商业、办公等多种空间类型，展现板材在不同场景下的卓越表现和客户满意度</Text>
        </View>
      </View>

      {/* 案例分类 */}
      <View className='category-container'>
        <ScrollView className='category-tabs' scrollX>
          {categories.map(category => (
            <View 
              key={category.id} 
              className={`category-tab ${category.active ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 案例列表 */}
      <View className='case-list'>
        {filteredCases.map(item => (
          <View key={item.id} className='case-card' onClick={() => handleCaseClick(item.id)}>
            <View className='case-rating'>
              <Text className='rating-icon'>⭐</Text>
              <Text className='rating-value'>4.9</Text>
            </View>
            <Image 
              className='case-image' 
              src={item.image} 
              mode='aspectFill'
            />
            <View className='case-info'>
              <Text className='case-title'>{item.title}</Text>
              <View className='case-meta'>
                <View className='meta-item'>
                  <Text className='meta-icon'>📍</Text>
                  <Text className='meta-text'>{item.location}</Text>
                </View>
                <View className='meta-item'>
                  <Text className='meta-icon'>📐</Text>
                  <Text className='meta-text'>{item.area}</Text>
                </View>
              </View>
              <View className='case-meta'>
                <View className='meta-item'>
                  <Text className='meta-icon'>📅</Text>
                  <Text className='meta-text'>{item.date}</Text>
                </View>
                <View className='meta-item'>
                  <Text className='meta-icon'>👤</Text>
                  <Text className='meta-text'>{item.designer}</Text>
                </View>
              </View>
              <Text className='case-desc'>{item.description}</Text>
              <View className='case-tags'>
                {item.tags.map((tag, index) => (
                  <Text key={index} className='case-tag'>{tag}</Text>
                ))}
              </View>
              <View className='case-testimonial'>
                <Text className='testimonial-icon'>💬</Text>
                <Text className='testimonial-text'>{item.testimonial}</Text>
              </View>
              <View className='case-footer'>
                <View className='case-btn'>查看详情</View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <View className='pagination'>
          <View 
            className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            上一页
          </View>
          
          <View className='page-numbers'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <View 
                key={page} 
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </View>
            ))}
          </View>
          
          <View 
            className={`page-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          >
            下一页
          </View>
        </View>
      )}

      {/* 咨询区域 */}
      <View className='section contact-section'>
        <View className='section-header'>
          <Text className='section-title'>想要打造您的理想空间?</Text>
          <Text className='section-desc'>联系我们的设计团队，为您提供专业的板材选择和空间设计建议</Text>
        </View>
        
        <View className='contact-buttons'>
          <View className='contact-btn primary'>免费设计咨询</View>
          <View className='contact-btn secondary'>了解更多</View>
        </View>
      </View>

      {/* 页脚 */}
      <View className='footer'>
        <View className='footer-content'>
          <Text className='footer-text'>© 2023 施小雅板材 版权所有</Text>
          <Text className='footer-text'>电话：400-888-8888</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Cases