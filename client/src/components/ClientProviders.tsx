'use client'

import { useEffect } from 'react';
import { StoreProvider } from "@/store/provider";
import { TelegramInitializer } from "@/components/TelegramInitializer"
import { ThemeInitializer } from '@/components/ThemeInitializer';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
	// Очищаем sessionStorage когда вкладка закрывается
  useEffect(() => {
    // Проверяем, первый ли это запуск в этой "жизни" вкладки
    if (!sessionStorage.getItem('app_session_started')) {
      // Это новая сессия/открытие Mini App
      sessionStorage.clear(); // Полная очистка
      sessionStorage.setItem('app_session_started', 'true');
    }
  }, []);

  return (
    <StoreProvider>
      <TelegramInitializer />
      <ThemeInitializer />
      {children}
    </StoreProvider>
  );
}