import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientProviders from "@/components/ClientProviders"
import { Toaster } from "sonner"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Simple List",
	description: "Коллективный список покупок и задач в Telegram",
	manifest: "/manifest.json",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
				/>
				<meta
					name="format-detection"
					content="telephone=no, date=no, email=no, address=no"
				/>
				<meta name="theme-color" content="#3b82f6" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/icon-192.png" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ClientProviders>{children}</ClientProviders>
				<Toaster position="top-center" />
			</body>
		</html>
	)
}
