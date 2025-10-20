"use client"

import WelcomeScreen from "@/components/WelcomeScreen" // Импортируем компонент-обертку
import { useRouter } from "next/navigation"

export default function WelcomePage() {
    const router = useRouter()

    return (
        <WelcomeScreen
            onContinue={() => {
                router.replace("/") // Переход на главную после показа
            }}
        />
    )
}