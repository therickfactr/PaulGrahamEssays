/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Ignore critical dependency warnings from express
    config.module.rules.push({
      test: /node_modules\/express\/lib\/view\.js/,
      use: {
        loader: 'null-loader',
      },
    });

    // Add fallback for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      zlib: false,
      http: false,
      https: false,
      os: false,
    };

    return config;
  },
}

module.exports = nextConfig
