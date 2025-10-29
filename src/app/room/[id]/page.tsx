'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chat } from '@/components/chat';
import { PlayerList } from '@/components/player-list';
import { useUserStore } from '@/store/user-store';
import { getSocket, socketEmit, Player, ChatMessage } from '@/lib/socket';
import { roomsAPI, Room } from '@/lib/api';

/**
 * Página da sala de jogo
 * Exibe jogadores conectados, chat, e área de jogo
 */
export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const { isAuthenticated, user } = useUserStore();

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redireciona se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Carrega dados da sala
  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        const data = await roomsAPI.get(roomId);
        setRoom(data);
      } catch (err) {
        console.error('Erro ao carregar sala:', err);
        setError('Sala não encontrada');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && roomId) {
      loadRoom();
    }
  }, [isAuthenticated, roomId]);

  // Conecta ao WebSocket da sala
  useEffect(() => {
    if (!isAuthenticated || !roomId) return;

    const socket = getSocket();

    if (socket) {
      // Entra na sala
      socketEmit.joinRoom(roomId);
      console.log('Entrando na sala:', roomId);

      // Eventos de jogadores
      socket.on('player_joined', (player: Player) => {
        console.log('Jogador entrou:', player);
        setPlayers((prev) => [...prev, player]);
      });

      socket.on('player_left', (player: Player) => {
        console.log('Jogador saiu:', player);
        setPlayers((prev) => prev.filter((p) => p.id !== player.id));
      });

      // Eventos de chat
      socket.on('message', (message: ChatMessage) => {
        console.log('Nova mensagem:', message);
        setMessages((prev) => [...prev, message]);
      });

      // Cleanup ao sair da página
      return () => {
        socketEmit.leaveRoom(roomId);
        socket.off('player_joined');
        socket.off('player_left');
        socket.off('message');
      };
    }
  }, [isAuthenticated, roomId]);

  // Envia mensagem no chat
  const handleSendMessage = (message: string) => {
    socketEmit.sendMessage(roomId, message);
  };

  // Volta para o lobby
  const handleBackToLobby = () => {
    router.push('/lobby');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando sala...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">{error || 'Sala não encontrada'}</p>
            <Button onClick={handleBackToLobby}>Voltar ao Lobby</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Cabeçalho da sala */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToLobby}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{room.name}</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Sala #{roomId.slice(0, 8)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              room.status === 'waiting'
                ? 'bg-green-500/20 text-green-400'
                : room.status === 'playing'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {room.status === 'waiting' ? 'Aguardando' : room.status === 'playing' ? 'Jogando' : 'Finalizado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área principal de jogo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mesa de jogo - Placeholder para futura implementação */}
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>Mesa de Jogo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-2">🎴</p>
                <p>A mesa de jogo será implementada aqui</p>
                <p className="text-sm mt-2">Aguardando início do jogo...</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra lateral */}
        <div className="space-y-6">
          {/* Lista de jogadores */}
          <PlayerList players={players} currentUserId={user?.id} />

          {/* Chat */}
          <div className="h-[500px]">
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

