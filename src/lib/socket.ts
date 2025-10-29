/**
 * Configuração e gerenciamento de WebSocket usando Socket.IO
 */

import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';

/**
 * Interface de jogador
 */
export interface Player {
  id: string;
  name: string;
}

/**
 * Interface de mensagem do chat
 */
export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string;
}

/**
 * Eventos que o servidor pode emitir
 */
export interface ServerToClientEvents {
  game_update: (games: any[]) => void;
  room_update: (games: any[]) => void; // Alias para compatibilidade
  player_joined: (player: Player) => void;
  player_left: (player: Player) => void;
  message: (message: ChatMessage) => void;
  game_state: (state: any) => void;
  error: (error: { message: string }) => void;
}

/**
 * Eventos que o cliente pode emitir
 */
export interface ClientToServerEvents {
  join_game: (gameId: string) => void;
  join_room: (gameId: string) => void; // Alias para compatibilidade
  leave_game: (gameId: string) => void;
  leave_room: (gameId: string) => void; // Alias para compatibilidade
  send_message: (data: { gameId: string; message: string } | { roomId: string; message: string }) => void;
  game_action: (data: { gameId: string; action: any }) => void;
}

/**
 * Instância global do socket
 */
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

/**
 * Inicializa a conexão WebSocket
 */
export function initSocket(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Eventos de conexão
  socket.on('connect', () => {
    console.log('✅ WebSocket conectado:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ WebSocket desconectado:', reason);
  });

  socket.on('error', (error) => {
    console.error('⚠️ Erro no WebSocket:', error);
  });

  return socket;
}

/**
 * Obtém a instância do socket
 */
export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
  return socket;
}

/**
 * Desconecta o socket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Funções auxiliares para emitir eventos
 */
export const socketEmit = {
  /**
   * Entra em um jogo
   */
  joinGame(gameId: string) {
    socket?.emit('join_game', gameId);
  },

  /**
   * Sai de um jogo
   */
  leaveGame(gameId: string) {
    socket?.emit('leave_game', gameId);
  },

  /**
   * Envia uma mensagem no chat
   */
  sendMessage(gameId: string, message: string) {
    socket?.emit('send_message', { gameId, message });
  },

  /**
   * Executa uma ação no jogo
   */
  gameAction(gameId: string, action: any) {
    socket?.emit('game_action', { gameId, action });
  },

  // Aliases para compatibilidade
  joinRoom(roomId: string) {
    this.joinGame(roomId);
  },

  leaveRoom(roomId: string) {
    this.leaveGame(roomId);
  },
};

