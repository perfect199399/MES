/*
 * @,@Description: ,: 
 * @,@Version: ,: 1.0.0
 * @,@Author: ,: 仇仰康
 * @,@Date: ,: 2021-02-09 09:26:03
 * @,@LastEditors: ,: 仇仰康
 * @,@LastEditTime: ,: 2021-02-09 09:50:19
 */
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // 服务代理
    devServer: {
      open: true,
      port:8080, // 自定义修改8080端口
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}
