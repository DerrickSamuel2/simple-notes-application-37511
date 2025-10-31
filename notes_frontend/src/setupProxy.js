/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE || 'http://localhost:3001';
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      logLevel: 'silent'
    })
  );
};
