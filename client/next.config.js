/** @type {import('next').NextConfig} */
const nextConfig = {

  // Прокси для dev-режима (остается)
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:4000/api/:path*",
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;