/** @type {import('next').NextConfig} */

// 通过环境变量控制构建模式
// - STATIC_EXPORT: 静态导出模式（默认）
// - SERVER_MODE: 服务端模式（启用 ISR）
const isStaticExport = process.env.STATIC_EXPORT === 'true' || !process.env.SERVER_MODE

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // 静态导出配置
  ...(isStaticExport && {
    output: 'export',
    distDir: 'dist',
    // 在构建时生成所有动态路由
    // 文章会通过 generateStaticParams 生成
  }),
}

export default nextConfig
