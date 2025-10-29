# Changelog - Cunca Card Games Platform

## [1.1.0] - 2025-10-28

### 🔄 Changed - Atualização de Endpoints da API

#### Endpoints Atualizados
- Migração de `/api/rooms` para `/api/games`
- Todos os endpoints agora usam a terminologia "games" em vez de "rooms"

#### Novos Endpoints
- ✅ `GET /api/games` - Lista jogos disponíveis
- ✅ `POST /api/games` - Cria novo jogo
- ✅ `GET /api/games/:id` - Detalhes do jogo
- ✅ `POST /api/games/join` - Entra em um jogo
- ✅ `POST /api/games/leave/:gameId` - Sai de um jogo
- ✅ `POST /api/games/action` - Executa ação no jogo

#### WebSocket Events Atualizados
- **Client → Server:**
  - ✅ `join_game` (mantém `join_room` como alias)
  - ✅ `leave_game` (mantém `leave_room` como alias)
  - ✅ `game_action` (novo evento)
  - ✅ `send_message` (atualizado para aceitar `gameId`)

- **Server → Client:**
  - ✅ `game_update` (mantém `room_update` como alias)
  - ✅ `player_joined`
  - ✅ `player_left`
  - ✅ `message`
  - ✅ `game_state`

#### Compatibilidade Retroativa
Para facilitar a transição, mantemos aliases de compatibilidade:

```typescript
// API
export const roomsAPI = gamesAPI; // roomsAPI continua funcionando
export type Room = Game; // Type Room continua funcionando

// WebSocket
socket.emit('join_room', id); // Funciona
socket.emit('join_game', id); // Recomendado

socket.on('room_update', handler); // Funciona
socket.on('game_update', handler); // Recomendado
```

#### Arquivos Modificados
1. **`src/lib/api.ts`**
   - Renomeado `roomsAPI` para `gamesAPI`
   - Adicionado alias `roomsAPI = gamesAPI`
   - Adicionado type `Room = Game`
   - Novos métodos: `join()`, `leave()`, `action()`

2. **`src/lib/socket.ts`**
   - Novos eventos: `join_game`, `leave_game`, `game_action`, `game_update`
   - Mantidos aliases para compatibilidade
   - Atualizadas interfaces de tipos

3. **`src/app/lobby/page.tsx`**
   - Escuta ambos eventos: `game_update` e `room_update`

4. **`API_CONTRACT.md`**
   - Documentação completa dos novos endpoints
   - Exemplos de uso atualizados
   - Tipos TypeScript atualizados

#### Migração Suave
O código existente **continua funcionando** graças aos aliases:

```typescript
// ✅ Código antigo continua funcionando
import { roomsAPI } from '@/lib/api';
const rooms = await roomsAPI.list();

// ✅ Código novo (recomendado)
import { gamesAPI } from '@/lib/api';
const games = await gamesAPI.list();
```

#### Próximos Passos
- [ ] Atualizar componentes para usar nova terminologia
- [ ] Testar integração com backend
- [ ] Atualizar documentação de exemplos

---

## [1.0.0] - 2025-10-28

### 🎉 Initial Release

#### Features
- ✅ Autenticação completa (Login/Registro)
- ✅ Sistema de salas/lobbies
- ✅ Chat em tempo real
- ✅ WebSocket integrado
- ✅ Design responsivo
- ✅ Documentação completa

#### Tech Stack
- Next.js 14.2.5
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Socket.IO Client 4.7.2
- Zustand 4.5.2
- shadcn/ui

---

## Convenções de Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Mudanças incompatíveis na API
- **MINOR** (x.1.x): Novas funcionalidades compatíveis
- **PATCH** (x.x.1): Correções de bugs

### Tipos de Mudanças
- `Added` - Novas funcionalidades
- `Changed` - Mudanças em funcionalidades existentes
- `Deprecated` - Funcionalidades que serão removidas
- `Removed` - Funcionalidades removidas
- `Fixed` - Correções de bugs
- `Security` - Correções de vulnerabilidades

