const { defineConfig } = require('@vue/cli-service');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = defineConfig({
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: "all",    // 允许所有主机访问（Vue CLI 3+）
    hot: false,
    liveReload: false
  },
  transpileDependencies: true,
  css: {
    extract: true
  },
  configureWebpack: {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[name].[contenthash].css'
      })
    ],
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js'
    }
  }
})
