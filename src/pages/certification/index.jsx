import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Certification = () => {
  // 认证列表
  const [certifications] = useState([
    {
      id: 1,
      title: 'E0级环保认证',
      image: '../../assets/images/cert1.jpg',
      type: '国家标准认证',
      code: 'E0级',
      date: '2023-08',
      description: '甲醛释放量≤0.1mg/L，达到国家最高环保标准'
    },
    {
      id: 2,
      title: 'CARB认证',
      image: '../../assets/images/cert2.jpg',
      type: '加州空气资源委员会',
      code: 'P2级',
      date: '2023-06',
      description: '符合加州产品的甲醛释放标准，可出口北美市场'
    },
    {
      id: 3,
      title: 'FSC森林认证',
      image: '../../assets/images/cert3.jpg',
      type: '森林管理委员会',
      code: 'FSC-COC',
      date: '2023-05',
      description: '原材料来源于可持续管理的森林，保护生态环境'
    }
  ])

  // 环保数据
  const [environmentalData] = useState([
    {
      id: 1,
      title: '甲醛释放量',
      national: '≤1.5mg/L',
      e0: '≤0.5mg/L',
      shixiaoya: '0.1mg/L',
      percentage: 93
    },
    {
      id: 2,
      title: '苯释放量',
      national: '≤0.11mg/m³',
      e0: '≤0.06mg/m³',
      shixiaoya: '0.02mg/m³',
      percentage: 97
    },
    {
      id: 3,
      title: '甲苯释放量',
      national: '≤0.20mg/m³',
      e0: '≤0.11mg/m³',
      shixiaoya: '0.03mg/m³',
      percentage: 95
    }
  ])

  // 报告下载
  const [reports] = useState([
    {
      id: 1,
      title: '2023年度环保检测报告',
      description: '包含全年产品环保指标检测数据分析',
      date: '2023-12',
      type: '年度报告',
      size: '2.5MB'
    },
    {
      id: 2,
      title: 'E0级认证检测报告',
      description: '国家权威机构出具的E0级环保认证检测报告',
      date: '2023-08',
      type: '认证报告',
      size: '1.8MB'
    },
    {
      id: 3,
      title: 'CARB认证文件',
      description: '加州空气资源委员会CARB认证完整文件',
      date: '2023-06',
      type: '国际认证',
      size: '3.2MB'
    },
    {
      id: 4,
      title: 'FSC森林认证证书',
      description: '森林管理委员会颁发的认证证书',
      date: '2023-05',
      type: '可持续认证',
      size: '1.2MB'
    }
  ])

  const handleDownload = (id) => {
    Taro.showToast({
      title: '开始下载报告',
      icon: 'success',
      duration: 2000
    })
  }

  return (
    <ScrollView className='certification-page' scrollY>
      {/* 顶部导航 */}
      <View className='header'>
        <View className='logo'>
          <Text className='logo-text'>施小雅板材</Text>
        </View>
        <View className='nav'>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>首页</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/products/index' })}>产品</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/cases/index' })}>案例</View>
          <View className='nav-item active'>认证</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/about/index' })}>关于</View>
          <View className='nav-item' onClick={() => Taro.switchTab({ url: '/pages/contact/index' })}>联系</View>
        </View>
        <View className='contact-phone'>400-888-8888</View>
      </View>

      {/* 环保认证标题 */}
      <View className='page-banner green'>
        <View className='banner-overlay'>
          <Text className='page-title'>环保认证</Text>
          <Text className='page-subtitle'>施小雅板材通过多项国内外环保认证，从原材料采购到生产工艺全程环保把控，为您的健康家居保驾护航</Text>
        </View>
      </View>

      {/* 权威认证 */}
      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>权威认证</Text>
          <Text className='section-desc'>获得国内外多项权威环保认证，品质值得信赖</Text>
        </View>
        
        <View className='certification-list'>
          {certifications.map(cert => (
            <View key={cert.id} className='certification-card'>
              <Image 
                className='certification-image' 
                src={cert.image} 
                mode='aspectFill'
              />
              <View className='certification-info'>
                <Text className='certification-title'>{cert.title}</Text>
                <View className='certification-meta'>
                  <View className='meta-item'>
                    <Text className='meta-label'>认证机构:</Text>
                    <Text className='meta-value'>{cert.type}</Text>
                  </View>
                  <View className='meta-item'>
                    <Text className='meta-label'>认证等级:</Text>
                    <Text className='meta-value'>{cert.code}</Text>
                  </View>
                </View>
                <View className='meta-item'>
                  <Text className='meta-label'>认证日期:</Text>
                  <Text className='meta-value'>{cert.date}</Text>
                </View>
                <Text className='certification-desc'>{cert.description}</Text>
                <View className='certification-footer'>
                  <View className='certification-btn'>查看证书</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 环保数据对比 */}
      <View className='section data-section'>
        <View className='section-header'>
          <Text className='section-title'>环保数据对比</Text>
          <Text className='section-desc'>施小雅板材环保指标远超国家标准，为您提供更健康的家居环境</Text>
        </View>
        
        <View className='data-list'>
          {environmentalData.map(data => (
            <View key={data.id} className='data-card'>
              <Text className='data-title'>{data.title}</Text>
              <View className='data-comparison'>
                <View className='comparison-row'>
                  <View className='comparison-label national'>国家标准</View>
                  <View className='comparison-value national'>{data.national}</View>
                </View>
                <View className='comparison-row'>
                  <View className='comparison-label e0'>E0级标准</View>
                  <View className='comparison-value e0'>{data.e0}</View>
                </View>
                <View className='comparison-row'>
                  <View className='comparison-label shixiaoya'>施小雅产品</View>
                  <View className='comparison-value shixiaoya'>{data.shixiaoya}</View>
                </View>
              </View>
              <View className='data-progress'>
                <Text className='progress-label'>环保程度</Text>
                <View className='progress-bar'>
                  <View className='progress-fill' style={{ width: `${data.percentage}%` }}></View>
                </View>
                <Text className='progress-value'>{data.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 检测报告下载 */}
      <View className='section report-section'>
        <View className='section-header'>
          <Text className='section-title'>检测报告下载</Text>
          <Text className='section-desc'>提供完整的检测报告和认证文件下载，透明公开产品质量信息</Text>
        </View>
        
        <View className='report-list'>
          {reports.map(report => (
            <View key={report.id} className='report-card'>
              <View className='report-icon'>
                <Text className='icon-text'>📄</Text>
              </View>
              <View className='report-info'>
                <Text className='report-title'>{report.title}</Text>
                <Text className='report-desc'>{report.description}</Text>
                <View className='report-meta'>
                  <Text className='meta-date'>{report.date}</Text>
                  <Text className='meta-type'>{report.type}</Text>
                  <Text className='meta-size'>{report.size}</Text>
                </View>
              </View>
              <View className='report-download' onClick={() => handleDownload(report.id)}>
                <Text className='download-icon'>⬇️</Text>
                <Text className='download-text'>下载</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 环保承诺 */}
      <View className='section promise-section'>
        <View className='section-header'>
          <Text className='section-title'>环保承诺</Text>
          <Text className='section-desc'>施小雅板材始终坚持环保先行的理念，为每一个家庭提供健康、安全的板材产品</Text>
        </View>
        
        <View className='promise-content'>
          <View className='promise-paragraph'>
            <Text className='promise-text'>我们承诺所有产品均符合国家E0级环保标准，甲醛释放量远低于国家标准要求，为您打造健康、安全的家居环境。</Text>
          </View>
          <View className='promise-paragraph'>
            <Text className='promise-text'>我们严格控制从原材料采购到生产加工的每一个环节，确保产品质量稳定可靠，让您使用更放心。</Text>
          </View>
          <View className='promise-paragraph'>
            <Text className='promise-text'>我们定期接受第三方权威机构的检测认证，并公开检测报告，保证产品质量透明可查。</Text>
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

export default Certification
