export default {
  pages: [
    'pages/index/index',
    'pages/products/index',
    'pages/cases/index',
    'pages/certification/index',
    'pages/about/index',
    'pages/contact/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4a6141',
    navigationBarTitleText: '施小雅板材',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#4a6141',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/products/index',
        text: '产品'
      },
      {
        pagePath: 'pages/cases/index',
        text: '案例'
      },
      {
        pagePath: 'pages/about/index',
        text: '关于'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系'
      }
    ]
  }
}