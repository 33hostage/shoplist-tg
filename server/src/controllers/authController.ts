import { Response, Request } from "express"

interface TelegramAuthUser {
	id: string | number
	first_name: string
	username?: string
	authToken: string
}

export const loginUser = async (req: Request, res: Response) => {
	const user = req.user as TelegramAuthUser

	if (!req.user || !user.authToken) {
		return res.status(401).json({ error: "Authentication failed." })
	}

	const { authToken, ...userData } = user

	const serializableUserData = {
		...userData,
		id: userData.id.toString(),
	}

	res.status(200).json({
		userData: serializableUserData,
		token: authToken,
	})
}
