import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'

const Index = () => {
  return (
    <ScrollView className='index-page' scrollY>
      {/* 顶部导航 */}
      <View className='header'>
        <View className='logo'>
          <Text className='logo-text'>施小雅板材</Text>
        </View>
        <View className='contact-phone'>400-888-8888</View>
      </View>

      {/* 主视觉区域 - 黑色背景 */}
      <View className='banner'>
        <View className='banner-content'>
          <Text className='banner-title'>施小雅板材</Text>
          <Text className='banner-subtitle'>源自自然，匠心打造</Text>
          <Text className='banner-desc'>为您的家增添温馨与品质</Text>
          <View className='banner-btn'>了解更多</View>
        </View>
      </View>

      {/* 公司介绍区域 */}
      <View className='company-intro'>
        <Text className='intro-title'>施小雅板材</Text>
        <Text className='intro-desc'>
          专注于环保板材研发与生产，致力于为每个家庭提供健康、优质的装修材料。我们坚持"环保先行，品质为本"的理念，用匠心打造每一块板材。
        </Text>
        
        <View className='stats-grid'>
          <View className='stat-item'>
            <View className='stat-icon'>📊</View>
            <Text className='stat-number'>6+</Text>
            <Text className='stat-label'>产品系列</Text>
          </View>
          <View className='stat-item'>
            <View className='stat-icon'>👥</View>
            <Text className='stat-number'>120+</Text>
            <Text className='stat-label'>城市覆盖</Text>
          </View>
          <View className='stat-item'>
            <View className='stat-icon'>⭐</View>
            <Text className='stat-number'>50000+</Text>
            <Text className='stat-label'>家庭选择</Text>
          </View>
          <View className='stat-item'>
            <View className='stat-icon'>🏆</View>
            <Text className='stat-number'>15+</Text>
            <Text className='stat-label'>行业认证</Text>
          </View>
        </View>
      </View>

      {/* 产品优势 */}
      <View className='advantages-section'>
        <View className='section-header'>
          <Text className='section-title'>产品优势</Text>
          <Text className='section-desc'>施小雅板材的核心竞争优势</Text>
        </View>
        
        <View className='advantages-grid'>
          <View className='advantage-card'>
            <View className='advantage-icon'>🌿</View>
            <Text className='advantage-title'>环保先行</Text>
            <Text className='advantage-desc'>严格执行E0级环保标准，为家人健康保驾护航</Text>
          </View>
          <View className='advantage-card'>
            <View className='advantage-icon'>🏆</View>
            <Text className='advantage-title'>品质为本</Text>
            <Text className='advantage-desc'>精选优质原材料，每一块板材都经过严格质检</Text>
          </View>
          <View className='advantage-card'>
            <View className='advantage-icon'>👥</View>
            <Text className='advantage-title'>服务至上</Text>
            <Text className='advantage-desc'>专业团队全程服务，让您的装修无忧无虑</Text>
          </View>
          <View className='advantage-card'>
            <View className='advantage-icon'>🔬</View>
            <Text className='advantage-title'>创新发展</Text>
            <Text className='advantage-desc'>持续技术创新，引领行业发展新趋势</Text>
          </View>
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

export default Index