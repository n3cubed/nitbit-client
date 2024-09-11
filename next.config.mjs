/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
      use: 'raw-loader', // Use 'raw-loader' to import the text content as a string
    });
    return config;
  },
};

export default nextConfig;
