# 🔄 ATUALIZAÇÃO - Endpoints de API Modificados

## ✅ Mudanças Concluídas com Sucesso!

A API foi atualizada para usar o endpoint `/api/games` conforme solicitado. Todas as mudanças mantêm **compatibilidade retroativa** com o código existente.

---

## 📋 Resumo das Alterações

### 🔗 Novos Endpoints Implementados

#### REST API
- ✅ `GET /api/games` - Lista jogos disponíveis
- ✅ `POST /api/games` - Cria novo jogo  
- ✅ `GET /api/games/:id` - Detalhes do jogo
- ✅ `POST /api/games/join` - Entra em um jogo
- ✅ `POST /api/games/leave/:gameId` - Sai de um jogo
- ✅ `POST /api/games/action` - Executa ação no jogo

#### WebSocket Events
**Client → Server:**
- ✅ `join_game` - Entra em jogo
- ✅ `leave_game` - Sai de jogo
- ✅ `game_action` - Ação no jogo
- ✅ `send_message` - Mensagem (aceita `gameId` ou `roomId`)

**Server → Client:**
- ✅ `game_update` - Atualização de jogos
- ✅ `player_joined` - Jogador entrou
- ✅ `player_left` - Jogador saiu
- ✅ `message` - Mensagem do chat
- ✅ `game_state` - Estado do jogo

---

## 📂 Arquivos Modificados

### 1. `src/lib/api.ts`
**Mudanças:**
- Criado `gamesAPI` com todos os novos métodos
- Adicionado alias `roomsAPI = gamesAPI` para compatibilidade
- Adicionado type `Room = Game` para compatibilidade
- Novos métodos: `join()`, `leave()`, `action()`

**Uso:**
```typescript
import { gamesAPI } from '@/lib/api';

// Listar jogos
const games = await gamesAPI.list();

// Criar jogo
const game = await gamesAPI.create('Minha Sala', 4);

// Entrar em jogo
await gamesAPI.join('game-id');

// Sair de jogo
await gamesAPI.leave('game-id');

// Executar ação
await gamesAPI.action('game-id', { type: 'play_card', cardId: '123' });

// Compatibilidade: continua funcionando
import { roomsAPI } from '@/lib/api';
const rooms = await roomsAPI.list(); // ✅ Funciona!
```

---

### 2. `src/lib/socket.ts`
**Mudanças:**
- Novos eventos tipados
- Funções auxiliares atualizadas
- Aliases de compatibilidade mantidos

**Uso:**
```typescript
import { socketEmit } from '@/lib/socket';

// Novo (recomendado)
socketEmit.joinGame('game-id');
socketEmit.leaveGame('game-id');
socketEmit.gameAction('game-id', { type: 'play_card' });

// Antigo (ainda funciona)
socketEmit.joinRoom('game-id'); // ✅ Funciona!
socketEmit.leaveRoom('game-id'); // ✅ Funciona!
```

**Escutar eventos:**
```typescript
import { getSocket } from '@/lib/socket';

const socket = getSocket();

// Novo (recomendado)
socket?.on('game_update', (games) => {
  console.log('Jogos atualizados:', games);
});

// Antigo (ainda funciona)
socket?.on('room_update', (games) => {
  console.log('Jogos atualizados:', games);
});
```

---

### 3. `src/app/lobby/page.tsx`
**Mudanças:**
- Escuta ambos eventos: `game_update` e `room_update`
- Garante compatibilidade com ambas as implementações do backend

```typescript
// Escuta ambos os eventos
socket.on('game_update', handleGameUpdate);
socket.on('room_update', handleGameUpdate); // Compatibilidade
```

---

### 4. `API_CONTRACT.md`
**Mudanças:**
- Documentação completa dos novos endpoints
- Exemplos de uso com cURL
- Tipos TypeScript atualizados
- Eventos WebSocket documentados

---

## 🔄 Compatibilidade Retroativa

### ✅ Código Antigo Continua Funcionando

Graças aos aliases implementados, todo o código existente continua funcionando:

```typescript
// ✅ TUDO ISSO AINDA FUNCIONA:

// API
import { roomsAPI } from '@/lib/api';
const rooms = await roomsAPI.list();

// Types
const room: Room = { id: '1', name: 'Sala', ... };

// WebSocket
socketEmit.joinRoom('id');
socketEmit.leaveRoom('id');
socket.on('room_update', handler);
```

