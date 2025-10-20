// Кнопка поделиться

'use client';

import { toast } from 'sonner';

interface ShareButtonProps {
  listId: string;
  botUsername: string; // ← имя бота (например, "YourBotName")
}

export default function ShareButton({ listId, botUsername }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = `https://t.me/${botUsername}/app?start=app_${listId}`;

    // Функция для копирования текста в буфер обмена
    const copyToClipboard = async (text: string) => {
      if ("clipboard" in navigator) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (err) {
          console.warn("Failed to copy using Clipboard API:", err);
          return false;
        }
      } else {
        console.warn("Clipboard API not available");
        return false;
      }
    };

    const success = await copyToClipboard(shareUrl);
    if (success) {
      toast.success("✅ Ссылка скопирована!", { duration: 1500 });
    } else {
      toast.error("❌ Не удалось скопировать ссылку", {
        duration: 3000,
      });
    }
  };


	return (
		 <button
      onClick={handleShare}
      className="mt-6 flex items-center gap-1 text-s text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      aria-label="Поделиться списком"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="mr-1"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      Поделиться списком
    </button>
	)
}