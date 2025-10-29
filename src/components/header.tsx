'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';

/**
 * Cabeçalho principal da aplicação
 * Exibe logo, navegação e botão de logout
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Não exibe header nas páginas de login/registro
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/lobby" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-xl font-bold">C</span>
          </div>
          <span className="text-2xl font-bold">Cunca</span>
        </Link>

        {/* Navegação e info do usuário */}
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            {/* Nome do usuário */}
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>

            {/* Botão de logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

