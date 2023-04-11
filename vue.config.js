const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 4321,
    compress: true,
    allowedHosts: "all",
  }
})
