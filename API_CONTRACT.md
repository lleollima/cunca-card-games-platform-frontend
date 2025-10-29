# Contrato de API - Backend Cunca

Este documento define o contrato de API que o frontend espera do backend.

---

## 🔐 Autenticação

### POST `/api/auth/register`

Registra um novo usuário.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid-123",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

**Errors:**
- `400` - Dados inválidos
- `409` - Email já existe

---

### POST `/api/auth/login`

Autentica um usuário existente.

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid-123",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

**Errors:**
- `400` - Dados inválidos
- `401` - Credenciais inválidas

---

## 🏠 Jogos/Salas

### GET `/api/games`

Lista todos os jogos disponíveis.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "game-uuid-1",
    "name": "Sala de Truco",
    "playerCount": 2,
    "maxPlayers": 4,
    "status": "waiting",
    "createdAt": "2025-01-28T10:30:00Z"
  },
  {
    "id": "game-uuid-2",
    "name": "Buraco Rápido",
    "playerCount": 4,
    "maxPlayers": 4,
    "status": "playing",
    "createdAt": "2025-01-28T10:25:00Z"
  }
]
```

**Errors:**
- `401` - Não autenticado

---

### POST `/api/games`

Cria um novo jogo.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Minha Sala",
  "maxPlayers": 4
}
```

**Response (201):**
```json
{
  "id": "game-uuid-3",
  "name": "Minha Sala",
  "playerCount": 0,
  "maxPlayers": 4,
  "status": "waiting",
  "createdAt": "2025-01-28T10:35:00Z"
}
```

**Errors:**
- `400` - Dados inválidos
- `401` - Não autenticado

---

### GET `/api/games/:id`

Obtém detalhes de um jogo específico.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "game-uuid-1",
  "name": "Sala de Truco",
  "playerCount": 2,
  "maxPlayers": 4,
  "status": "waiting",
  "createdAt": "2025-01-28T10:30:00Z",
  "players": [
    {
      "id": "user-uuid-1",
      "name": "João Silva"
    },
    {
      "id": "user-uuid-2",
      "name": "Maria Santos"
    }
  ]
}
```

**Errors:**
- `401` - Não autenticado
- `404` - Jogo não encontrado

---

### POST `/api/games/join`

Entra em um jogo existente.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "gameId": "game-uuid-1"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Joined game successfully"
}
```

**Errors:**
- `400` - Dados inválidos ou jogo cheio
- `401` - Não autenticado
- `404` - Jogo não encontrado

---

### POST `/api/games/leave/:gameId`

Sai de um jogo.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Left game successfully"
}
```

**Errors:**
- `401` - Não autenticado
- `404` - Jogo não encontrado

---

### POST `/api/games/action`

Executa uma ação no jogo.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "gameId": "game-uuid-1",
  "action": {
    "type": "play_card",
    "cardId": "card-123",
    "data": {}
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "gameState": {
    // Estado atualizado do jogo
  }
}
```

**Errors:**
- `400` - Ação inválida
- `401` - Não autenticado
- `404` - Jogo não encontrado

---

## 🔌 WebSocket Events

### Conexão

**Client → Server:**
```javascript
io.connect(SOCKET_URL, {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
});
```

O servidor deve validar o token e aceitar/rejeitar a conexão.

---

### Eventos: Client → Server

#### `join_game` (ou `join_room`)

Jogador entra em um jogo.

**Payload:**
```typescript
gameId: string
```

**Exemplo:**
```javascript
socket.emit('join_game', 'game-uuid-1');
// Ou para compatibilidade:
socket.emit('join_room', 'game-uuid-1');
```

---

#### `leave_game` (ou `leave_room`)

Jogador sai de um jogo.

**Payload:**
```typescript
gameId: string
```

**Exemplo:**
```javascript
socket.emit('leave_game', 'game-uuid-1');
// Ou para compatibilidade:
socket.emit('leave_room', 'game-uuid-1');
```

---

#### `send_message`

Jogador envia mensagem no chat.

**Payload:**
```typescript
{
  gameId: string; // ou roomId para compatibilidade
  message: string;
}
```

**Exemplo:**
```javascript
socket.emit('send_message', {
  gameId: 'game-uuid-1',
  message: 'Olá pessoal!'
});
```

---

#### `game_action`

Jogador executa uma ação no jogo.

**Payload:**
```typescript
{
  gameId: string;
  action: any;
}
```

**Exemplo:**
```javascript
socket.emit('game_action', {
  gameId: 'game-uuid-1',
  action: {
    type: 'play_card',
    cardId: 'card-123'
  }
});
```

---

### Eventos: Server → Client

#### `game_update` (ou `room_update`)

Lista de jogos foi atualizada (novo jogo criado, jogo removido, etc).

**Payload:**
```typescript
Game[]
```

