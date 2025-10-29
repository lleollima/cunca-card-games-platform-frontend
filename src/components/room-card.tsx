'use client';

import { Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Room } from '@/lib/api';

interface RoomCardProps {
  room: Room;
  onJoin: (roomId: string) => void;
}

/**
 * Card de sala no lobby
 * Exibe informações da sala e botão para entrar
 */
export function RoomCard({ room, onJoin }: RoomCardProps) {
  const isFull = room.playerCount >= room.maxPlayers;
  const isPlaying = room.status === 'playing';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{room.name}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              room.status === 'waiting'
                ? 'bg-green-500/20 text-green-400'
                : room.status === 'playing'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {room.status === 'waiting' ? 'Aguardando' : room.status === 'playing' ? 'Jogando' : 'Finalizado'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Contador de jogadores */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {room.playerCount} / {room.maxPlayers} jogadores
          </span>
        </div>

        {/* Data de criação */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Criada {new Date(room.createdAt).toLocaleString('pt-BR')}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onJoin(room.id)}
          disabled={isFull || isPlaying}
        >
          {isFull ? 'Sala cheia' : isPlaying ? 'Em andamento' : 'Entrar'}
        </Button>
      </CardFooter>
    </Card>
  );
}

