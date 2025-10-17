"use client"

import React, { createContext, useContext } from "react"
import { useTelegramUser } from "@/hooks/useTelegramUser"

type TelegramUser = any

interface UserContextType {
	user: TelegramUser | null
	isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const userState = useTelegramUser()

	return (
		<UserContext.Provider value={userState as UserContextType}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider")
	}
	return context
}
