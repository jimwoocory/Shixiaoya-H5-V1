import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const About = () => {
  return (
    <ScrollView className='about-page' scrollY>
      {/* 顶部导航 */}
      <View className='header'>
        <View className='logo'>
          <Text className='logo-text'>施小雅板材</Text>
        </View>
        <View className='nav'>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>首页</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/products/index' })}>产品</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/cases/index' })}>案例</View>
          <View className='nav-item' onClick={() => Taro.navigateTo({ url: '/pages/certification/index' })}>认证</View>
          <View className='nav-item active'>关于</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/contact/index' })}>联系</View>
        </View>
        <View className='contact-phone'>400-888-8888</View>
      </View>

      {/* 公司简介 */}
      <View className='company-section'>
        <View className='section-title'>关于我们</View>
        <Image className='company-image' src='../../assets/images/company.jpg' mode='aspectFill' />
        <View className='company-content'>
          <View className='content-title'>施小雅板材</View>
          <View className='content-text'>
            施小雅板材成立于2005年，是一家专注于高品质木质板材研发、生产和销售的企业。
            公司位于浙江省杭州市余杭区，拥有现代化的生产基地和专业的研发团队。
          </View>
          <View className='content-text'>
            多年来，我们始终秉承"源自自然，匠心打造"的理念，致力于为客户提供环保、健康、美观的板材产品。
            我们的产品广泛应用于家具制造、室内装修等领域，以卓越的品质和完善的服务赢得了广大客户的信赖。
          </View>
        </View>
      </View>

      {/* 企业文化 */}
      <View className='culture-section'>
        <View className='section-title'>企业文化</View>
        <View className='culture-list'>
          <View className='culture-item'>
            <View className='culture-icon'>🌟</View>
            <View className='culture-name'>企业愿景</View>
            <View className='culture-desc'>成为中国领先的环保板材供应商，为人们创造健康、美好的生活空间</View>
          </View>
          <View className='culture-item'>
            <View className='culture-icon'>🎯</View>
            <View className='culture-name'>企业使命</View>
            <View className='culture-desc'>提供优质环保的板材产品，满足客户对美好生活的向往</View>
          </View>
          <View className='culture-item'>
            <View className='culture-icon'>💎</View>
            <View className='culture-name'>核心价值观</View>
            <View className='culture-desc'>诚信、创新、品质、责任</View>
          </View>
        </View>
      </View>

      {/* 发展历程 */}
      <View className='history-section'>
        <View className='section-title'>发展历程</View>
        <View className='history-list'>
          <View className='history-item'>
            <View className='history-year'>2005年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-line'></View>
              <View className='history-text'>施小雅板材正式成立，开始生产实木板材</View>
            </View>
          </View>
          <View className='history-item'>
            <View className='history-year'>2008年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-line'></View>
              <View className='history-text'>扩大生产规模，增加多层板生产线</View>
            </View>
          </View>
          <View className='history-item'>
            <View className='history-year'>2012年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-line'></View>
              <View className='history-text'>获得ISO9001质量管理体系认证</View>
            </View>
          </View>
          <View className='history-item'>
            <View className='history-year'>2015年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-line'></View>
              <View className='history-text'>引进国际先进生产设备，提升产品品质</View>
            </View>
          </View>
          <View className='history-item'>
            <View className='history-year'>2018年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-line'></View>
              <View className='history-text'>获得环保认证，推出生态板系列产品</View>
            </View>
          </View>
          <View className='history-item'>
            <View className='history-year'>2020年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-line'></View>
              <View className='history-text'>成立研发中心，加强产品创新</View>
            </View>
          </View>
          <View className='history-item'>
            <View className='history-year'>2023年</View>
            <View className='history-content'>
              <View className='history-dot'></View>
              <View className='history-text'>销售网络覆盖全国，开始拓展国际市场</View>
            </View>
          </View>
        </View>
      </View>

      {/* 荣誉资质 */}
      <View className='honor-section'>
        <View className='section-title'>荣誉资质</View>
        <View className='honor-list'>
          <View className='honor-item'>
            <Image className='honor-image' src='../../assets/images/honor1.jpg' mode='aspectFill' />
            <View className='honor-name'>ISO9001认证</View>
          </View>
          <View className='honor-item'>
            <Image className='honor-image' src='../../assets/images/honor2.jpg' mode='aspectFill' />
            <View className='honor-name'>环保认证</View>
          </View>
          <View className='honor-item'>
            <Image className='honor-image' src='../../assets/images/honor3.jpg' mode='aspectFill' />
            <View className='honor-name'>质量金奖</View>
          </View>
          <View className='honor-item'>
            <Image className='honor-image' src='../../assets/images/honor4.jpg' mode='aspectFill' />
            <View className='honor-name'>行业贡献奖</View>
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

export default About
