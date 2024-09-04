/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
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
