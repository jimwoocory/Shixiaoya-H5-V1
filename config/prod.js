module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    webpackChain (chain) {
      // 修复 devtool 配置问题
      chain.devtool('source-map')
    }
  }
}
