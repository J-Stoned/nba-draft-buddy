/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-lsxvzn0ll-justinrstone81-gmailcoms-projects.vercel.app/api',
  },
}

module.exports = nextConfig