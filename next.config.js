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
}

module.exports = nextConfig
