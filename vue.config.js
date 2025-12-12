const { defineConfig } = require('@vue/cli-service');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = defineConfig({
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: "all",    // 鍏佽鎵€鏈変富鏈鸿闂紙Vue CLI 3+锛?    hot: false,
    liveReload: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
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
