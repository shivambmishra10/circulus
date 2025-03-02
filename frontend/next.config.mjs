/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: true, // Generates better source maps
    reactStrictMode: true,
    output: 'export', // Ensures full static site export
    experimental: {
      appDir: false, // Disable the new App Router to prevent unexpected SSR behavior
    },
  
};
// module.exports = {
    // };
  
export default nextConfig;
