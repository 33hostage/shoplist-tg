// Баннер "Отменить удаление"

"use client"

import { useEffect, useState } from "react"

interface UndoBannerProps {
	show: boolean
	onUndo: () => void
}

export default function UndoBanner({ show, onUndo }: UndoBannerProps) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (show) {
			setTimeout(() => setIsVisible(true), 10)
		} else {
			setIsVisible(false)
		}
	}, [show])

	if (!show && !isVisible) return null

	return (
		<div
			className={`fixed min-w-[250px] h-[50px] bottom-4 left-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-between shadow-lg transition-all duration-300 ease-out ${
				isVisible
					? "opacity-100 translate-y-0 scale-100"
					: "opacity-0 translate-y-4 scale-95 pointer-events-none"
			}`}
			style={{
				transform: isVisible
					? "translateX(-50%) translateY(0)"
					: "translateX(-50%) translateY(100%)",
				transition: "all 0.3s ease-out",
			}}
		>
			<span>Задача удалена</span>
			<button
				onClick={onUndo}
				className="ml-3 text-blue-300 hover:text-white font-medium"
			>
				Отменить
			</button>
		</div>
	)
}
