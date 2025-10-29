/**
 * Cliente API REST para comunicação com o backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Faz requisições autenticadas ao backend
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Obtém o token do localStorage (cliente side apenas)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Adiciona headers customizados se existirem
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Adiciona token de autenticação
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ Token não encontrado no localStorage');
  }

  console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    headers: { ...headers, Authorization: token ? 'Bearer ***' : 'none' }
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    console.error(`[API Error] ${response.status}:`, error);
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Interface de resposta de autenticação
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Interface de jogo/sala
 */
export interface Game {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
}

// Alias para compatibilidade (Room = Game)
export type Room = Game;

/**
 * API de autenticação
 */
export const authAPI = {
  /**
   * Registra um novo usuário
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  /**
   * Faz login de um usuário
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

/**
 * API de jogos/salas
 */
export const gamesAPI = {
  /**
   * Lista todos os jogos disponíveis
   */
  async list(): Promise<Game[]> {
    return fetchAPI('/api/games');
  },

  /**
   * Cria um novo jogo
   */
  async create(name: string, maxPlayers: number = 4): Promise<Game> {
    return fetchAPI('/api/games', {
      method: 'POST',
      body: JSON.stringify({ name, maxPlayers }),
    });
  },

  /**
   * Obtém detalhes de um jogo específico
   */
  async get(gameId: string): Promise<Game> {
    return fetchAPI(`/api/games/${gameId}`);
  },

  /**
   * Entra em um jogo existente
   */
  async join(gameId: string): Promise<void> {
    return fetchAPI('/api/games/join', {
      method: 'POST',
      body: JSON.stringify({ gameId }),
    });
  },

  /**
   * Sai de um jogo
   */
  async leave(gameId: string): Promise<void> {
    return fetchAPI(`/api/games/leave/${gameId}`, {
      method: 'POST',
    });
  },

  /**
   * Executa uma ação no jogo
   */
  async action(gameId: string, action: any): Promise<void> {
    return fetchAPI('/api/games/action', {
      method: 'POST',
      body: JSON.stringify({ gameId, action }),
    });
  },
};

// Alias para compatibilidade com código existente
export const roomsAPI = gamesAPI;

