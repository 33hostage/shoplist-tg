"use client"

import { useRouter } from "next/navigation"

interface BackButtonProps {
	onClick?: () => void
	ariaLabel?: string
}

export default function BackButton({
	onClick,
	ariaLabel = "Назад",
}: BackButtonProps) {
	const router = useRouter()

	const handleClick = () => {
		if (onClick) {
			onClick()
		} else {
			router.back()
		}
	}

	return (
		<button
			className="text-blue-500 mb-4 flex items-center hover:text-blue-300 dark:text-gray-300 hover:dark:text-gray-500 duration-150"
      onClick={handleClick}
      aria-label={ariaLabel}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="25"
				height="25"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="mr-2"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>
		</button>
	)
}
