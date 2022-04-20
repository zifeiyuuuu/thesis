const path = require('path');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      'element-ui': 'ELEMENT',
      moment: 'moment'
    };
  },
  publicPath: '/', // 公共路徑
  indexPath: 'index.html', // 相對於打包路徑index.html的路徑
  outputDir: process.env.outputDir || 'dist', // 'dist', 生產環境構建文件的目錄
  assetsDir: 'static', // 相對於outputDir的靜態資源(js、css、img、fonts)目錄
  lintOnSave: true, // 是否在開發環境下通過 eslint-loader 在每次保存時 lint 代碼
  runtimeCompiler: true, // 是否使用包含運行時編譯器的 Vue 構建版本
  productionSourceMap: !IS_PROD, // 生產環境的 source map
  parallel: require('os').cpus().length > 1, // 是否為 Babel 或 TypeScript 使用 thread-loader。該選項在系統的 CPU 有多於一個內核時自動啟用，僅作用於生產構建。
  pwa: {}, // 向 PWA 插件傳遞選項。
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修復熱更新失效
    const cdn = {
      css: ['//unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css'],
      js: [
        '//unpkg.com/vue@2.6.11/dist/vue.min.js',
        '//unpkg.com/vue-router@3.2.0/dist/vue-router.min.js',
        '//unpkg.com/vuex@3.4.0/dist/vuex.min.js',
        '//unpkg.com/axios@0.19.2/dist/axios.min.js',
        '//unpkg.com/element-ui@2.13.2/lib/index.js',
        '//unpkg.com/moment@2.27.0/min/moment.min.js',
        '//unpkg.com/moment@2.27.0/min/locales.min.js'
      ]
    };

    // 如果使用多頁面打包，使用vue inspect --plugins查看html是否在結果數組中
    config.plugin('html').tap(args => {
      // html中添加cdn
      args[0].cdn = cdn;
      return args;
    });
    // 添加別名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@base', resolve('src/base'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'));
  },
  css: {
    extract: IS_PROD,
    requireModuleExtension: false,// 去掉文件名中的 .module
    loaderOptions: {
      // 給 less-loader 傳遞 Less.js 相關選項
      less: {
        // `globalVars` 定義全局對象，可加入全局變數
        globalVars: {
          primary: '#333'
        }
      }
    }
  },
  devServer: {
    overlay: { // 讓瀏覽器 overlay 同時顯示警告和錯誤
      warnings: true,
      errors: true
    },
    host: 'localhost',
    port: 8080, // 連接埠號
    https: false, // https:{type:Boolean}
    open: true, // 配置自動啟動瀏覽器
    hotOnly: true // 熱更新
  }
}
