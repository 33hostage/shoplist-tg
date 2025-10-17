import * as crypto from "crypto"

export function verifyTelegramData(
	initData: string,
	botToken: string
): boolean {
	// Временно пропускать проверку в dev
	if (process.env.NODE_ENV === "development") {
		return true
	}
	const searchParams = new URLSearchParams(initData)
	const hash = searchParams.get("hash")
	if (!hash) return false

	searchParams.delete("hash")
	const dataCheckString = Array.from(searchParams.entries())
		.map(([key, value]) => `${key}=${value}`)
		.sort()
		.join("\n")

	const secretKey = crypto
		.createHmac("sha256", "WebAppData")
		.update(botToken)
		.digest()

	const computedHash = crypto
		.createHmac("sha256", secretKey)
		.update(dataCheckString)
		.digest("hex")

	return computedHash === hash
}
