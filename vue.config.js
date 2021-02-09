/*
 * @,@Description: ,: 
 * @,@Version: ,: 1.0.0
 * @,@Author: ,: 仇仰康
 * @,@Date: ,: 2021-02-09 09:26:03
 * @,@LastEditors: ,: 仇仰康
 * @,@LastEditTime: ,: 2021-02-09 14:15:13
 */
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // 代理服务
    devServer: {
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
