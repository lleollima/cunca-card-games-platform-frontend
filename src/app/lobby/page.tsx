'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomCard } from '@/components/room-card';
import { roomsAPI, Room } from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import { getSocket } from '@/lib/socket';

/**
 * Página do lobby principal
 * Lista salas disponíveis e permite criar/entrar em salas
 */
export default function LobbyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useUserStore();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');

  // Redireciona se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Carrega lista de salas
  const loadRooms = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Carregando lista de jogos...');
      const data = await roomsAPI.list();
      console.log('✅ Jogos carregados:', data.length);

      setRooms(data);
    } catch (err) {
      console.error('❌ Erro ao carregar salas:', err);

      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';

      // Verifica se é erro 401 (não autenticado)
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        // Limpa dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redireciona para login após 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(`Erro ao carregar salas: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Carrega salas na montagem
  useEffect(() => {
    if (isAuthenticated) {
      loadRooms();
    }
  }, [isAuthenticated]);

  // Escuta atualizações de salas via WebSocket
  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      // Handler para atualização de jogos
      const handleGameUpdate = (updatedGames: any[]) => {
        console.log('Jogos atualizados via WebSocket:', updatedGames);
        setRooms(updatedGames);
      };

      // Escuta ambos os eventos (game_update e room_update para compatibilidade)
      socket.on('game_update', handleGameUpdate);
      socket.on('room_update', handleGameUpdate);

      return () => {
        socket.off('game_update', handleGameUpdate);
        socket.off('room_update', handleGameUpdate);
      };
    }
  }, []);

  // Cria nova sala
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoomName.trim()) {
      return;
    }

    setCreating(true);
    setError('');

    try {
      const room = await roomsAPI.create(newRoomName.trim());

      // Reseta formulário
      setNewRoomName('');
      setShowCreateForm(false);

      // Recarrega lista de salas
      await loadRooms();

      // Entra na sala criada
      router.push(`/room/${room.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar sala');
    } finally {
      setCreating(false);
    }
  };

  // Entra em uma sala
  const handleJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Lobby</h1>
        <p className="text-muted-foreground">
          Bem-vindo, <span className="font-medium">{user?.name}</span>! Escolha uma sala para começar a jogar.
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar Nova Sala
        </Button>

        <Button
          variant="outline"
          onClick={loadRooms}
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Formulário de criação de sala */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Criar Nova Sala</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRoom} className="flex gap-4">
              <Input
                placeholder="Nome da sala"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                disabled={creating}
                className="flex-1"
                maxLength={50}
                required
              />
              <Button type="submit" disabled={creating || !newRoomName.trim()}>
                {creating ? 'Criando...' : 'Criar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewRoomName('');
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Mensagens de erro */}
      {error && (
        <div className="p-4 mb-6 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {/* Lista de salas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando salas...</p>
        </div>
      ) : rooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma sala disponível no momento.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Seja o primeiro a criar uma sala!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onJoin={handleJoinRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
}

