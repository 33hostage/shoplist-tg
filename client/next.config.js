const withPWA = require("next-pwa")({
	desc: "public",
	disable: process.env.NODE_ENV === "development",
	register: true,
	skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Прокси для dev-режима
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/api/:path*",
			},
		]
	},
}

module.exports = withPWA(nextConfig)
