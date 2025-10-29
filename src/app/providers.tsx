'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/user-store';

/**
 * Provider para inicialização de stores e contextos globais
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const loadFromStorage = useUserStore((state) => state.loadFromStorage);

  // Carrega dados do usuário do localStorage na inicialização
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return <>{children}</>;
}

