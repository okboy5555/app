const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/handle', // 注意，这里填写的是后端接口的路径前缀
    createProxyMiddleware({
      target: 'http://localhost:5000', // 后端服务器地址及端口
      changeOrigin: true,
    })
  );
};