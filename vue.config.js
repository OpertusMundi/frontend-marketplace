module.exports = {
  // Move all assets under a single directory
  assetsDir: 'assets',
  // Update output directory for production build to add static assets to the final jar/war file
  outputDir: process.env.NODE_ENV === 'development' ? 'dist' : '../resources/public',
  // For production build, index.html is treated as a Spring Thymeleaf template
  indexPath: process.env.NODE_ENV === 'development' ? 'index.html' : '../templates/index.html',
  // For development, proxy all action requests
  devServer: {
    port: 4200,
    proxy: process.env.NODE_ENV === 'development' ? {
      '^/action': {
        target: process.env.VUE_APP_API_GATEWAY_URL,
        ws: true,
        changeOrigin: true,
      },
    } : null,
  },
};
