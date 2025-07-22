/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180, // 180초(3분)로 설정
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
}

module.exports = nextConfig