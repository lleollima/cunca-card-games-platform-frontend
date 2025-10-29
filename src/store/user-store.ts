/**
 * Store global do usuário usando Zustand
 * Gerencia o estado de autenticação e dados do jogador
 */

import { create } from 'zustand';
import { initSocket, disconnectSocket } from '@/lib/socket';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Ações
  login: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

/**
 * Store do usuário com persistência no localStorage
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  /**
   * Faz login e salva no localStorage
   */
  login: (token: string, user: User) => {
    console.log('🔐 Login: Salvando dados...', {
      userId: user.id,
      userName: user.name,
      tokenLength: token.length
    });

    // Salva no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    console.log('💾 Token salvo no localStorage');

    // Inicializa o WebSocket com o token
    initSocket(token);

    set({
      user,
      token,
      isAuthenticated: true,
    });

    console.log('✅ Login completo: isAuthenticated = true');
  },

  /**
   * Faz logout e limpa o localStorage
   */
  logout: () => {
    console.log('🚪 Logout: Limpando dados...');

    // Remove do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');

    // Desconecta o WebSocket
    disconnectSocket();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    console.log('✅ Logout completo');
  },

  /**
   * Carrega dados do localStorage (para persistência entre reloads)
   */
  loadFromStorage: () => {
    if (typeof window === 'undefined') {
      console.log('🔒 loadFromStorage: Executando no servidor, pulando...');
      return;
    }

    console.log('🔄 loadFromStorage: Carregando dados do localStorage...');

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    console.log('🔍 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NENHUM');
    console.log('🔍 User encontrado:', userStr ? 'SIM' : 'NÃO');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);

        console.log('✅ Dados carregados com sucesso:', {
          userId: user.id,
          userName: user.name,
          hasToken: !!token
        });

        // Inicializa o WebSocket com o token
        initSocket(token);

        set({
          user,
          token,
          isAuthenticated: true,
        });

        console.log('✅ Store atualizado: isAuthenticated = true');
      } catch (error) {
        console.error('❌ Erro ao carregar dados do localStorage:', error);
        // Limpa dados corrompidos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('🗑️ Dados corrompidos removidos do localStorage');
      }
    } else {
      console.log('⚠️ Token ou usuário não encontrado no localStorage');
    }
  },
}));

