/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  output: "standalone",
  // distDir: '../out',
  // images: {
  //   unoptimized: true
  // },
  reactStrictMode: false,
  webpack(config) {
    // config.resolve = {
    //   ...config.resolve,
    //   fallback: {
    //     "fs": false,
    //     "path": false,
    //     "os": false,
    //   }
    // }
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.module.rules.push({
      test: /\.txt$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;