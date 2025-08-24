module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    esnextModules: ['taro-ui'],
    devServer: {
      port: 10087,
      open: true
    },
    webpackChain (chain, webpack) {
      // 修复 devtool 配置，使用兼容的格式
      chain.devtool('cheap-module-source-map')
      // 临时禁用ESLint来解决模块循环依赖问题
      chain.module.rules.delete('eslint')
    }
  }
}
