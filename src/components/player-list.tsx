'use client';

import { Users, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/lib/socket';

interface PlayerListProps {
  players: Player[];
  currentUserId?: string;
}

/**
 * Lista de jogadores conectados na sala
 */
export function PlayerList({ players, currentUserId }: PlayerListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Jogadores ({players.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li
              key={player.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                player.id === currentUserId
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Ícone de coroa para o primeiro jogador (host) */}
                {index === 0 && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
                <span className="font-medium">{player.name}</span>
                {player.id === currentUserId && (
                  <span className="text-xs text-muted-foreground">(Você)</span>
                )}
              </div>
            </li>
          ))}

          {players.length === 0 && (
            <li className="text-center text-muted-foreground py-4">
              Nenhum jogador conectado
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

