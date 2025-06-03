/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pagesのビルド時のみexportを有効にする
  ...(process.env.EXPORT === 'true' && {
    output: 'export',
  }),
  // テストファイルをページビルドから除外
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    typedRoutes: false,
  },
  webpack: (config) => {
    // テストファイルをビルド対象から除外
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });
    return config;
  },
}

module.exports = nextConfig
