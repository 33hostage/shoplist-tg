"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SharedListRedirector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sharedListId = searchParams.get('listId');

    useEffect(() => {
        if (sharedListId) {
            console.log('Redirecting to shared list:', sharedListId);
            router.replace(`/list/${sharedListId}`);
        }
    }, [sharedListId, router]);

    // Этот компонент ничего не рендерит, он только перенаправляет.
    return null; 
}