module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })

    // 指定生产环境相关配置
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      // 在html中嵌入一个 isProduction 变量, 可通过模板语法读取
      config.plugin('html').tap(args => {
        args[0].isProduction = true
        return args
      })

      // 配置CDN加载的包, 属性名为包名, 值为暴露出来的全局变量
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })

    // 指定开发环境相关配置
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProduction = false
        return args
      })
    })
  }
}
