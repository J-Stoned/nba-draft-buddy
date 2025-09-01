/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Use app directory
    appDir: false, // Keep using pages for API routes
    
    // Enable serverless functions
    esmExternals: true,
    
    // Optimize for serverless deployment
    outputFileTracingRoot: undefined,
  },
  
  // TypeScript configuration
  typescript: {
    // Enable strict type checking
    tsconfigPath: './tsconfig.json',
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for API routes
  async headers() {
    return [
      {
        source: '/api/trpc/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://nbadraftbuddy.com' 
              : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
    ];
  },
  
  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/api/trpc',
        permanent: false,
      },
    ];
  },
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Bundle analyzer
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size
    if (!isServer && !dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': './src',
      };
    }
    
    return config;
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['cdn.nba.com', 'ak-static.cms.nba.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;