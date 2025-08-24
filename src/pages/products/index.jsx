import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Products = () => {
  const [categories] = useState([
    { id: 1, name: '全部产品', active: true },
    { id: 2, name: '实木颗粒板', active: false },
    { id: 3, name: '多层实木板', active: false },
    { id: 4, name: '生态板', active: false },
    { id: 5, name: '饰面板', active: false },
    { id: 6, name: '医用板材', active: false }
  ])

  const [products] = useState([
    { 
      id: 1, 
      name: '超E0级实木颗粒板', 
      image: 'https://via.placeholder.com/300x200?text=实木颗粒板',
      description: '采用优质木材颗粒，经高温高压制成，具有优异的物理性能和环保特性。',
      specs: {
        thickness: '18mm',
        size: '2440×1220mm',
        density: '650kg/m³'
      },
      price: '¥168/张',
      rating: 4.9,
      tags: ['E0环保', '防潮防霉', '耐打耐磨']
    },
    { 
      id: 2, 
      name: '多层实木板', 
      image: 'https://via.placeholder.com/300x200?text=多层实木板',
      description: '精选优质木材，多层交错排列，具有良好的稳定性和承重能力。',
      specs: {
        thickness: '15mm',
        size: '2440×1220mm',
        layers: '11层'
      },
      price: '¥228/张',
      rating: 4.8,
      tags: ['天然木材', '层次分明', '稳定性好']
    },
    { 
      id: 3, 
      name: '免漆生态板', 
      image: 'https://via.placeholder.com/300x200?text=免漆生态板',
      description: '表面经过特殊处理，无需油漆，花色丰富，安全方便。',
      specs: {
        thickness: '17mm',
        size: '2440×1220mm',
        surface: '三聚氰胺'
      },
      price: '¥198/张',
      rating: 4.7,
      tags: ['免漆处理', '花色丰富', '即装即用']
    },
    { 
      id: 4, 
      name: '天然木饰面板', 
      image: 'https://via.placeholder.com/300x200?text=天然木饰面板',
      description: '天然木皮饰面，纹理清晰自然，质感温润。',
      specs: {
        thickness: '3mm',
        size: '2440×1220mm',
        surface: '天然木皮'
      },
      price: '¥298/张',
      rating: 4.8,
      tags: ['天然木皮', '纹理清晰', '质感温润']
    },
    { 
      id: 5, 
      name: '阻燃板', 
      image: 'https://via.placeholder.com/300x200?text=阻燃板',
      description: '添加阻燃材料，提高安全性，适用于公共场所。',
      specs: {
        thickness: '18mm',
        size: '2440×1220mm',
        fireRating: 'B1级'
      },
      price: '¥258/张',
      rating: 4.8,
      tags: ['阻燃材料', 'B1级防火', '公共场所']
    },
    { 
      id: 6, 
      name: '超厚实木板', 
      image: 'https://via.placeholder.com/300x200?text=超厚实木板',
      description: '超厚设计，承重能力强，适用于重型家具制作。',
      specs: {
        thickness: '25mm',
        size: '2440×1220mm',
        weight: '35kg/张'
      },
      price: '¥428/张',
      rating: 4.9,
      tags: ['超厚设计', '承重能力强', '重型家具']
    }
  ])

  return (
    <ScrollView className='products-page' scrollY>
      <View className='page-header'>
        <Text className='page-title'>产品中心</Text>
        <Text className='page-desc'>
          施小雅板材提供多样化的产品系列，从基础款到高端定制，满足不同家居风格和使用需求，所有产品均通过E0级及以上环保认证
        </Text>
      </View>
      
      <ScrollView className='category-tabs' scrollX>
        {categories.map(category => (
          <View 
            key={category.id} 
            className={`category-tab ${category.active ? 'active' : ''}`}
          >
            {category.name}
          </View>
        ))}
      </ScrollView>
      
      <View className='product-grid'>
        {products.map(product => (
          <View key={product.id} className='product-card'>
            <View className='product-rating'>
              <Text className='rating-icon'>⭐</Text>
              <Text className='rating-value'>{product.rating}</Text>
            </View>
            <View className='product-image'>{product.name}</View>
            <View className='product-info'>
              <Text className='product-name'>{product.name}</Text>
              <Text className='product-desc'>{product.description}</Text>
              
              <View className='product-tags'>
                {product.tags.map((tag, index) => (
                  <Text key={index} className='product-tag'>{tag}</Text>
                ))}
              </View>
              
              <View className='product-specs'>
                <View className='spec-row'>
                  <Text className='spec-label'>厚度:</Text>
                  <Text className='spec-value'>{product.specs.thickness}</Text>
                  <Text className='spec-label'>尺寸:</Text>
                  <Text className='spec-value'>{product.specs.size}</Text>
                </View>
                {product.specs.density && (
                  <View className='spec-row'>
                    <Text className='spec-label'>密度:</Text>
                    <Text className='spec-value'>{product.specs.density}</Text>
                  </View>
                )}
                {product.specs.layers && (
                  <View className='spec-row'>
                    <Text className='spec-label'>层数:</Text>
                    <Text className='spec-value'>{product.specs.layers}</Text>
                  </View>
                )}
              </View>
              
              <View className='product-footer'>
                <Text className='product-price'>{product.price}</Text>
                <View className='product-btn'>咨询</View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 产品优势 */}
      <View className='product-advantages'>
        <Text className='advantages-title'>产品优势</Text>
        <Text className='advantages-desc'>施小雅板材的核心优势</Text>
        
        <View className='advantages-grid'>
          <View className='advantage-item'>
            <View className='advantage-icon'>🔬</View>
            <Text className='advantage-title'>环保健康</Text>
            <Text className='advantage-desc'>E0级环保标准，甲醛释放量≤0.1mg/L</Text>
          </View>
          <View className='advantage-item'>
            <View className='advantage-icon'>🏭</View>
            <Text className='advantage-title'>品质保证</Text>
            <Text className='advantage-desc'>严格把控，每批产品都有质量检测报告</Text>
          </View>
          <View className='advantage-item'>
            <View className='advantage-icon'>🏆</View>
            <Text className='advantage-title'>权威认证</Text>
            <Text className='advantage-desc'>通过CARB、FSC等国际权威认证</Text>
          </View>
          <View className='advantage-item'>
            <View className='advantage-icon'>⭐</View>
            <Text className='advantage-title'>客户好评</Text>
            <Text className='advantage-desc'>50万+家庭选择，客户满意度98%+</Text>
          </View>
        </View>
      </View>

      {/* 咨询区域 */}
      <View className='consultation-section'>
        <Text className='consultation-title'>需要更多产品信息?</Text>
        <Text className='consultation-desc'>我们的专业团队将为您提供详细的产品咨询和选择建议</Text>
        <View className='consultation-btn'>免费咨询</View>
      </View>
    </ScrollView>
  )
}

export default Products