const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/getstory",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
  app.use(
    "/gettoken",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
};
