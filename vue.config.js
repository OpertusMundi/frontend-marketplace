module.exports = {
  publicPath: '/',
  assetsDir: 'assets',
  devServer: {
    port: 8080,
    proxy: process.env.NODE_ENV === 'development' ? {
      '^/action': {
        target: process.env.VUE_APP_API_GATEWAY_URL,
        ws: true,
        changeOrigin: true,
      },
    } : null,
  },
};