**Exemplo:**
```javascript
socket.on('game_update', (games) => {
  console.log('Jogos atualizados:', games);
});

// Também suporta room_update para compatibilidade
socket.on('room_update', (games) => {
  console.log('Jogos atualizados:', games);
});
```

---

#### `player_joined`

Um jogador entrou na sala.

**Payload:**
```typescript
{
  id: string;
  name: string;
}
```

**Exemplo:**
```javascript
socket.on('player_joined', (player) => {
  console.log('Jogador entrou:', player.name);
});
```

---

#### `player_left`

Um jogador saiu da sala.

**Payload:**
```typescript
{
  id: string;
  name: string;
}
```

**Exemplo:**
```javascript
socket.on('player_left', (player) => {
  console.log('Jogador saiu:', player.name);
});
```

---

#### `message`

Nova mensagem no chat.

**Payload:**
```typescript
{
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string; // ISO 8601
}
```

**Exemplo:**
```javascript
socket.on('message', (msg) => {
  console.log(`${msg.playerName}: ${msg.message}`);
});
```

---

#### `game_state`

Estado do jogo foi atualizado (para implementação futura).

**Payload:**
```typescript
any // Estrutura depende do jogo
```

**Exemplo:**
```javascript
socket.on('game_state', (state) => {
  console.log('Novo estado:', state);
});
```

---

#### `error`

Erro ocorreu no servidor.

**Payload:**
```typescript
{
  message: string;
}
```

**Exemplo:**
```javascript
socket.on('error', (error) => {
  console.error('Erro:', error.message);
});
```

---

## 🎯 Tipos TypeScript

Para referência, aqui estão os tipos esperados:

```typescript
// User
interface User {
  id: string;
  name: string;
  email: string;
}

// AuthResponse
interface AuthResponse {
  token: string;
  user: User;
}

// Game (ou Room para compatibilidade)
interface Game {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string; // ISO 8601
}

// Alias para compatibilidade
type Room = Game;

// Player (in game)
interface Player {
  id: string;
  name: string;
}

// ChatMessage
interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string; // ISO 8601
}

// Game Action
interface GameAction {
  type: string;
  [key: string]: any;
}
```

---

## 🔒 Segurança

### CORS

O backend deve permitir CORS para o domínio do frontend:

```javascript
// Express exemplo
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### WebSocket CORS

```javascript
// Socket.IO exemplo
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
```

### JWT Validation

```javascript
// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

### WebSocket Authentication

```javascript
// Socket.IO middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.id;
    next();
  });
});
```

---

## 📊 Códigos de Status HTTP

- `200` OK - Requisição bem sucedida
- `201` Created - Recurso criado com sucesso
- `400` Bad Request - Dados inválidos
- `401` Unauthorized - Não autenticado
- `403` Forbidden - Não autorizado
- `404` Not Found - Recurso não encontrado
- `409` Conflict - Conflito (ex: email já existe)
- `500` Internal Server Error - Erro no servidor

---

## 🧪 Testando a API

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'
```

**Listar jogos:**
```bash
curl http://localhost:8000/api/games \
  -H "Authorization: Bearer {token}"
```

**Criar jogo:**
```bash
curl -X POST http://localhost:8000/api/games \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Minha Sala","maxPlayers":4}'
```

**Entrar em jogo:**
```bash
curl -X POST http://localhost:8000/api/games/join \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"gameId":"game-uuid-1"}'
```

**Sair de jogo:**
```bash
curl -X POST http://localhost:8000/api/games/leave/game-uuid-1 \
  -H "Authorization: Bearer {token}"
```

**Executar ação:**
```bash
curl -X POST http://localhost:8000/api/games/action \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"gameId":"game-uuid-1","action":{"type":"play_card","cardId":"card-123"}}'
```

---

## 📝 Notas de Implementação

1. **IDs**: Recomenda-se usar UUIDs para IDs de usuários e salas
2. **Timestamps**: Usar formato ISO 8601 (ex: `2025-01-28T10:30:00Z`)
3. **Validação**: Validar todos os inputs antes de processar
4. **Rate Limiting**: Implementar rate limiting para prevenir abuso
5. **Logging**: Logar todas as requisições e eventos importantes
6. **Persistência**: Decidir entre memória (rápido, não persiste) ou banco de dados (persiste)

---

## 🚀 Variáveis de Ambiente do Backend

```env
# .env do backend
PORT=8000
JWT_SECRET=seu-secret-super-secreto-aqui
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://... # se usar banco
NODE_ENV=development
```

---

## 📚 Recursos Úteis

- [Express.js](https://expressjs.com/)
- [Socket.IO Server](https://socket.io/docs/v4/server-api/)
- [JWT](https://jwt.io/)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

Última atualização: 2025-10-28

