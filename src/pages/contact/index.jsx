import React, { useState } from 'react'
import { View, Text, Image, Input, Textarea, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState({})

  const handleInput = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入您的电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入正确的邮箱格式'
    }
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 提交表单
    Taro.showLoading({
      title: '提交中...'
    })

    // 模拟提交
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({
        title: '提交成功，我们将尽快与您联系',
        icon: 'success',
        duration: 2000
      })
      // 重置表单
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      })
    }, 1500)
  }

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-8888'
    })
  }

  return (
    <ScrollView className='contact-page' scrollY>
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
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/about/index' })}>关于</View>
          <View className='nav-item active'>联系</View>
        </View>
        <View className='contact-phone'>400-888-8888</View>
      </View>

      {/* 联系信息 */}
      <View className='contact-info-section'>
        <View className='section-title'>联系我们</View>
        <View className='contact-card'>
          <View className='contact-item'>
            <View className='contact-icon'>📞</View>
            <View className='contact-detail'>
              <View className='contact-label'>电话咨询</View>
              <View className='contact-value' onClick={handleCall}>400-888-8888</View>
            </View>
          </View>
          <View className='contact-item'>
            <View className='contact-icon'>✉️</View>
            <View className='contact-detail'>
              <View className='contact-label'>电子邮箱</View>
              <View className='contact-value'>contact@shixiaoya.com</View>
            </View>
          </View>
          <View className='contact-item'>
            <View className='contact-icon'>🏢</View>
            <View className='contact-detail'>
              <View className='contact-label'>公司地址</View>
              <View className='contact-value'>浙江省杭州市余杭区施小雅板材产业园</View>
            </View>
          </View>
          <View className='contact-item'>
            <View className='contact-icon'>🕙</View>
            <View className='contact-detail'>
              <View className='contact-label'>工作时间</View>
              <View className='contact-value'>周一至周五 9:00-18:00</View>
            </View>
          </View>
        </View>
      </View>

      {/* 地图位置 */}
      <View className='map-section'>
        <View className='section-title'>我们的位置</View>
        <View className='map-container'>
          <Image className='map-image' src='../../assets/images/map.jpg' mode='aspectFill' />
          <View className='map-tip'>点击查看详细地图</View>
        </View>
      </View>

      {/* 在线留言 */}
      <View className='message-section'>
        <View className='section-title'>在线留言</View>
        <View className='message-form'>
          <View className='form-item'>
            <View className='form-label'>您的姓名</View>
            <Input 
              className='form-input'
              placeholder='请输入您的姓名'
              value={formData.name}
              onInput={e => handleInput('name', e.detail.value)}
            />
            {errors.name && <View className='form-error'>{errors.name}</View>}
          </View>
          <View className='form-item'>
            <View className='form-label'>联系电话</View>
            <Input 
              className='form-input'
              placeholder='请输入您的联系电话'
              value={formData.phone}
              onInput={e => handleInput('phone', e.detail.value)}
            />
            {errors.phone && <View className='form-error'>{errors.phone}</View>}
          </View>
          <View className='form-item'>
            <View className='form-label'>电子邮箱</View>
            <Input 
              className='form-input'
              placeholder='请输入您的电子邮箱（选填）'
              value={formData.email}
              onInput={e => handleInput('email', e.detail.value)}
            />
            {errors.email && <View className='form-error'>{errors.email}</View>}
          </View>
          <View className='form-item'>
            <View className='form-label'>留言内容</View>
            <Textarea 
              className='form-textarea'
              placeholder='请输入您的留言内容（选填）'
              value={formData.message}
              onInput={e => handleInput('message', e.detail.value)}
            />
          </View>
          <Button className='submit-btn' onClick={handleSubmit}>提交留言</Button>
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

export default Contact