### ✨ Novo Código (Recomendado)

```typescript
// ✅ RECOMENDADO USAR:

// API
import { gamesAPI } from '@/lib/api';
const games = await gamesAPI.list();

// Types
const game: Game = { id: '1', name: 'Jogo', ... };

// WebSocket
socketEmit.joinGame('id');
socketEmit.leaveGame('id');
socket.on('game_update', handler);
```

---

## 🎯 Como Usar os Novos Endpoints

### Exemplo Completo de Fluxo

```typescript
import { gamesAPI } from '@/lib/api';
import { socketEmit, getSocket } from '@/lib/socket';

// 1. Listar jogos disponíveis
const games = await gamesAPI.list();
console.log('Jogos:', games);

// 2. Criar novo jogo
const newGame = await gamesAPI.create('Minha Sala de Truco', 4);
console.log('Jogo criado:', newGame.id);

// 3. Entrar em jogo via WebSocket
socketEmit.joinGame(newGame.id);

// 4. Escutar eventos do jogo
const socket = getSocket();
socket?.on('player_joined', (player) => {
  console.log('Jogador entrou:', player.name);
});

socket?.on('game_state', (state) => {
  console.log('Estado do jogo:', state);
});

// 5. Executar ação no jogo
await gamesAPI.action(newGame.id, {
  type: 'play_card',
  cardId: 'card-123'
});

// 6. Enviar mensagem
socketEmit.sendMessage(newGame.id, 'Boa jogada!');

// 7. Sair do jogo
await gamesAPI.leave(newGame.id);
socketEmit.leaveGame(newGame.id);
```

---

## 📚 Documentação Atualizada

Consulte os seguintes arquivos para mais detalhes:

1. **`API_CONTRACT.md`** - Contrato completo da API
   - Todos os endpoints detalhados
   - Exemplos de request/response
   - Eventos WebSocket
   - Exemplos com cURL

2. **`CHANGELOG.md`** - Histórico de mudanças
   - Versão 1.1.0 com todas as alterações
   - Guia de migração
   - Breaking changes (nenhum!)

3. **`src/lib/api.ts`** - Código fonte
   - Implementação completa
   - Tipos TypeScript
   - Comentários JSDoc

---

## 🧪 Testando as Mudanças

### Backend Esperado

O backend deve implementar os seguintes endpoints:

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/games
POST   /api/games
GET    /api/games/:id
POST   /api/games/join
POST   /api/games/leave/:gameId
POST   /api/games/action
```

### Eventos WebSocket

**Server deve escutar:**
- `join_game` ou `join_room`
- `leave_game` ou `leave_room`
- `send_message`
- `game_action`

**Server deve emitir:**
- `game_update` ou `room_update`
- `player_joined`
- `player_left`
- `message`
- `game_state`

---

## ✅ Status Final

| Item | Status | Notas |
|------|--------|-------|
| Endpoints REST | ✅ Implementado | Com compatibilidade |
| WebSocket Events | ✅ Implementado | Com aliases |
| Tipos TypeScript | ✅ Atualizado | Game e Room |
| Documentação | ✅ Atualizado | API_CONTRACT.md |
| Compatibilidade | ✅ Mantida | Código antigo funciona |
| Testes | ⏳ Pendente | Testar com backend |

---

## 🚀 Próximos Passos

1. ✅ **Testar com Backend**
   - Verificar se todos os endpoints respondem corretamente
   - Testar eventos WebSocket
   - Validar respostas

2. 📝 **Atualizar Componentes** (opcional)
   - Migrar gradualmente de `roomsAPI` para `gamesAPI`
   - Atualizar nomenclatura na UI (de "Sala" para "Jogo")

3. 🎮 **Implementar Lógica de Jogo**
   - Usar novo método `gamesAPI.action()`
   - Escutar evento `game_state`

---

## 🎉 Conclusão

Todas as mudanças foram implementadas com sucesso! 

- ✅ API atualizada para `/api/games`
- ✅ Compatibilidade retroativa mantida
- ✅ Documentação completa
- ✅ Pronto para integração com backend

O projeto está pronto para conectar com sua API!

---

**Última atualização:** 2025-10-28  
**Versão:** 1.1.0

